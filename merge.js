'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;

const originalPath = path.join(root, 'cascade-original.xml');
const generatedPath = path.join(root, 'fontawesome-dropdown.xml');
const outputPath = path.join(root, 'fontawesome-merged.xml');

// Extract icon names from Cascade dropdown XML.
function getIcons(filePath) {
    const xml = fs.readFileSync(filePath, 'utf8');

    return [
        ...xml.matchAll(
            /<dropdown-item\b[^>]*\bvalue="([^"]+)"/g
        )
    ].map(match => match[1]);
}

// Read both dropdowns.
const originalIcons = getIcons(originalPath);
const generatedIcons = getIcons(generatedPath);

if (!originalIcons.length || !generatedIcons.length) {
    throw new Error('One or both dropdown files contain no icons.');
}

// Merge, remove duplicates, and sort alphabetically.
const mergedIcons = [
    ...new Set([...originalIcons, ...generatedIcons])
].sort((a, b) => a.localeCompare(b, 'en'));

// Verify that every original icon is preserved.
const mergedSet = new Set(mergedIcons);

const missingOriginals = originalIcons.filter(
    name => !mergedSet.has(name)
);

if (missingOriginals.length > 0) {
    throw new Error(
        `Missing ${missingOriginals.length} original icons!`
    );
}

// Escape values for XML attributes.
function escapeXml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Generate complete Cascade Data Definition XML.
const xml = [
    '<system-data-structure>',
    '    <text identifier="fontawesome-icon-pre" label="Font Awesome Icons" type="dropdown">',
    ...mergedIcons.map(
        name => `        <dropdown-item value="${escapeXml(name)}"/>`
    ),
    '    </text>',
    '</system-data-structure>'
].join('\n');

// Write merged dropdown.
fs.writeFileSync(outputPath, xml + '\n', 'utf8');

// Report results.
const originalSet = new Set(originalIcons);
const addedIcons = generatedIcons.filter(
    name => !originalSet.has(name)
);

console.log('\nFONT AWESOME DROPDOWN MERGE');
console.log('--------------------------------');
console.log(`Original icons: ${originalIcons.length}`);
console.log(`Generated icons: ${generatedIcons.length}`);
console.log(`New icons added: ${addedIcons.length}`);
console.log(`Total merged icons: ${mergedIcons.length}`);
console.log(`Original icons missing: ${missingOriginals.length}`);
console.log('--------------------------------');
console.log(`Output: ${path.basename(outputPath)}\n`);