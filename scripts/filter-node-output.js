#!/usr/bin/env node
/**
 * Node.js script to filter Windows code page messages from command output
 * This script executes a command and filters out "Active code page: XXXX" messages
 */

const { execSync } = require('child_process');
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: filter-node-output.js <command> [args...]');
  process.exit(1);
}

try {
  // Execute the command and capture output
  const output = execSync(args.join(' '), {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...process.env,
      PYTHONIOENCODING: 'utf-8',
    },
    shell: true
  });
  
  // Filter out Windows code page messages
  const filtered = output.replace(/Active code page: \d+\s*/g, '');
  process.stdout.write(filtered);
} catch (error) {
  // Filter stderr as well
  const errorOutput = error.stderr ? error.stderr.toString().replace(/Active code page: \d+\s*/g, '') : error.message;
  process.stderr.write(errorOutput);
  process.exit(error.status || 1);
}

