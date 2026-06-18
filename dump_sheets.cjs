const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = './src/Dosagem de concreto convencional (3).xlsx';
const outputDir = './excel_dumps';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

const workbook = XLSX.readFile(filePath);

workbook.SheetNames.forEach(sheetName => {
  const sheet = workbook.Sheets[sheetName];
  const safeName = sheetName.replace(/[^a-zA-Z0-9]/g, '_');
  const outFile = path.join(outputDir, `${safeName}.md`);
  
  let mdContent = `# Sheet: ${sheetName}\n\n`;
  
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:A1');
  
  // Render as a grid
  mdContent += '| Cell | Value | Formula |\n';
  mdContent += '|---|---|---|\n';
  
  let hasContent = false;
  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cellRef = XLSX.utils.encode_cell({ r, c });
      const cell = sheet[cellRef];
      if (cell && (cell.v !== undefined || cell.f)) {
        const val = cell.v !== undefined ? cell.v : '';
        const formula = cell.f ? `\`=${cell.f}\`` : '';
        mdContent += `| **${cellRef}** | ${val} | ${formula} |\n`;
        hasContent = true;
      }
    }
  }
  
  if (hasContent) {
    fs.writeFileSync(outFile, mdContent);
    console.log(`Exported sheet "${sheetName}" to ${outFile}`);
  } else {
    console.log(`Sheet "${sheetName}" is empty.`);
  }
});
