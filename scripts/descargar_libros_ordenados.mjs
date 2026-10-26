import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const BASE_DIR = path.resolve('data', 'libros_pdf');

// Mapeo detallado y categorizado de los libros oficiales MINEDUC
const LIBROS_CONFIG = [
  // ==========================================
  // PRIMER CICLO — 1.º PRIMARIA
  // ==========================================
  {
    id: 7,
    titulo: 'Matemáticas 1.º Primaria (1G)',
    ciclo: 'Primer_Ciclo',
    gradoDir: '1ro_Primaria',
    materiaDir: 'Matematicas',
    nombreArchivo: 'matematicas_1er_grado.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/matematicas_1G_compressed.pdf'
  },
  {
    id: 4,
    titulo: 'Leo y escribo paso 1 (1.º Primaria)',
    ciclo: 'Primer_Ciclo',
    gradoDir: '1ro_Primaria',
    materiaDir: 'Comunicacion_y_Lenguaje',
    nombreArchivo: 'leo_y_escribo_paso_1.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/leo_y_escribo_paso_1_compressed.pdf'
  },
  {
    id: 5,
    titulo: 'Leo y escribo paso 2 (1.º Primaria)',
    ciclo: 'Primer_Ciclo',
    gradoDir: '1ro_Primaria',
    materiaDir: 'Comunicacion_y_Lenguaje',
    nombreArchivo: 'leo_y_escribo_paso_2.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/leo_y_escribo_paso_2_compressed.pdf'
  },
  {
    id: 6,
    titulo: 'Mi libro de lecturas (1.º Primaria)',
    ciclo: 'Primer_Ciclo',
    gradoDir: '1ro_Primaria',
    materiaDir: 'Comunicacion_y_Lenguaje',
    nombreArchivo: 'mi_libro_de_lecturas_1ro.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/mi_libro_de_lecturas_1er_grado_compressed.pdf'
  },

  // ==========================================
  // PRIMER CICLO — 2.º PRIMARIA
  // ==========================================
  {
    id: 11,
    titulo: 'Matemáticas 2.º Primaria (2G)',
    ciclo: 'Primer_Ciclo',
    gradoDir: '2do_Primaria',
    materiaDir: 'Matematicas',
    nombreArchivo: 'matematicas_2do_grado.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/matematicas_2G_compressed.pdf'
  },
  {
    id: 53,
    titulo: 'Material Manipulable Matemáticas (2.º Primaria)',
    ciclo: 'Primer_Ciclo',
    gradoDir: '2do_Primaria',
    materiaDir: 'Matematicas',
    nombreArchivo: 'material_manipulable_matematicas_2do.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/Material_manipulable_G2.pdf'
  },
  {
    id: 9,
    titulo: 'Comunicación y Lenguaje (2.º Primaria)',
    ciclo: 'Primer_Ciclo',
    gradoDir: '2do_Primaria',
    materiaDir: 'Comunicacion_y_Lenguaje',
    nombreArchivo: 'comunicacion_y_lenguaje_2do_grado.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/comunicacion_y_lenguaje_2do_compressed.pdf'
  },
  {
    id: 10,
    titulo: 'Mi libro de lecturas (2.º Primaria)',
    ciclo: 'Primer_Ciclo',
    gradoDir: '2do_Primaria',
    materiaDir: 'Comunicacion_y_Lenguaje',
    nombreArchivo: 'mi_libro_de_lecturas_2do.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/mi_libro_de_lecturas_2do_grado_compressed.pdf'
  },
  {
    id: 12,
    titulo: 'Medio Social y Natural (2.º Primaria)',
    ciclo: 'Primer_Ciclo',
    gradoDir: '2do_Primaria',
    materiaDir: 'Medio_Social_y_Natural',
    nombreArchivo: 'medio_social_y_natural_2do_grado.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/medio_social_y_natural_2do_compressed.pdf'
  },

  // ==========================================
  // PRIMER CICLO — 3.º PRIMARIA
  // ==========================================
  {
    id: 15,
    titulo: 'Matemáticas 3.º Primaria (3G)',
    ciclo: 'Primer_Ciclo',
    gradoDir: '3ro_Primaria',
    materiaDir: 'Matematicas',
    nombreArchivo: 'matematicas_3er_grado.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/matematicas_3G_compressed.pdf'
  },
  {
    id: 54,
    titulo: 'Material Manipulable Matemáticas (3.º Primaria)',
    ciclo: 'Primer_Ciclo',
    gradoDir: '3ro_Primaria',
    materiaDir: 'Matematicas',
    nombreArchivo: 'material_manipulable_matematicas_3ro.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/Material_manipulable_G3.pdf'
  },
  {
    id: 13,
    titulo: 'Comunicación y Lenguaje (3.º Primaria)',
    ciclo: 'Primer_Ciclo',
    gradoDir: '3ro_Primaria',
    materiaDir: 'Comunicacion_y_Lenguaje',
    nombreArchivo: 'comunicacion_y_lenguaje_3er_grado.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/comunicacion_y_lenguaje_3ro_compressed.pdf'
  },
  {
    id: 14,
    titulo: 'Mi libro de lecturas (3.º Primaria)',
    ciclo: 'Primer_Ciclo',
    gradoDir: '3ro_Primaria',
    materiaDir: 'Comunicacion_y_Lenguaje',
    nombreArchivo: 'mi_libro_de_lecturas_3ro.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/mi_libro_de_lecturas_3er_grado_compressed.pdf'
  },
  {
    id: 16,
    titulo: 'Medio Social y Natural (3.º Primaria)',
    ciclo: 'Primer_Ciclo',
    gradoDir: '3ro_Primaria',
    materiaDir: 'Medio_Social_y_Natural',
    nombreArchivo: 'medio_social_y_natural_3er_grado.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/medio_social_y_natural_3ro_compressed.pdf'
  },

  // ==========================================
  // SEGUNDO CICLO — 4.º PRIMARIA
  // ==========================================
  {
    id: 21,
    titulo: 'Matemáticas 4.º Primaria (4G)',
    ciclo: 'Segundo_Ciclo',
    gradoDir: '4to_Primaria',
    materiaDir: 'Matematicas',
    nombreArchivo: 'matematicas_4to_grado.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/matematicas_4G_compressed.pdf'
  },
  {
    id: 55,
    titulo: 'Material Manipulable Matemáticas (4.º Primaria)',
    ciclo: 'Segundo_Ciclo',
    gradoDir: '4to_Primaria',
    materiaDir: 'Matematicas',
    nombreArchivo: 'material_manipulable_matematicas_4to.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/Material_manipulable_G4.pdf'
  },
  {
    id: 19,
    titulo: 'Comunicación y Lenguaje (4.º Primaria)',
    ciclo: 'Segundo_Ciclo',
    gradoDir: '4to_Primaria',
    materiaDir: 'Comunicacion_y_Lenguaje',
    nombreArchivo: 'comunicacion_y_lenguaje_4to_grado.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/comunicacion_y_lenguaje_4do_compressed.pdf'
  },
  {
    id: 20,
    titulo: 'Mi libro de lecturas (4.º Primaria)',
    ciclo: 'Segundo_Ciclo',
    gradoDir: '4to_Primaria',
    materiaDir: 'Comunicacion_y_Lenguaje',
    nombreArchivo: 'mi_libro_de_lecturas_4to.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/mi_libro_de_lecturas_4to_grado_compressed.pdf'
  },
  {
    id: 17,
    titulo: 'Ciencias Naturales y Tecnología (4.º Primaria)',
    ciclo: 'Segundo_Ciclo',
    gradoDir: '4to_Primaria',
    materiaDir: 'Ciencias_Naturales_y_Tecnologia',
    nombreArchivo: 'ciencias_naturales_4to_grado.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/ciencias_naturales_y_tecnologia_4to_compressed.pdf'
  },
  {
    id: 18,
    titulo: 'Ciencias Sociales y Formación Ciudadana (4.º Primaria)',
    ciclo: 'Segundo_Ciclo',
    gradoDir: '4to_Primaria',
    materiaDir: 'Ciencias_Sociales_y_Ciudadana',
    nombreArchivo: 'ciencias_sociales_4to_grado.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/ciencias_sociales_4to_compressed.pdf'
  },

  // ==========================================
  // SEGUNDO CICLO — 5.º PRIMARIA
  // ==========================================
  {
    id: 26,
    titulo: 'Matemáticas 5.º Primaria (5G)',
    ciclo: 'Segundo_Ciclo',
    gradoDir: '5to_Primaria',
    materiaDir: 'Matematicas',
    nombreArchivo: 'matematicas_5to_grado.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/matematicas_5G_compressed.pdf'
  },
  {
    id: 56,
    titulo: 'Material Manipulable Matemáticas (5.º Primaria)',
    ciclo: 'Segundo_Ciclo',
    gradoDir: '5to_Primaria',
    materiaDir: 'Matematicas',
    nombreArchivo: 'material_manipulable_matematicas_5to.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/Material_manipulable_G5.pdf'
  },
  {
    id: 24,
    titulo: 'Comunicación y Lenguaje (5.º Primaria)',
    ciclo: 'Segundo_Ciclo',
    gradoDir: '5to_Primaria',
    materiaDir: 'Comunicacion_y_Lenguaje',
    nombreArchivo: 'comunicacion_y_lenguaje_5to_grado.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/comunicacion_y_lenguaje_5do_compressed.pdf'
  },
  {
    id: 25,
    titulo: 'Mi libro de lecturas (5.º Primaria)',
    ciclo: 'Segundo_Ciclo',
    gradoDir: '5to_Primaria',
    materiaDir: 'Comunicacion_y_Lenguaje',
    nombreArchivo: 'mi_libro_de_lecturas_5to.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/mi_libro_de_lecturas_5to_grado_compressed.pdf'
  },
  {
    id: 22,
    titulo: 'Ciencias Naturales y Tecnología (5.º Primaria)',
    ciclo: 'Segundo_Ciclo',
    gradoDir: '5to_Primaria',
    materiaDir: 'Ciencias_Naturales_y_Tecnologia',
    nombreArchivo: 'ciencias_naturales_5to_grado.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/ciencias_naturales_y_tecnologia_5to_compressed.pdf'
  },
  {
    id: 23,
    titulo: 'Ciencias Sociales y Formación Ciudadana (5.º Primaria)',
    ciclo: 'Segundo_Ciclo',
    gradoDir: '5to_Primaria',
    materiaDir: 'Ciencias_Sociales_y_Ciudadana',
    nombreArchivo: 'ciencias_sociales_5to_grado.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/ciencias_sociales_5to_compressed.pdf'
  },

  // ==========================================
  // SEGUNDO CICLO — 6.º PRIMARIA
  // ==========================================
  {
    id: 31,
    titulo: 'Matemáticas 6.º Primaria (6G)',
    ciclo: 'Segundo_Ciclo',
    gradoDir: '6to_Primaria',
    materiaDir: 'Matematicas',
    nombreArchivo: 'matematicas_6to_grado.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/matematicas_6G_compressed.pdf'
  },
  {
    id: 57,
    titulo: 'Material Manipulable Matemáticas (6.º Primaria)',
    ciclo: 'Segundo_Ciclo',
    gradoDir: '6to_Primaria',
    materiaDir: 'Matematicas',
    nombreArchivo: 'material_manipulable_matematicas_6to.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/Material_manipulable_G6.pdf'
  },
  {
    id: 29,
    titulo: 'Comunicación y Lenguaje (6.º Primaria)',
    ciclo: 'Segundo_Ciclo',
    gradoDir: '6to_Primaria',
    materiaDir: 'Comunicacion_y_Lenguaje',
    nombreArchivo: 'comunicacion_y_lenguaje_6to_grado.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/comunicacion_y_lenguaje_6do_compressed.pdf'
  },
  {
    id: 30,
    titulo: 'Mi libro de lecturas (6.º Primaria)',
    ciclo: 'Segundo_Ciclo',
    gradoDir: '6to_Primaria',
    materiaDir: 'Comunicacion_y_Lenguaje',
    nombreArchivo: 'mi_libro_de_lecturas_6to.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/mi_libro_de_lecturas_6to_grado_compressed.pdf'
  },
  {
    id: 27,
    titulo: 'Ciencias Naturales y Tecnología (6.º Primaria)',
    ciclo: 'Segundo_Ciclo',
    gradoDir: '6to_Primaria',
    materiaDir: 'Ciencias_Naturales_y_Tecnologia',
    nombreArchivo: 'ciencias_naturales_6to_grado.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/ciencias_naturales_y_tecnologia_6to_compressed.pdf'
  },
  {
    id: 28,
    titulo: 'Ciencias Sociales y Formación Ciudadana (6.º Primaria)',
    ciclo: 'Segundo_Ciclo',
    gradoDir: '6to_Primaria',
    materiaDir: 'Ciencias_Sociales_y_Ciudadana',
    nombreArchivo: 'ciencias_sociales_6to_grado.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/ciencias_sociales_6to_compressed.pdf'
  },

  // ==========================================
  // GUÍAS DOCENTES Y TRANSVERSALES
  // ==========================================
  {
    id: 8,
    titulo: 'Guía Metodológica para la Enseñanza de Matemáticas (Segundo Ciclo)',
    ciclo: 'Guias_Docentes_y_Transversales',
    gradoDir: 'Segundo_Ciclo',
    materiaDir: 'Matematicas',
    nombreArchivo: 'guia_metodologica_matematicas_segundo_ciclo.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/guia_metodologica_matematicas_compressed.pdf'
  },
  {
    id: 122,
    titulo: 'Guía Didáctica: Sugerencias para Celebrar Fiestas Patrias',
    ciclo: 'Guias_Docentes_y_Transversales',
    gradoDir: 'Transversal',
    materiaDir: 'Formacion_Ciudadana',
    nombreArchivo: 'guia_fiestas_patrias_ciudadana.pdf',
    url: 'https://www.mineduc.edu.gt/tmp-libros/GUÍA DIDÁCTICA SUGERENCIAS PARA CELEBRAR LAS FIESTAS PATRIAS.pdf'
  }
];

