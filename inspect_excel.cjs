const XLSX = require('xlsx');
const fs = require('fs');

const filePath = './src/Dosagem de concreto convencional (3).xlsx';

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

const workbook = XLSX.readFile(filePath);

console.log('--- SHEETS IN WORKBOOK ---');
console.log(workbook.SheetNames);
console.log('--------------------------\n');

workbook.SheetNames.forEach(sheetName => {
  console.log(`================ SHEET: ${sheetName} ================`);
  const sheet = workbook.Sheets[sheetName];
  
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:A1');
  
  for (let r = range.s.r; r <= range.e.r; r++) {
    let rowText = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cellRef = XLSX.utils.encode_cell({ r, c });
      const cell = sheet[cellRef];
      if (cell) {
        const val = cell.v !== undefined ? cell.v : '';
        const formula = cell.f ? ` [Formula: =${cell.f}]` : '';
        rowText.push(`${cellRef}:${val}${formula}`);
      }
    }
    if (rowText.length > 0) {
      console.log(rowText.join(' | '));
    }
  }
  console.log('\n');
});
