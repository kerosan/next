const fs = require('fs');
const p = 'src/graphql/resolvers/query/index.ts';
let s = fs.readFileSync(p,'utf8');
const regex = /return\s*\{\s*list\s*,\s*total\s*\}\s*;/g;
if (!regex.test(s)) {
  console.log('pattern not found');
  process.exit(1);
}
s = s.replace(regex, 'return { list: list as any, total } as any;');
fs.writeFileSync(p,s);
console.log('replaced');
