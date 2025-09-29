import fs from 'fs';
import path from 'path';

console.log(' Running pre-commit custom checks...');

// 1. Check for TODO/FIXME comments
function checkTODOs() {
  const files = getJsFiles('./src');
  let todoCount = 0;

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(/TODO|FIXME/g);
    if (matches) {
      todoCount += matches.length;
      console.warn(`⚠️ TODO/FIXME found in ${file}`);
    }
  });

  if (todoCount > 0) {
    console.error(`❌ Found ${todoCount} TODO/FIXME comments! Please fix before committing.`);
    process.exit(1);
  }
}

// 2. Check for console.log (skip logger)
function checkConsoleLogs() {
  const files = getJsFiles('./src');
  let logCount = 0;

  files.forEach(file => {
    if (file.includes('logger.js')) return;

    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(/console\.log/g);
    if (matches) {
      logCount += matches.length;
      console.warn(`⚠️ console.log found in ${file}`);
    }
  });

  if (logCount > 0) {
    console.error(`❌ Found ${logCount} console.log statements! Use logger instead.`);
    process.exit(1);
  }
}

// 3. Check file naming
function checkFileNaming() {
  const files = getJsFiles('./src');
  const invalidFiles = [];

  files.forEach(file => {
    const ext = path.extname(file);
    if (!['.js', '.jsx'].includes(ext)) return;

    const fileName = path.basename(file, ext);
    if (!/^[a-z][a-zA-Z0-9]*$|^[a-z][a-z0-9]*(_[a-z0-9]+)*$|^[A-Z][a-zA-Z0-9]*$/.test(fileName)) {
      invalidFiles.push(file);
    }
  });

  if (invalidFiles.length > 0) {
    console.error(`❌ Invalid file naming detected:`);
    invalidFiles.forEach(f => console.error(`   ${f}`));
    process.exit(1);
  }
}

// 4. Check hardcoded strings (UI + core logic)
function checkHardcodedStrings() {
  const files = getJsFiles('./src').filter(file => {
    const ignoreFolders = ['assets', 'styles', 'theme'];
    const ignoreFiles = ['App.jsx', 'App.css', 'index.css', 'main.jsx'];
    return (
      !ignoreFolders.some(f => file.includes(`${path.sep}${f}${path.sep}`)) &&
      !ignoreFiles.some(f => file.endsWith(f))
    );
  });

  let total = 0;

  files.forEach(file => {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    lines.forEach(line => {
      if (/\bimport\b|\bexport\b/.test(line)) return;
      const matches = line.match(/(['"`])(.*?)\1/g);
      if (!matches) return;
      matches.forEach(str => {
        const s = str.slice(1, -1).trim();
        if (s.length < 5) return;
        total++;
        console.warn(`⚠️ Potential hardcoded string in ${file}: ${s}`);
      });
    });
  });

  if (total > 0) {
    console.error(`❌ Found ${total} potential hardcoded strings. Use constants instead.`);
    process.exit(1);
  }
}

// 5. Check React architecture compliance
function checkArchitecture() {
  const srcDir = './src';
  const requiredDirs = ['ui', 'core'];
  const missingDirs = requiredDirs.filter(d => !fs.existsSync(path.join(srcDir, d)));
  if (missingDirs.length > 0) {
    console.error(`❌ Missing required directories: ${missingDirs.join(', ')}`);
    process.exit(1);
  }
}

// Helper: recursively get JS/JSX files
function getJsFiles(dir, files_ = []) {
  if (!fs.existsSync(dir)) return files_;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getJsFiles(fullPath, files_);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      files_.push(fullPath);
    }
  }
  return files_;
}

// Run checks
try {
  checkTODOs();
  checkConsoleLogs();
  checkFileNaming();
  checkHardcodedStrings();
  checkArchitecture();
  console.log('✅ Pre-commit checks passed!');
} catch (err) {
  console.error(err);
  process.exit(1);
}
