#!/usr/bin/env node

// Skip CI script for Vercel builds
// This script can be used to conditionally skip builds

const { execSync } = require('child_process');

// Check if this is a dependabot PR or other conditions where we want to skip
const branch = process.env.VERCEL_GIT_COMMIT_REF;
const isDependabot = branch && branch.startsWith('dependabot/');

if (isDependabot) {
  console.log('Skipping build for dependabot PR');
  process.exit(0);
}

console.log('Proceeding with build');
process.exit(1);
