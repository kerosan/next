const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const schemaPath = path.join(repoRoot, 'src', 'graphql', 'schema.graphql');
const appDir = path.join(repoRoot, 'src', 'app');

const schema = fs.readFileSync(schemaPath, 'utf8');

// Extract field names from types
const typeFieldRegex = /type\s+([A-Za-z0-9_]+)\s*{([\s\S]*?)^}/gm;
let match;
const fields = new Set();
while ((match = typeFieldRegex.exec(schema + '\n}')) !== null) {
  const body = match[2];
  const lines = body.split('\n');
  lines.forEach(l => {
    const m = l.trim().match(/^([A-Za-z0-9_]+)\s*:/);
    if (m) fields.add(m[1]);
  });
}

// Also add root Query/Mutation fields
const rootRegex = /type\s+Query\s*{([\s\S]*?)^}/m;
const rootMatch = schema.match(rootRegex);
if (rootMatch) {
  const lines = rootMatch[1].split('\n');
  lines.forEach(l => {
    const m = l.trim().match(/^([A-Za-z0-9_]+)\s*\(/) || l.trim().match(/^([A-Za-z0-9_]+)\s*:/);
    if (m) fields.add(m[1]);
  });
}
const mutRegex = /type\s+Mutation\s*{([\s\S]*?)^}/m;
const mutMatch = schema.match(mutRegex);
if (mutMatch) {
  const lines = mutMatch[1].split('\n');
  lines.forEach(l => {
    const m = l.trim().match(/^([A-Za-z0-9_]+)\s*\(/) || l.trim().match(/^([A-Za-z0-9_]+)\s*:/);
    if (m) fields.add(m[1]);
  });
}

function walk(dir) {
  const res = [];
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) res.push(...walk(p));
    else if (st.isFile() && /\.(ts|tsx|js|jsx)$/.test(f)) res.push(p);
  });
  return res;
}

const files = walk(appDir);
const gqlRegex = /gql`([\s\S]*?)`/g;
const tokenRegex = /\b[A-Za-z_][A-Za-z0-9_]*\b/g;
const graphqlKeywords = new Set(['query','mutation','subscription','fragment','on','true','false','null','__typename','as']);
const ignoreNames = new Set(['take','skip','text','id','ids','page','pageSize','where','orderBy','filter','variables','input','reference','month','months','monthsBack']);

const missing = new Map();

files.forEach(file => {
  const txt = fs.readFileSync(file,'utf8');
  let m;
  while ((m = gqlRegex.exec(txt)) !== null) {
    const q = m[1];
    const tokens = new Set(Array.from(q.matchAll(tokenRegex)).map(r=>r[0]));
    tokens.forEach(t => {
      if (graphqlKeywords.has(t)) return;
      if (ignoreNames.has(t)) return;
      if (/^[A-Z]/.test(t)) return; // likely type name
      if (/^\$/.test(t)) return;
      if (!fields.has(t) && !/^\d+$/.test(t)) {
        if (!missing.has(file)) missing.set(file, new Set());
        missing.get(file).add(t);
      }
    });
  }
});

if (missing.size === 0) {
  console.log('No suspicious missing fields found.');
  process.exit(0);
}

console.log('Suspicious fields (not found in schema types):');
for (const [file, set] of missing) {
  console.log('\n' + path.relative(repoRoot, file));
  console.log(Array.from(set).sort().join(', '));
}
process.exit(0);
