/**
 * One-off script: extracts text from the source PDF so its data can be
 * folded into the portal's datasets. Run: node scripts/extract-pdf.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';

const src = 'india-land-acquisition-delays (1).pdf';
const out = 'pdf-extract.txt';

const buf = await readFile(src);
const parser = new PDFParse({ data: new Uint8Array(buf) });

try {
  const result = await parser.getText();
  await writeFile(out, result.text, 'utf8');
  console.log(`Pages: ${result.total ?? result.pages?.length ?? '?'}`);
  console.log(`Characters: ${result.text.length}`);
  console.log('--- first 1200 chars ---');
  console.log(result.text.slice(0, 1200));
} finally {
  await parser.destroy();
}
