#!/bin/bash

# Vercel build script for Prisma
echo "Starting Vercel build process..."

# Generate Prisma client with correct binary targets
echo "Generating Prisma client..."
cd packages/database

# Force regenerate Prisma client with correct binary targets for Vercel
export PRISMA_CLI_BINARY_TARGETS="rhel-openssl-3.0.x,linux-musl-openssl-3.0.x"
pnpm prisma generate --schema=./prisma/schema.prisma --no-hints --force

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
elif [ -f "generated/client/query-engine-rhel-openssl-3.0.x" ]; then
  echo "RHEL OpenSSL 3.0.x engine found (alternative location)"
else
  echo "Warning: RHEL OpenSSL 3.0.x engine not found - attempting to generate it"
  # List available engine files for debugging
  echo "Available engine files:"
  ls -la generated/client/ | grep -E "\.(so|node)$" || echo "No engine files found"
  
  # Try to generate with specific binary target
  echo "Attempting to generate RHEL binary specifically..."
  PRISMA_CLI_BINARY_TARGETS="rhel-openssl-3.0.x" pnpm prisma generate --schema=./prisma/schema.prisma --no-hints --force
fi

# Copy Prisma client to web app for proper bundling
echo "Copying Prisma client to web app..."
cd ../../apps/web
mkdir -p .prisma/client
cp -r ../../packages/database/generated/client/* .prisma/client/ 2>/dev/null || true

# Verify the copy was successful
if [ -d ".prisma/client" ]; then
  echo "Prisma client copied successfully"
  echo "Contents of .prisma/client:"
  ls -la .prisma/client/ | head -10
else
  echo "Error: Failed to copy Prisma client"
  exit 1
fi

# Build the application
echo "Building application..."
pnpm run build

echo "Build completed successfully"
