/**
 * compute-sha256s.js
 *
 * Deterministically fetch each libs.json entry and compute SHA256 sums for the artifact.
 * Produces libs-with-sha256.json for your review.
 *
 * Usage:
 *  node compute-sha256s.js
 *
 * Notes:
 * - npm entries use `npm pack` (requires npm available).
 * - url/github-release entries are downloaded via HTTPS.
 * - This script does NOT overwrite libs.json. It writes libs-with-sha256.json for review.
 * - Run locally or in a CI job and inspect the resulting file before committing.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');
const os = require('os');

const ROOT = path.join(__dirname);
const MANIFEST = path.join(ROOT, 'libs.json');
if (!fs.existsSync(MANIFEST)) {
  console.error('Missing libs.json. Copy libs.json.example or create libs.json with desired artifacts.');
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));

function sha256Buffer(buf) {
  const h = crypto.createHash('sha256');
  h.update(buf);
  return h.digest('hex');
}

function downloadToBuffer(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, res => {
      if (res.statusCode >= 400) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

function extractFromNpm(packageSpec, pkgPath) {
  // npm pack will write a tarball in the current working directory
  const cwd = ROOT;
  const packName = execSync(`npm pack ${packageSpec}`, { cwd, encoding: 'utf8' }).trim();
  const tarball = path.join(cwd, packName);
  try {
    // Extract requested file using tar -xOf (POSIX). On Windows CI, tar is typically available.
    const tmpOut = path.join(os.tmpdir(), `khonxr-${Date.now()}-${Math.random().toString(36).slice(2)}.bin`);
    execSync(`tar -xOf ${tarball} ${pkgPath} > ${tmpOut}`);
    const buf = fs.readFileSync(tmpOut);
    fs.unlinkSync(tmpOut);
    return buf;
  } finally {
    try { fs.unlinkSync(tarball); } catch (e) {}
  }
}

(async () => {
  const out = [];
  for (const entry of manifest) {
    console.log('Processing', entry.name, entry.type);
    try {
      let buf;
      if (entry.type === 'npm') {
        buf = extractFromNpm(entry.source, entry.pkgPath);
      } else if (entry.type === 'url' || entry.type === 'github-release') {
        buf = await downloadToBuffer(entry.url);
      } else {
        throw new Error('unknown entry type ' + entry.type);
      }
      const sha = sha256Buffer(buf);
      console.log(`  -> SHA256: ${sha}`);
      const copy = Object.assign({}, entry, { sha256: sha });
      out.push(copy);
    } catch (err) {
      console.error('  error fetching', entry.name, err.message || err);
      const copy = Object.assign({}, entry, { sha256: '' });
      out.push(copy);
    }
  }
  const outPath = path.join(ROOT, 'libs-with-sha256.json');
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log('Wrote', outPath, ' — inspect and move entries into libs.json to pin versions.');
})();