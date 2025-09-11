#!/bin/bash

# Vercel build script for Prisma
echo "Starting Vercel build process..."

# Generate Prisma client with correct binary targets
echo "Generating Prisma client..."
cd packages/database
pnpm prisma generate --schema=./prisma/schema.prisma --no-hints

# Verify Prisma client generation
if [ -d "generated/client" ]; then
  echo "Prisma client generated successfully"
else
  echo "Error: Prisma client generation failed"
  exit 1
fi

# Check if the correct engine files are present
if [ -f "generated/client/libquery_engine-rhel-openssl-3.0.x.so.node" ]; then
  echo "RHEL OpenSSL 3.0.x engine found"
else
  echo "Warning: RHEL OpenSSL 3.0.x engine not found"
fi

# Build the application
echo "Building application..."
cd ../../apps/web
pnpm run build

echo "Build completed successfully"
