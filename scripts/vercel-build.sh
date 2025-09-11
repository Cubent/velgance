#!/bin/bash

# Vercel build script for Prisma
echo "Starting Vercel build process..."

# Generate Prisma client with correct binary targets
echo "Generating Prisma client..."
cd packages/database

# Force regenerate Prisma client with correct binary targets for Vercel
export PRISMA_CLI_BINARY_TARGETS="rhel-openssl-3.0.x,linux-musl-openssl-3.0.x"
pnpm prisma generate --schema=./prisma/schema.prisma --no-hints

# Verify Prisma client generation
if [ -d "generated/client" ]; then
  echo "Prisma client generated successfully"
else
  echo "Error: Prisma client generation failed"
  exit 1
fi

# Check if the correct engine files are present
echo "Checking for Prisma engine files..."
echo "Available engine files:"
ls -la generated/client/ | grep -E "(query-engine|libquery_engine)" || echo "No engine files found"

# Check for various possible binary names
if [ -f "generated/client/libquery_engine-rhel-openssl-3.0.x.so.node" ]; then
  echo "RHEL OpenSSL 3.0.x engine found (libquery_engine format)"
elif [ -f "generated/client/query-engine-rhel-openssl-3.0.x" ]; then
  echo "RHEL OpenSSL 3.0.x engine found (query-engine format)"
elif [ -f "generated/client/query_engine-rhel-openssl-3.0.x" ]; then
  echo "RHEL OpenSSL 3.0.x engine found (query_engine format)"
else
  echo "Warning: RHEL OpenSSL 3.0.x engine not found - attempting to generate it"
  
  # Try to generate with specific binary target
  echo "Attempting to generate RHEL binary specifically..."
  PRISMA_CLI_BINARY_TARGETS="rhel-openssl-3.0.x" pnpm prisma generate --schema=./prisma/schema.prisma --no-hints
  
  # Check again after generation
  echo "Checking again after generation:"
  ls -la generated/client/ | grep -E "(query-engine|libquery_engine)" || echo "Still no engine files found"
fi

# Copy Prisma client to web app for proper bundling
echo "Copying Prisma client to web app..."
cd ../../apps/web
mkdir -p .prisma/client
cp -r ../../packages/database/generated/client/* .prisma/client/ 2>/dev/null || true

# Create symlinks for different binary name variations that Prisma might look for
cd .prisma/client
if [ -f "libquery_engine-rhel-openssl-3.0.x.so.node" ]; then
  echo "Creating symlink for query-engine-rhel-openssl-3.0.x"
  ln -sf libquery_engine-rhel-openssl-3.0.x.so.node query-engine-rhel-openssl-3.0.x 2>/dev/null || true
  ln -sf libquery_engine-rhel-openssl-3.0.x.so.node query_engine-rhel-openssl-3.0.x 2>/dev/null || true
fi

# Also copy to the generated/client directory in the web app
mkdir -p generated/client
cp -r ../../packages/database/generated/client/* generated/client/ 2>/dev/null || true

# Create symlinks in generated/client as well
if [ -f "generated/client/libquery_engine-rhel-openssl-3.0.x.so.node" ]; then
  echo "Creating symlink in generated/client for query-engine-rhel-openssl-3.0.x"
  ln -sf libquery_engine-rhel-openssl-3.0.x.so.node generated/client/query-engine-rhel-openssl-3.0.x 2>/dev/null || true
  ln -sf libquery_engine-rhel-openssl-3.0.x.so.node generated/client/query_engine-rhel-openssl-3.0.x 2>/dev/null || true
fi

cd ../..

# Verify the copy was successful
if [ -d ".prisma/client" ]; then
  echo "Prisma client copied successfully"
  echo "Contents of .prisma/client:"
  ls -la .prisma/client/ | head -10
  echo "Contents of generated/client:"
  ls -la generated/client/ | head -10
else
  echo "Error: Failed to copy Prisma client"
  exit 1
fi

# Build the application
echo "Building application..."
pnpm run build

echo "Build completed successfully"
