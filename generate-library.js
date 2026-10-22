'use strict';

const fs = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');

const root = __dirname;

const dropdownPath = path.join(root, 'fontawesome-merged.xml');

const metadataPath = path.join(
    root,
    'node_modules',
    '@fortawesome',
    'fontawesome-free',
    'metadata',
    'icons.yml'
);

const outputPath = path.join(
    root,
    'icon-library',
    'js',
    'icons.js'
);

// Read all selectable icon names from the merged dropdown.
const dropdownXml = fs.readFileSync(dropdownPath, 'utf8');

const iconNames = [
    ...dropdownXml.matchAll(
        /<dropdown-item\b[^>]*\bvalue="([^"]+)"/g
    )
].map(match => match[1]);

// Read Font Awesome metadata.
const metadata = YAML.parse(
    fs.readFileSync(metadataPath, 'utf8')
);

// Build a lookup for canonical names and legacy aliases.
const lookup = new Map();

for (const [name, icon] of Object.entries(metadata)) {
    lookup.set(name, icon);

    for (const alias of icon.aliases?.names || []) {
        if (!lookup.has(alias)) {
            lookup.set(alias, icon);
        }
    }
}

// Generate the library data.
const icons = iconNames.map(name => {
    const icon = lookup.get(name);

    return {
        name,
        label: icon?.label || name.replace(/-/g, ' '),
        keywords: icon?.search?.terms || []
    };
});

const output = [
    '// Generated automatically. Do not edit manually.',
    `const iconLibrary = ${JSON.stringify(icons, null, 2)};`
].join('\n');

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, output + '\n', 'utf8');

console.log(`Generated ${icons.length} icons for the reference library.`);