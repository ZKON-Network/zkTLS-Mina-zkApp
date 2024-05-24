import * as fs from 'fs';

const configFile = 'node_modules/mina-fungible-token/tsconfig.json';
const content = JSON.parse(fs.readFileSync(configFile));
delete content.compilerOptions.typeRoots;
fs.writeFileSync(configFile, JSON.stringify(content, null, 4));