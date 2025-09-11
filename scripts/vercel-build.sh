#!/bin/bash

# Vercel build script for Prisma
echo "Starting Vercel build process..."

# Generate Prisma client with correct binary targets
echo "Generating Prisma client..."
cd packages/database

# Force regenerate Prisma client with correct binary targets for Vercel
export PRISMA_CLI_BINARY_TARGETS="rhel-openssl-3.0.x,linux-musl-openssl-3.0.x"
export PRISMA_GENERATE_SKIP_AUTOINSTALL=true

# Clean previous generation
rm -rf generated/client
rm -rf .prisma/client

# Generate Prisma client with correct binary targets
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

# Copy Prisma client to all apps that use it
echo "Copying Prisma client to all apps..."

# Function to copy Prisma client to an app
copy_prisma_to_app() {
  local app_dir=$1
  echo "Copying Prisma client to $app_dir..."
  
  if [ -d "../../apps/$app_dir" ]; then
    cd "../../apps/$app_dir"
    mkdir -p .prisma/client
    cp -r ../../packages/database/generated/client/* .prisma/client/ 2>/dev/null || true
    
    # Create symlinks for different binary name variations that Prisma might look for
    cd .prisma/client
    if [ -f "libquery_engine-rhel-openssl-3.0.x.so.node" ]; then
      echo "Creating symlink for query-engine-rhel-openssl-3.0.x in $app_dir"
      ln -sf libquery_engine-rhel-openssl-3.0.x.so.node query-engine-rhel-openssl-3.0.x 2>/dev/null || true
      ln -sf libquery_engine-rhel-openssl-3.0.x.so.node query_engine-rhel-openssl-3.0.x 2>/dev/null || true
    fi
    
    # Also copy to the generated/client directory
    mkdir -p generated/client
    cp -r ../../packages/database/generated/client/* generated/client/ 2>/dev/null || true
    
    # Create symlinks in generated/client as well
    if [ -f "generated/client/libquery_engine-rhel-openssl-3.0.x.so.node" ]; then
      echo "Creating symlink in generated/client for query-engine-rhel-openssl-3.0.x in $app_dir"
      ln -sf libquery_engine-rhel-openssl-3.0.x.so.node generated/client/query-engine-rhel-openssl-3.0.x 2>/dev/null || true
      ln -sf libquery_engine-rhel-openssl-3.0.x.so.node generated/client/query_engine-rhel-openssl-3.0.x 2>/dev/null || true
    fi
    
    cd ../..
    
    # Verify the copy was successful
    if [ -d ".prisma/client" ]; then
      echo "Prisma client copied successfully to $app_dir"
      echo "Contents of .prisma/client:"
      ls -la .prisma/client/ | head -5
    else
      echo "Error: Failed to copy Prisma client to $app_dir"
    fi
  else
    echo "App directory $app_dir not found, skipping..."
  fi
}

# Copy to all apps that use the database package
copy_prisma_to_app "web"
copy_prisma_to_app "app"

# Return to the original directory
cd ../../packages/database

# Build the web application
echo "Building web application..."
cd ../../apps/web
pnpm run build

echo "Build completed successfully"
