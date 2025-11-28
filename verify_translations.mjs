
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Mock the locales.ts file content reading since we can't import TS directly easily without build step
// We will read the file as text and parse it roughly
const localesPath = path.join(process.cwd(), 'locales.ts');
const localesContent = fs.readFileSync(localesPath, 'utf-8');

// Extract dictionaries using regex
const extractDict = (lang) => {
    const regex = new RegExp(`const ${lang}: Record<string, string> = {([\\s\\S]*?)};`, 'm');
    const match = localesContent.match(regex);
    if (!match) return {};

    const dictContent = match[1];
    const dict = {};

    // Simple parsing of key: 'value'
    const lines = dictContent.split('\n');
    lines.forEach(line => {
        const keyMatch = line.match(/^\s*([a-zA-Z0-9_]+):/);
        if (keyMatch) {
            dict[keyMatch[1]] = true;
        }
    });
    return dict;
};

const languages = ['fr', 'en', 'de', 'es', 'it'];
const dicts = {};
languages.forEach(lang => {
    dicts[lang] = extractDict(lang);
});

console.log('--- Translation Key Consistency Check ---');
const frKeys = Object.keys(dicts['fr']);
console.log(`Total keys in FR: ${frKeys.length}`);

let hasErrors = false;

languages.forEach(lang => {
    if (lang === 'fr') return;
    const langKeys = Object.keys(dicts[lang]);
    const missing = frKeys.filter(k => !dicts[lang][k]);

    if (missing.length > 0) {
        console.log(`\n[WARNING] Missing keys in ${lang.toUpperCase()} (${missing.length}):`);
        missing.forEach(k => console.log(`  - ${k}`));
        hasErrors = true;
    } else {
        console.log(`\n[OK] ${lang.toUpperCase()} has all keys present in FR.`);
    }
});

// Scan codebase for usage
console.log('\n--- Codebase Usage Check ---');
const componentsDir = path.join(process.cwd(), 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

const usedKeys = new Set();
files.forEach(file => {
    const content = fs.readFileSync(path.join(componentsDir, file), 'utf-8');
    const matches = content.matchAll(/t\(['"]([a-zA-Z0-9_]+)['"]\)/g);
    for (const match of matches) {
        usedKeys.add(match[1]);
    }
});

console.log(`Found ${usedKeys.size} unique keys used in components.`);
const missingInFr = [...usedKeys].filter(k => !dicts['fr'][k]);

if (missingInFr.length > 0) {
    console.log(`\n[ERROR] Keys used in code but missing in FR dictionary:`);
    missingInFr.forEach(k => console.log(`  - ${k}`));
    hasErrors = true;
} else {
    console.log(`\n[OK] All keys used in code exist in FR dictionary.`);
}

if (hasErrors) {
    console.log('\n❌ Verification failed with warnings/errors.');
    process.exit(1);
} else {
    console.log('\n✅ Verification passed successfully.');
}
