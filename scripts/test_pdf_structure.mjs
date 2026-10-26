import fs from 'fs';
import { PDFParse } from 'pdf-parse';

async function test() {
  const filePath = 'data/libros_pdf/Segundo_Ciclo/6to_Primaria/Matematicas/material_manipulable_matematicas_6to.pdf';
  const buf = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: buf });
  await parser.load();
  const res = await parser.getText();
  console.log('Total pages:', res.total);
  console.log('Page 0 keys:', Object.keys(res.pages[0]));
  console.log('Page 0 num:', res.pages[0].num || res.pages[0].pageNumber);
  console.log('Page 0 text sample:', (res.pages[0].text || '').slice(0, 150));
}

test().catch(console.error);
