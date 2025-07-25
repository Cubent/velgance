#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Auto-convert all images to AVIF for maximum compression
class AVIFConverter {
  constructor() {
    this.publicDir = path.join(process.cwd(), 'public');
    this.totalSavings = 0;
    this.convertedCount = 0;
  }

  // Convert all images in directory to AVIF
  convertDirectory(dir = this.publicDir) {
    console.log(`🔍 Scanning directory: ${dir}`);
    
    if (!fs.existsSync(dir)) {
      console.log('❌ Public directory not found');
      return;
    }

    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        this.convertDirectory(filePath);
      } else {
        this.convertImage(filePath);
      }
    });
  }

  // Convert individual image to AVIF
  convertImage(imagePath) {
    const ext = path.extname(imagePath).toLowerCase();
    const baseName = path.basename(imagePath, ext);
    const dir = path.dirname(imagePath);
    
    // Only convert these formats
    const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp'];
    
    if (!supportedFormats.includes(ext)) {
      return; // Skip non-image files
    }

    try {
      const stats = fs.statSync(imagePath);
      const originalSize = stats.size;
      const originalSizeMB = originalSize / (1024 * 1024);
      
      // Skip tiny images
      if (originalSize < 10 * 1024) { // Less than 10KB
        return;
      }

      const avifPath = path.join(dir, baseName + '.avif');
      
      // Skip if AVIF already exists and is newer
      if (fs.existsSync(avifPath)) {
        const avifStats = fs.statSync(avifPath);
        if (avifStats.mtime > stats.mtime) {
          return; // AVIF is newer, skip
        }
      }

      console.log(`🔄 Converting: ${path.relative(this.publicDir, imagePath)} (${originalSizeMB.toFixed(2)}MB)`);
      
      // Convert to AVIF with aggressive compression
      const command = `npx sharp -i "${imagePath}" -o "${avifPath}" --avif --quality 50 --effort 9`;
      
      try {
        execSync(command, { stdio: 'pipe' });
        
        // Check results
        if (fs.existsSync(avifPath)) {
          const avifStats = fs.statSync(avifPath);
          const avifSize = avifStats.size;
          const avifSizeMB = avifSize / (1024 * 1024);
          const savings = originalSize - avifSize;
          const savingsPercent = (savings / originalSize * 100).toFixed(1);
          
          this.totalSavings += savings;
          this.convertedCount++;
          
          console.log(`✅ Created: ${path.relative(this.publicDir, avifPath)} (${avifSizeMB.toFixed(2)}MB) - ${savingsPercent}% smaller`);
          
          // If AVIF is much smaller, suggest replacing original
          if (avifSize < originalSize * 0.5) {
            console.log(`💡 Consider replacing original (${savingsPercent}% savings)`);
          }
        }
        
      } catch (error) {
        if (error.message.includes('sharp')) {
          console.log(`❌ Sharp not installed. Run: npm install sharp`);
        } else {
          console.log(`❌ Conversion failed: ${error.message}`);
        }
      }
      
    } catch (error) {
      console.error(`Error processing ${imagePath}:`, error.message);
    }
  }

  // Generate summary report
  generateReport() {
    const totalSavingsMB = this.totalSavings / (1024 * 1024);
    
    console.log('\n📊 AVIF Conversion Summary:');
    console.log(`   Images converted: ${this.convertedCount}`);
    console.log(`   Total space saved: ${totalSavingsMB.toFixed(2)}MB`);
    
    if (this.convertedCount > 0) {
      console.log(`   Average savings: ${(totalSavingsMB / this.convertedCount).toFixed(2)}MB per image`);
      console.log('\n💡 Next steps:');
      console.log('   1. Update your <img> tags to use AVIF files');
      console.log('   2. Add fallbacks: <source srcSet="image.avif" type="image/avif">');
      console.log('   3. Consider removing original large images');
    }
  }

  // Run conversion
  run() {
    console.log('🚀 Starting AVIF conversion...\n');
    
    // Check if sharp is available
    try {
      execSync('npx sharp --version', { stdio: 'pipe' });
    } catch (error) {
      console.log('❌ Sharp not found. Installing...');
      try {
        execSync('npm install sharp', { stdio: 'inherit' });
      } catch (installError) {
        console.log('❌ Failed to install sharp. Please run: npm install sharp');
        return;
      }
    }
    
    this.convertDirectory();
    this.generateReport();
    
    console.log('\n✅ AVIF conversion complete!');
  }
}

// Run if called directly
if (require.main === module) {
  const converter = new AVIFConverter();
  converter.run();
}

module.exports = AVIFConverter;
