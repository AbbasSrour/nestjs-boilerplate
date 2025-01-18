#!/usr/bin/env node

import { execSync } from 'node:child_process';

// Get the module name from command-line arguments
const moduleName = process.argv[2];

if (!moduleName) {
  console.error(
    'Error: Please provide a module name. Usage: pnpm new <module-name>',
  );
  process.exit(1);
}

try {
  // Generate the module under src/<module-name>
  console.log(`Creating module: ${moduleName}...`);
  execSync(`nest g module ${moduleName}`, { stdio: 'inherit' });

  // Generate the controller under src/<module-name>
  console.log(`Creating controller for module: ${moduleName}...`);
  execSync(`nest g controller ${moduleName}`, { stdio: 'inherit' });

  // Generate the service under src/<module-name>
  console.log(`Creating service for module: ${moduleName}...`);
  execSync(`nest g service ${moduleName}`, { stdio: 'inherit' });

  console.log(
    `Module, controller, and service for '${moduleName}' created successfully!`,
  );
} catch (err) {
  console.error('Error while generating module components:', err.message);
  process.exit(1);
}
