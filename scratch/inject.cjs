const fs = require('fs');
const astroPath = 'src/pages/index.astro';
const meshPath = 'mesh.json';

const astro = fs.readFileSync(astroPath, 'utf8');
const mesh = fs.readFileSync(meshPath, 'utf8');
const meshData = JSON.parse(mesh);

const pvStr = '  const PV = ' + JSON.stringify(meshData.PV) + ';';
const peStr = '  const PE = ' + JSON.stringify(meshData.PE) + ';';

const newAstro = astro
  .replace(/  const PV = \[\[0,-1,0\].*?\]\];/g, pvStr)
  .replace(/  const PE = \[\[0,1\].*?\]\];/g, peStr);

fs.writeFileSync(astroPath, newAstro, 'utf8');
console.log('Injected mesh into index.astro');
