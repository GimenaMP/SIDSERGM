import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

const CACHE_FILE_PATH = path.join(process.cwd(), 'data', 'cached_latest_plan.json');

export async function GET(req: NextRequest) {
  try {
    // 1. Prioridad: Persistencia local rápida en disco (0 ms de latencia)
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const fileData = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
      const record = JSON.parse(fileData);
      return NextResponse.json({
        success: true,
        registro: record,
        source: 'local_file'
      });
    }

    // 2. Fallback: Consultar desde Supabase si está disponible
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('docente_checkins')
          .select('*')
          .order('actualizado_el', { ascending: false })
          .limit(1)
          .single();
        if (data && !error) {
          return NextResponse.json({
            success: true,
            registro: data,
            source: 'supabase'
          });
        }
      } catch (dbErr: any) {
        console.warn('Advertencia leyendo checkin desde Supabase:', dbErr.message);
      }
    }

    return NextResponse.json({
      success: false,
      mensaje: 'No hay planificación previa guardada en el servidor.'
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error recuperando planificación en caché' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { docenteId, planId, fecha, grados, materias, plan, estado, temasRezagados, configMatrix } = body;

    const record = {
      docente_id: docenteId || 'docente_multigrado_1',
      plan_id: planId || `plan_${Date.now()}`,
      fecha: fecha || new Date().toISOString().split('T')[0],
      grados: grados || [4, 5, 6],
      materias: materias || ['Matemáticas', 'Ciencias Naturales'],
      datos_plan: plan || null,
      estado: estado || 'completado',
      temas_rezagados: temasRezagados || [],
      config_matrix: configMatrix || null,
      actualizado_el: new Date().toISOString()
    };

    // 1. Guardar en Supabase si está configurado
    if (supabase) {
      try {
        const { error } = await supabase
          .from('docente_checkins')
          .upsert(record, { onConflict: 'plan_id' });
        
        if (error) {
          console.warn('Aviso guardando checkin en Supabase:', error.message);
        }
      } catch (dbErr: any) {
        console.warn('Advertencia base de datos check-in:', dbErr.message);
      }
    }

    // 2. Guardar en disco persistente (resiste recargas, cierres de sesión y reinicios)
    try {
      const dir = path.dirname(CACHE_FILE_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(record, null, 2), 'utf8');
    } catch (fsErr: any) {
      console.warn('Advertencia guardando caché local de plan:', fsErr.message);
    }

    return NextResponse.json({
      success: true,
      mensaje: 'Planificación y estado docente guardados en caché persistente.',
      timestamp: new Date().toISOString(),
      registro: record
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error registrando check-in' },
      { status: 500 }
    );
  }
}
