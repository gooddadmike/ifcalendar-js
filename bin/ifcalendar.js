#!/usr/bin/env node

import { toIFC, toGregorian } from '../dist/index.js';

const args = process.argv.slice(2);

if (args.length === 0) {
  // Default: show today
  console.log(toIFC(null));
  process.exit(0);
}

const command = args[0].toLowerCase();
const input = args[1];
const format = args[2] || null;

try {
  if (command === 'to-ifc' || command === 'ifc') {
    const result = toIFC(input, format);
    console.log(result);
  } 
  else if (command === 'to-greg' || command === 'greg') {
    const result = toGregorian(input, format);
    console.log(result);
  } 
  else {
    console.log(`Usage:
  ifcalendar [to-ifc|to-greg] <date> [short|long]

Examples:
  ifcalendar                    → today in IFC:YYYY-MM-DD format
  ifcalendar to-ifc 2026-03-25
  ifcalendar to-ifc 2026-03-25 long
  ifcalendar to-greg IFC:2026-03-25
  ifcalendar to-greg IFC:2024-06-29 long
`);
  }
} catch (err) {
  console.error("Error:", err.message);
  process.exit(1);
}
