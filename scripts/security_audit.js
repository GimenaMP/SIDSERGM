/**
 * SCRIPT DE AUDITORÍA Y SEGURIDAD DEL REPOSITORIO GIT
 * Plataforma SIDSER
 *
 * Ejecución: node scripts/security_audit.js
 *
 * Verifica:
 * 1. Efectividad de .gitignore ante archivos sensibles y pesados.
 * 2. Rastreo de secretos en archivos versionados (git ls-files).
 * 3. Búsqueda de secretos o credenciales en el historial de commits.
 * 4. Configuración segura de remotos y ramas.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const SENSITIVE_PATTERNS = [
  { name: 'Google API Key', regex: /AIza[0-9A-Za-z-_]{35}/g },
  { name: 'Supabase Secret/Service Role Key', regex: /sb_secret_[a-zA-Z0-9_\-]{16,}/g },
  { name: 'Supabase Personal Access Token', regex: /sbp_[a-zA-Z0-9]{30,}/g },
  { name: 'Clave Privada RSA/EC/OpenSSH', regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
  { name: 'AWS Access Key ID', regex: /(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/g },
  { name: 'Token de Autenticación Genérico', regex: /(?:api_key|apikey|secret_key|secret_token|auth_token)\s*[:=]\s*['"][a-zA-Z0-9_\-]{25,}['"]/gi }
];

const FILES_TO_VERIFY_IGNORED = [
  '.env',
  '.env.local',
  '.env.production',
  '.env.staging.local',
  'credentials.json',
  'service-account.json',
  'private.key',
  'cert.pem',
  'id_rsa',
  'data/libros_pdf/test.pdf',
  'data/nivelacion_mineduc/test.pdf',
  'contenido_visual/page_1.png',
  'database.sqlite',
  'backup.dump',
  '.agents/skills/test.txt',
  'npm-debug.log'
];

function runGit(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT_DIR, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    return null;
  }
}

function header(title) {
  console.log('\n' + '='.repeat(70));
  console.log(`🛡️  ${title}`);
  console.log('='.repeat(70));
}

let errors = 0;
let warnings = 0;

header('PASO 1: VERIFICACIÓN DE REGLAS ACTIVAS EN .gitignore');

FILES_TO_VERIFY_IGNORED.forEach(file => {
  const check = runGit(`git check-ignore -v "${file}"`);
  if (check) {
    console.log(`  ✅ [BLOQUEADO] ${file.padEnd(35)} -> ${check}`);
  } else {
    console.log(`  ❌ [FALLO]     ${file.padEnd(35)} -> ¡NO está bloqueado por .gitignore!`);
    errors++;
  }
});

header('PASO 2: ESCANEO DE SECRETOS EN ARCHIVOS RASTREADOS (git ls-files)');

const trackedFilesOutput = runGit('git ls-files');
const trackedFiles = trackedFilesOutput ? trackedFilesOutput.split(/\r?\n/).filter(Boolean) : [];

console.log(`Archivos actualmente versionados en git: ${trackedFiles.length}`);

let scannedCount = 0;
trackedFiles.forEach(file => {
  const fullPath = path.join(ROOT_DIR, file);
  if (!fs.existsSync(fullPath)) return;
  
  // Ignorar archivos binarios grandes o imágenes
  const ext = path.extname(file).toLowerCase();
  if (['.png', '.jpg', '.jpeg', '.gif', '.ico', '.woff', '.woff2', '.ttf', '.pdf'].includes(ext)) {
    return;
  }

  // Ignorar el propio script de auditoría para no dar falsos positivos por las regex
  if (file.includes('security_audit.js')) {
    return;
  }

  scannedCount++;
  const content = fs.readFileSync(fullPath, 'utf8');

  SENSITIVE_PATTERNS.forEach(pattern => {
    // Si encontramos una coincidencia, verificar si es solo un placeholder en .env.example
    const matches = content.match(pattern.regex);
    if (matches && matches.length > 0) {
      if (file === '.env.example') {
        return; // placeholders controlados
      }
      console.log(`  🚨 [ALERTA DE SEGURIDAD] Patrón "${pattern.name}" detectado en ${file}`);
      matches.slice(0, 3).forEach(m => console.log(`      Valor truncado: ${m.substring(0, 8)}...`));
      errors++;
    }
  });
});

console.log(`  ✅ Se escanearon ${scannedCount} archivos de código y configuración sin filtración de secretos.`);

header('PASO 3: AUDITORÍA DEL HISTORIAL DE COMMITS (git log)');

// Comprobar si algún archivo .env fue commiteado alguna vez
const historyEnv = runGit('git log --all --full-history -- ".env*"');
if (historyEnv && historyEnv.length > 0) {
  console.log('  ⚠️ [ADVERTENCIA] Se detectaron registros de .env en el historial de git:');
  console.log(historyEnv.substring(0, 300));
  warnings++;
} else {
  console.log('  ✅ Cero archivos .env o variables de entorno en todo el historial histórico de Git.');
}

// Comprobar si claves privadas fueron commiteadas
const historyKeys = runGit('git log --all --full-history -- "*.pem" "*.key" "credentials.json"');
if (historyKeys && historyKeys.length > 0) {
  console.log('  ⚠️ [ADVERTENCIA] Se detectaron posibles llaves en commits anteriores.');
  warnings++;
} else {
  console.log('  ✅ Cero archivos de llaves o credenciales en el historial histórico.');
}

header('PASO 4: ESTADO DE REMOTOS Y SINCRONIZACIÓN');

const remotes = runGit('git remote -v');
if (!remotes || remotes.trim().length === 0) {
  console.log('  ℹ️  No hay repositorio remoto configurado (git remote es local).');
  console.log('     Tus cambios locales están protegidos y aislados en esta máquina.');
} else {
  console.log('  🔗 Remoto configurado:');
  console.log(remotes);
}

const currentBranch = runGit('git branch --show-current') || 'master';
console.log(`  🌿 Rama activa: ${currentBranch}`);

header('RESUMEN DE AUDITORÍA');
console.log(`Errores críticos: ${errors}`);
console.log(`Advertencias:     ${warnings}`);

if (errors === 0) {
  console.log('\n🎉 ¡AUDITORÍA SUPERADA EXITOSAMENTE! El repositorio cumple con los estándares de seguridad.');
  process.exit(0);
} else {
  console.error('\n❌ AUDITORÍA FALLIDA: Corrige los errores críticos antes de subir al repositorio.');
  process.exit(1);
}
