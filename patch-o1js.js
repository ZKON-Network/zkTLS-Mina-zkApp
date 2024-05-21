import fs from 'fs';

const file = './node_modules/o1js/package.json';
const packageJson = JSON.parse(fs.readFileSync(file));
packageJson.main = "./dist/node/index.js";

fs.writeFileSync(file, JSON.stringify(packageJson, null, 4));