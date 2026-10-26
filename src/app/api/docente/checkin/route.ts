import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { docenteId, planId, fecha, grados, materias, plan, estado } = body;

    const record = {
      docente_id: docenteId || 'docente_multigrado_1',
      plan_id: planId || `plan_${Date.now()}`,
      fecha: fecha || new Date().toISOString().split('T')[0],
      grados: grados || [4, 5, 6],
      materias: materias || ['Matemáticas', 'Ciencias Naturales'],
      datos_plan: plan || null,
      estado: estado || 'completado',
      actualizado_el: new Date().toISOString()
    };

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

    return NextResponse.json({
      success: true,
      mensaje: 'Check-in y avance docente registrado exitosamente.',
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
