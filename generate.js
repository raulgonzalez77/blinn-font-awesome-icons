
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');

const metadataPath = path.join(
    __dirname,
    'node_modules',
    '@fortawesome',
    'fontawesome-free',
    'metadata',
    'icons.yml'
);

const yamlContent = fs.readFileSync(metadataPath, 'utf8');
const icons = YAML.parse(yamlContent);

const solidIcons = Object.entries(icons)
    .filter(([, metadata]) => metadata.styles?.includes('solid'))
    .map(([name]) => name)
    .sort();

const xml = [
    '<text identifier="fontawesome-icon-pre" label="Font Awesome Icons" type="dropdown">',
    ...solidIcons.map(name => `    <dropdown-item value="${name}"/>`),
    '</text>'
].join('\n');

fs.writeFileSync(
    path.join(__dirname, 'fontawesome-dropdown.xml'),
    xml,
    'utf8'
);

console.log(`Generated ${solidIcons.length} solid icons.`);