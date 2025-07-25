#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Bundle analysis and optimization script
class BundleOptimizer {
  constructor() {
    this.buildDir = path.join(process.cwd(), '.next');
    this.publicDir = path.join(process.cwd(), 'public');
  }

  // Analyze bundle size
  analyzeBundleSize() {
    console.log('📊 Analyzing bundle size...');
    
    try {
      // Run bundle analyzer
      execSync('npx @next/bundle-analyzer', { stdio: 'inherit' });
    } catch (error) {
      console.log('Bundle analyzer not available, installing...');
      execSync('npm install --save-dev @next/bundle-analyzer', { stdio: 'inherit' });
    }
  }

  // Optimize images in public directory
  optimizeImages() {
    console.log('🖼️  Optimizing images...');
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
    
    const optimizeDirectory = (dir) => {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          optimizeDirectory(filePath);
        } else if (imageExtensions.includes(path.extname(file).toLowerCase())) {
          this.optimizeImage(filePath);
        }
      });
    };

    if (fs.existsSync(this.publicDir)) {
      optimizeDirectory(this.publicDir);
    }
  }

  // Optimize individual image - AUTO CONVERT TO AVIF
  optimizeImage(imagePath) {
    const ext = path.extname(imagePath).toLowerCase();
    const baseName = path.basename(imagePath, ext);
    const dir = path.dirname(imagePath);

    try {
      // Check file size
      const stats = fs.statSync(imagePath);
      const fileSizeInMB = stats.size / (1024 * 1024);

      if (fileSizeInMB > 1) {
        console.log(`⚠️  LARGE IMAGE: ${imagePath} (${fileSizeInMB.toFixed(2)}MB)`);
      }

      if (fileSizeInMB > 0.1) {
        console.log(`📸 Processing: ${imagePath} (${fileSizeInMB.toFixed(2)}MB)`);
      }

      // AUTO CONVERT TO AVIF for maximum compression
      if (ext !== '.avif' && ext !== '.svg' && ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        const avifPath = path.join(dir, baseName + '.avif');

        if (!fs.existsSync(avifPath)) {
          console.log(`🔄 Converting to AVIF: ${imagePath}`);
          try {
            // Use sharp to convert to AVIF with aggressive compression
            execSync(`npx sharp -i "${imagePath}" -o "${avifPath}" --avif --quality 50`, { stdio: 'inherit' });

            // Check new file size
            const newStats = fs.statSync(avifPath);
            const newSizeInMB = newStats.size / (1024 * 1024);
            const savings = ((stats.size - newStats.size) / stats.size * 100).toFixed(1);

            console.log(`✅ AVIF created: ${avifPath} (${newSizeInMB.toFixed(2)}MB) - ${savings}% smaller!`);

            // If AVIF is significantly smaller, suggest replacing original
            if (newStats.size < stats.size * 0.7) {
              console.log(`💡 Consider replacing ${imagePath} with ${avifPath}`);
            }

          } catch (error) {
            console.log(`❌ AVIF conversion failed: ${error.message}`);
            console.log(`📦 Install sharp: npm install sharp`);
          }
        } else {
          console.log(`✅ AVIF already exists: ${avifPath}`);
        }
      }

    } catch (error) {
      console.error(`Error processing ${imagePath}:`, error.message);
    }
  }

  // Remove unused CSS
  removeUnusedCSS() {
    console.log('🎨 Analyzing CSS usage...');
    
    // This would require PurgeCSS or similar tool
    console.log('Consider using PurgeCSS to remove unused styles');
  }

  // Analyze JavaScript chunks
  analyzeJSChunks() {
    console.log('📦 Analyzing JavaScript chunks...');
    
    const staticDir = path.join(this.buildDir, 'static');
    if (!fs.existsSync(staticDir)) {
      console.log('Build directory not found. Run `npm run build` first.');
      return;
    }

    const chunksDir = path.join(staticDir, 'chunks');
    if (fs.existsSync(chunksDir)) {
      const chunks = fs.readdirSync(chunksDir);
      let totalSize = 0;
      
      chunks.forEach(chunk => {
        const chunkPath = path.join(chunksDir, chunk);
        const stats = fs.statSync(chunkPath);
        const sizeInKB = stats.size / 1024;
        totalSize += sizeInKB;
        
        if (sizeInKB > 100) {
          console.log(`📦 Large chunk: ${chunk} (${sizeInKB.toFixed(2)}KB)`);
        }
      });
      
      console.log(`📊 Total chunks size: ${(totalSize / 1024).toFixed(2)}MB`);
    }
  }

  // Generate performance report
  generatePerformanceReport() {
    console.log('📈 Generating performance report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      bundleSize: this.getBundleSize(),
      imageOptimization: this.getImageOptimizationStatus(),
      recommendations: this.getRecommendations(),
    };

    const reportPath = path.join(process.cwd(), 'performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📄 Performance report saved to: ${reportPath}`);
  }

  getBundleSize() {
    // Analyze .next directory size
    if (!fs.existsSync(this.buildDir)) {
      return { error: 'Build directory not found' };
    }

    const getDirectorySize = (dir) => {
      let size = 0;
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          size += getDirectorySize(filePath);
        } else {
          size += stats.size;
        }
      });
      
      return size;
    };

    const totalSize = getDirectorySize(this.buildDir);
    return {
      totalSizeBytes: totalSize,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
    };
  }

  getImageOptimizationStatus() {
    const images = [];
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
    
    const scanDirectory = (dir) => {
      if (!fs.existsSync(dir)) return;
      
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          scanDirectory(filePath);
        } else if (imageExtensions.includes(path.extname(file).toLowerCase())) {
          images.push({
            path: filePath,
            size: stats.size,
            sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
          });
        }
      });
    };

    scanDirectory(this.publicDir);
    
    return {
      totalImages: images.length,
      largeImages: images.filter(img => img.size > 1024 * 1024), // > 1MB
      totalImageSize: images.reduce((sum, img) => sum + img.size, 0),
    };
  }

  getRecommendations() {
    const recommendations = [];
    
    // Check for common optimization opportunities
    const bundleSize = this.getBundleSize();
    if (bundleSize.totalSizeMB > 10) {
      recommendations.push('Consider code splitting to reduce bundle size');
    }
    
    const imageStatus = this.getImageOptimizationStatus();
    if (imageStatus.largeImages.length > 0) {
      recommendations.push(`Optimize ${imageStatus.largeImages.length} large images`);
    }
    
    recommendations.push('Enable gzip/brotli compression');
    recommendations.push('Implement service worker for caching');
    recommendations.push('Use CDN for static assets');
    
    return recommendations;
  }

  // Run all optimizations
  run() {
    console.log('🚀 Starting bundle optimization...\n');
    
    this.analyzeJSChunks();
    this.optimizeImages();
    this.removeUnusedCSS();
    this.generatePerformanceReport();
    
    console.log('\n✅ Optimization complete!');
  }
}

// Run if called directly
if (require.main === module) {
  const optimizer = new BundleOptimizer();
  optimizer.run();
}

module.exports = BundleOptimizer;