// Función para descargar un archivo con reintentos y reporte de progreso
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    // Si ya existe y pesa más de 50 KB, asumimos completado
    if (fs.existsSync(destPath)) {
      const stats = fs.statSync(destPath);
      if (stats.size > 50000) {
        return resolve({ status: 'already_exists', size: stats.size });
      }
    }

    const tempPath = `${destPath}.tmp`;
    const protocol = url.startsWith('https') ? https : http;

    const request = protocol.get(encodeURI(url), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      // Manejar redirecciones 301 / 302
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          return downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
        }
      }

      if (response.statusCode !== 200) {
        return reject(new Error(`HTTP Status ${response.statusCode} al descargar ${url}`));
      }

      const totalBytes = parseInt(response.headers['content-length'] || '0', 10);
      let downloadedBytes = 0;
      let lastReport = Date.now();

      const fileStream = fs.createWriteStream(tempPath);

      response.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        const now = Date.now();
        if (now - lastReport > 2500) {
          const mb = (downloadedBytes / (1024 * 1024)).toFixed(1);
          const totalMb = totalBytes ? (totalBytes / (1024 * 1024)).toFixed(1) : '?';
          const pct = totalBytes ? Math.round((downloadedBytes / totalBytes) * 100) : '?';
          process.stdout.write(`    ⏳ Progreso: ${mb} MB / ${totalMb} MB (${pct}%)\r`);
          lastReport = now;
        }
      });

      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close(() => {
          fs.renameSync(tempPath, destPath);
          const finalSize = fs.statSync(destPath).size;
          resolve({ status: 'downloaded', size: finalSize });
        });
      });

      fileStream.on('error', (err) => {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        reject(err);
      });
    });

    request.on('error', (err) => {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      reject(err);
    });

    // Timeout generoso de 5 minutos por archivo
    request.setTimeout(300000, () => {
      request.destroy();
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      reject(new Error(`Timeout de conexión para ${url}`));
    });
  });
}

