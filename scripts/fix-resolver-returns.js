const fs = require('fs');
const p = 'src/graphql/resolvers/query/index.ts';
let s = fs.readFileSync(p,'utf8');
const before = 'return { list, total };\n  },';
const after = 'return { list: list as any, total } as any;\n  },';
if (s.indexOf(before) === -1) {
  console.log('pattern not found');
  process.exit(1);
}
while (s.indexOf(before) !== -1) s = s.replace(before, after);
fs.writeFileSync(p,s);
console.log('done');
