import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Navigate up from scripts/ to root
const packageJsonPath = path.join(__dirname, '..', 'package.json');
console.log('🔧 Patching package.json for Electron deployment...');
try {
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`package.json not found at ${packageJsonPath}`);
  }
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  // 1. Fix main entry point (Critical for Electron to start)
  const oldMain = packageJson.main;
  packageJson.main = 'main.js';
  console.log(`   • Updated "main": "${oldMain}" -> "main.js"`);
  // 2. Fix homepage (Critical for asset loading with file:// protocol)
  const oldHomepage = packageJson.homepage;
  packageJson.homepage = './';
  console.log(`   • Updated "homepage": "${oldHomepage || '(none)'}" -> "./"`);
  // 3. Add Professional Metadata
  packageJson.author = "TacticalBind User";
  packageJson.description = "Advanced AntiMicroX Profile Architect";
  console.log('   • Added Author and Description metadata');
  // 4. Inject electron-builder configuration
  packageJson.build = {
    appId: "com.tacticalbind.app",
    productName: "TacticalBind",
    directories: {
      output: "dist-electron"
    },
    files: [
      "dist/**/*",
      "main.js",
      "package.json"
    ],
    asar: true, // Enable ASAR for security and performance
    win: {
      target: "nsis",
      icon: "public/icon.ico",
      artifactName: "${productName}-Setup-${version}.${ext}",
      requestedExecutionLevel: "asInvoker"
    },
    mac: {
      target: "dmg",
      artifactName: "${productName}-${version}.${ext}",
      category: "public.app-category.utilities"
    },
    linux: {
      target: "AppImage",
      artifactName: "${productName}-${version}.${ext}",
      category: "Utility"
    },
    ...packageJson.build // Preserve existing if any
  };
  console.log('   • Injected robust "build" configuration for electron-builder');
  // 5. Add build scripts if missing
  if (!packageJson.scripts) packageJson.scripts = {};
  // CRITICAL: --base=./ is required for Electron to find assets in the dist folder
  packageJson.scripts['electron:build'] = "vite build --base=./ && electron-builder";
  packageJson.scripts['electron:dev'] = "concurrently \"vite\" \"wait-on tcp:3000 && electron . --dev\"";
  console.log('   • Added electron scripts with correct base path');
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('\n✅ SUCCESS: package.json is now perfectly configured for Electron packaging.');
  console.log('   Run "bun run electron:build" to create the installer.');
} catch (err) {
  console.error('\n❌ FATAL: Failed to patch package.json');
  console.error(err);
  process.exit(1);
}