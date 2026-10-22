'use strict';

const fs = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');

const root = __dirname;

const originalPath = path.join(root, 'cascade-original.xml');
const metadataPath = path.join(
    root,
    'node_modules',
    '@fortawesome',
    'fontawesome-free',
    'metadata',
    'icons.yml'
);

const cssPath = path.join(
    root,
    'node_modules',
    '@fortawesome',
    'fontawesome-free',
    'css',
    'all.css'
);

// 1. Read original Cascade dropdown.
const originalXml = fs.readFileSync(originalPath, 'utf8');

const originalNames = [
    ...originalXml.matchAll(/<dropdown-item\b[^>]*\bvalue="([^"]+)"/g)
].map(match => match[1]);

if (originalNames.length === 0) {
    throw new Error('No dropdown items found in cascade-original.xml');
}

// 2. Read Font Awesome metadata.
const icons = YAML.parse(fs.readFileSync(metadataPath, 'utf8'));

const currentNames = Object.entries(icons)
    .filter(([, icon]) => icon.styles?.includes('solid'))
    .map(([name]) => name);

const originalSet = new Set(originalNames);
const currentSet = new Set(currentNames);

// 3. Check whether legacy classes exist in the actual CSS.
const css = fs.readFileSync(cssPath, 'utf8');

function hasCssClass(name) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(
        `\\.fa-${escaped}(?![\\w-])\\s*[:{,]`
    );
    return pattern.test(css);
}

// 4. Compare collections.
const unchanged = originalNames
    .filter(name => currentSet.has(name));

const newIcons = currentNames
    .filter(name => !originalSet.has(name));

const legacy = originalNames
    .filter(name => !currentSet.has(name));

const legacyWorking = legacy
    .filter(hasCssClass);

const needsReview = legacy
    .filter(name => !hasCssClass(name));

// 5. Save reports.
function saveList(filename, values) {
    fs.writeFileSync(
        path.join(root, filename),
        values.sort().join('\n') + '\n',
        'utf8'
    );
}

saveList('report-unchanged.txt', unchanged);
saveList('report-new.txt', newIcons);
saveList('report-legacy-working.txt', legacyWorking);
saveList('report-needs-review.txt', needsReview);

// 6. Display summary.
console.log('\nFONT AWESOME COMPARISON');
console.log('------------------------------');
console.log(`Original Cascade icons: ${originalNames.length}`);
console.log(`Font Awesome 6.4.2 solid icons: ${currentNames.length}`);
console.log(`Unchanged names: ${unchanged.length}`);
console.log(`New canonical icons: ${newIcons.length}`);
console.log(`Legacy names found in CSS: ${legacyWorking.length}`);
console.log(`Legacy names needing review: ${needsReview.length}`);
console.log('------------------------------');
console.log('Reports generated successfully.\n');