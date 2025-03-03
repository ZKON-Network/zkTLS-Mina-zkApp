import * as fs from 'fs';

const configFile = 'node_modules/mina-fungible-token/tsconfig.json';
var configRaw = fs.readFileSync(configFile, 'utf8')
configRaw = configRaw.replace(/\/\/.*$/gm, '');
configRaw = configRaw.replace(/\/\*[\s\S]*?\*\//g, '');
const content = JSON.parse(configRaw);
delete content.compilerOptions.typeRoots;
fs.writeFileSync(configFile, JSON.stringify(content, null, 4));