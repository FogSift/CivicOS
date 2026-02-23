#!/usr/bin/env node
/**
 * @fileId a3f1d2e4-8b5c-4f6a-9d0e-1c2b3a4f5e6d
 * @module CivicOS/scripts/new-file
 * @description Scaffold a new source file with a stable @fileId UUID header.
 *
 * Usage:
 *   node scripts/new-file.js <path> [description]
 *
 * Examples:
 *   node scripts/new-file.js src/components/ResourceCard.jsx "Single funding lead card"
 *   node scripts/new-file.js src/hooks/useResources.js "Resource state management hook"
 */

import { randomUUID } from 'crypto';
import { writeFileSync, existsSync } from 'fs';
import { resolve, relative, extname, basename } from 'path';

const [, , filePath, description = 'TODO: add description'] = process.argv;

if (!filePath) {
  console.error('Usage: node scripts/new-file.js <path> [description]');
  process.exit(1);
}

const abs = resolve(filePath);

if (existsSync(abs)) {
  console.error(`Error: file already exists — ${filePath}`);
  process.exit(1);
}

const uuid = randomUUID();
const ext = extname(filePath);
const name = basename(filePath, ext);
const rel = relative(resolve('.'), abs);
const moduleName = `CivicOS/${rel.replace(/\\/g, '/')}`;

const isCSS = ext === '.css';
const commentChar = isCSS ? '/*' : '//';

const header = isCSS
  ? `/*\n * @fileId ${uuid}\n * @module ${moduleName}\n * @description ${description}\n */\n\n`
  : `/**\n * @fileId ${uuid}\n * @module ${moduleName}\n * @description ${description}\n */\n\n`;

const body = ext === '.jsx' || ext === '.tsx'
  ? `import React from 'react';\n\n/**\n * ${name}\n * @description ${description}\n */\nexport default function ${name}() {\n  return (\n    <div>\n      {/* ${name} */}\n    </div>\n  );\n}\n`
  : ext === '.js' || ext === '.ts'
  ? `export {};\n`
  : '';

writeFileSync(abs, header + body, 'utf-8');

console.log(`\n✓ Created: ${filePath}`);
console.log(`  @fileId  ${uuid}`);
console.log(`  @module  ${moduleName}\n`);