async function main() {
  console.log('========================================================================');
  console.log('📚 DESCARGA Y ORGANIZACIÓN DE LIBROS OFICIALES MINEDUC (GUATEMALA)');
  console.log('========================================================================\n');
  console.log(`Directorio destino base: ${BASE_DIR}`);
  console.log(`Total de libros en catálogo: ${LIBROS_CONFIG.length}\n`);

  const manifest = [];
  let descargadosNuevos = 0;
  let yaExistentes = 0;
  let fallidos = 0;

  for (let i = 0; i < LIBROS_CONFIG.length; i++) {
    const item = LIBROS_CONFIG[i];
    const itemDir = path.join(BASE_DIR, item.ciclo, item.gradoDir, item.materiaDir);
    fs.mkdirSync(itemDir, { recursive: true });

    const filePath = path.join(itemDir, item.nombreArchivo);
    const relPath = path.relative(process.cwd(), filePath);

    console.log(`[${i + 1}/${LIBROS_CONFIG.length}] ${item.titulo}`);
    console.log(`    📁 Carpeta: ${item.ciclo}/${item.gradoDir}/${item.materiaDir}/`);
    console.log(`    📄 Archivo: ${item.nombreArchivo}`);

    try {
      const res = await downloadFile(item.url, filePath);
      const sizeMB = (res.size / (1024 * 1024)).toFixed(2);

      if (res.status === 'already_exists') {
        console.log(`    ✨ Ya existe localmente (${sizeMB} MB). Saltando descarga.`);
        yaExistentes++;
      } else {
        console.log(`    ✅ Descarga completada con éxito (${sizeMB} MB).`);
        descargadosNuevos++;
      }

      manifest.push({
        ...item,
        rutaLocal: relPath,
        tamanioBytes: res.size,
        tamanioMB: sizeMB,
        estado: 'disponible'
      });
    } catch (err) {
      console.error(`    ❌ Error descargando: ${err.message}`);
      fallidos++;
      manifest.push({
        ...item,
        rutaLocal: relPath,
        estado: 'error',
        error: err.message
      });
    }

    console.log('------------------------------------------------------------------------');
  }

  // Guardar el manifiesto con la ruta de cada archivo
  const manifestPath = path.join(BASE_DIR, 'manifest_libros.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log('\n========================================================================');
  console.log('🎉 RESUMEN FINAL DEL PROCESO DE DESCARGA:');
  console.log(`   • Nuevos descargados: ${descargadosNuevos}`);
  console.log(`   • Ya existentes:      ${yaExistentes}`);
  console.log(`   • Fallidos:           ${fallidos}`);
  console.log(`   • Manifiesto índice:  ${manifestPath}`);
  console.log('========================================================================\n');
}

main().catch(console.error);
