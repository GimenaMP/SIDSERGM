import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve('data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function scrapeMineducCatalog() {
  console.log('🚀 Iniciando scraping del catálogo oficial de Primaria en MINEDUC...');
  const allBooks = [];

  for (let page = 1; page <= 6; page++) {
    const url = `https://www.mineduc.edu.gt/primaria?page=${page}`;
    console.log(`  📄 Descargando página ${page}/6 (${url})...`);
    
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
      const html = await res.text();
      const match = html.match(/data-page="([^"]+)"/);
      
      if (match) {
        const decoded = match[1].replace(/&quot;/g, '"');
        const data = JSON.parse(decoded);
        if (data.props?.libros?.data) {
          const libros = data.props.libros.data.map(item => ({
            id: item.id,
            materia: item.materia?.trim(),
            grado: item.grado?.trim(),
            ciclo: item.grado === 'Segundo Ciclo' ? 'segundo_ciclo' :
                   ['Primer Grado', 'Segundo Grado', 'Tercer Grado'].includes(item.grado) ? 'primer_ciclo' : 'segundo_ciclo',
            grado_numero: item.grado === 'Primer Grado' ? 1 :
                          item.grado === 'Segundo Grado' ? 2 :
                          item.grado === 'Tercer Grado' ? 3 :
                          item.grado === 'Cuarto Grado' ? 4 :
                          item.grado === 'Quinto Grado' ? 5 :
                          item.grado === 'Sexto Grado' ? 6 : null,
            enlace_relativo: item.enlace,
            url_descarga: item.enlace ? `https://www.mineduc.edu.gt${item.enlace}` : null
          }));
          allBooks.push(...libros);
          console.log(`    ✅ Obtenidos ${libros.length} libros de página ${page}.`);
        }
      }
    } catch (err) {
      console.error(`    ❌ Error en página ${page}:`, err.message);
    }
  }

  const outputPath = path.join(DATA_DIR, 'mineduc_catalog.json');
  fs.writeFileSync(outputPath, JSON.stringify(allBooks, null, 2), 'utf8');
  console.log(`🎉 Catálogo completado: ${allBooks.length} libros y guías guardados en ${outputPath}\n`);
  return allBooks;
}

scrapeMineducCatalog().catch(console.error);
