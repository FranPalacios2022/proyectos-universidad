const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const env = path.join(root, 'backend', '.env');
if (!fs.existsSync(env)) {
  fs.writeFileSync(env, `PORT=3001\nFRONTEND_URL=http://localhost:3000\nJWT_SECRET=${crypto.randomBytes(48).toString('hex')}\nJWT_EXPIRES_IN=2h\nDB_PATH=./data/mantenimiento.sqlite\n`);
  console.log('Configuración local creada con un secreto aleatorio. No subir backend/.env al repositorio.');
} else {
  console.log('backend/.env ya existe. Se conserva su configuración.');
}
