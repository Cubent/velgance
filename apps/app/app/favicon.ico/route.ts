import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  // Read the favicon.ico file from the public directory
  const faviconPath = path.join(process.cwd(), 'public', 'favicon.ico')
  
  try {
    const faviconBuffer = fs.readFileSync(faviconPath)
    
    return new Response(faviconBuffer, {
      headers: {
        'Content-Type': 'image/x-icon',
        'Cache-Control': 'public, immutable, no-transform, max-age=31536000',
      },
    })
  } catch (error) {
    // Fallback to 404 if favicon.ico is not found
    return new Response('Not Found', { status: 404 })
  }
}
