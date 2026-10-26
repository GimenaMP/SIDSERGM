const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '../data/catalogo_indices_extraidos.json');
if (fs.existsSync(p)) {
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  console.log('Keys:', Object.keys(data));
  if (data['6']) {
    console.log('Grade 6 keys:', Object.keys(data['6']));
    if (data['6'].csyc) {
      console.log('Grade 6 csyc unit 1:', JSON.stringify(data['6'].csyc[0], null, 2));
    }
  }
} else {
  console.log('Not found:', p);
}
