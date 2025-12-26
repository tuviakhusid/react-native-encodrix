#!/usr/bin/env node
/**
 * Node.js wrapper script to filter out Windows code page messages
 * This script executes node commands and filters out "Active code page: XXXX" messages
 */

const { spawn } = require('child_process');
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: node-wrapper.js <command> [args...]');
  process.exit(1);
}

const command = args[0];
const commandArgs = args.slice(1);

const child = spawn(command, commandArgs, {
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true,
  env: {
    ...process.env,
    PYTHONIOENCODING: 'utf-8',
  }
});

let stdout = '';
let stderr = '';

child.stdout.on('data', (data) => {
  const text = data.toString();
  // Filter out Windows code page messages
  const filtered = text.replace(/Active code page: \d+\s*/g, '');
  stdout += filtered;
  // Output filtered text immediately
  process.stdout.write(filtered);
});

child.stderr.on('data', (data) => {
  const text = data.toString();
  // Filter out Windows code page messages
  const filtered = text.replace(/Active code page: \d+\s*/g, '');
  stderr += filtered;
  // Output filtered text immediately
  process.stderr.write(filtered);
});

child.on('close', (code) => {
  process.exit(code || 0);
});

child.on('error', (error) => {
  console.error('Error:', error);
  process.exit(1);
});

