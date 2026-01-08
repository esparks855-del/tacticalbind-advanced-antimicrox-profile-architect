/**
 * TacticalBind Identity Repair Script
 * Run this to restore the project name and build settings if they are reset.
 * Usage: node scripts/fix-identity.js
 */
const fs = require('fs');
const path = require('path');
const PACKAGE_JSON_PATH = path.join(__dirname, '..', 'package.json');
try {
    console.log('🔧 Running Identity Repair...');
    if (!fs.existsSync(PACKAGE_JSON_PATH)) {
        console.error('❌ package.json not found!');
        process.exit(1);
    }
    const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
    // 1. Fix Identity
    pkg.name = "tactical-bind-architect";
    pkg.description = "Advanced AntiMicroX Profile Architect";
    pkg.author = "TacticalBind User";
    pkg.main = "main.js";
    // 2. Fix Scripts
    if (!pkg.scripts) pkg.scripts = {};
    // Ensure Vite builds with relative base for Electron compatibility
    pkg.scripts.build = "vite build --base=./";
    // Ensure Electron builder uses our config
    pkg.scripts["electron:build"] = "vite build --base=./ && electron-builder --config electron-builder.json";
    // Ensure dev mode runs correctly
    pkg.scripts["electron:dev"] = "concurrently \"vite\" \"wait-on tcp:3000 && electron . --dev\"";
    // 3. Write back
    fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(pkg, null, 2));
    console.log('✅ Identity repaired successfully.');
    console.log('   Name: tactical-bind-architect');
    console.log('   Main: main.js');
    console.log('   Build: Configured for Electron');
} catch (error) {
    console.error('❌ Repair failed:', error.message);
    process.exit(1);
}