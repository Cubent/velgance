import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Testing airport API...');

    // Test the main airport search API
    const testResponse = await fetch('http://localhost:3001/api/airports/search?q=JFK');
    const testData = await testResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Airport API test completed',
      apiStatus: testResponse.ok ? 'Working' : 'Failed',
      sampleSearch: 'JFK',
      resultsFound: testData.count || 0,
      sampleResults: testData.data?.slice(0, 3) || []
    });

  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Airport API test failed'
    });
  }
}
