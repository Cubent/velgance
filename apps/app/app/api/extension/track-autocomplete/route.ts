import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { database } from '@repo/database';
import { z } from 'zod';

// Autocomplete tracking schema
const autocompleteTrackingSchema = z.object({
  modelId: z.string(),
  provider: z.string(),
  
  // Core autocomplete metrics
  completionsGenerated: z.number().min(0).default(1),
  completionsAccepted: z.number().min(0).default(0),
  linesAdded: z.number().min(0).default(0),
  charactersAdded: z.number().min(0).default(0),
  
  // Context information
  language: z.string().optional(),
  filepath: z.string().optional(),
  sessionId: z.string().optional(),
  
  // Performance metrics
  latency: z.number().min(0).optional(),
  
  // Additional metadata
  timestamp: z.number().optional(),
  metadata: z.record(z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      modelId,
      provider,
      completionsGenerated,
      completionsAccepted,
      linesAdded,
      charactersAdded,
      language,
      filepath,
      sessionId,
      latency,
      timestamp,
      metadata
    } = autocompleteTrackingSchema.parse(body);

    console.log('Autocomplete tracking:', {
      userId,
      modelId,
      provider,
      completionsGenerated,
      completionsAccepted,
      linesAdded,
      charactersAdded,
      language
    });

    // Find the user in the database
    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate performance metrics
    const successRate = completionsGenerated > 0 ? (completionsGenerated / completionsGenerated) * 100 : 0; // Always 100% for generated completions
    const acceptanceRate = completionsGenerated > 0 ? (completionsAccepted / completionsGenerated) * 100 : 0;

    // Create autocomplete analytics record
    await database.autocompleteAnalytics.create({
      data: {
        userId: dbUser.id,
        modelId,
        provider,
        completionsGenerated,
        completionsAccepted,
        linesAdded,
        charactersAdded,
        language,
        filepath,
        sessionId,
        avgLatency: latency || 0,
        successRate,
        acceptanceRate,
        metadata: {
          timestamp: timestamp || Date.now(),
          ...metadata
        }
      },
    });

    // Update or create daily autocomplete metrics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingMetrics = await database.autocompleteMetrics.findFirst({
      where: {
        userId: dbUser.id,
        date: today,
      },
    });

    if (existingMetrics) {
      // Update existing daily metrics
      const newCompletionsGenerated = existingMetrics.completionsGenerated + completionsGenerated;
      const newCompletionsAccepted = existingMetrics.completionsAccepted + completionsAccepted;
      const newLinesAdded = existingMetrics.linesAdded + linesAdded;
      const newCharactersAdded = existingMetrics.charactersAdded + charactersAdded;

      // Calculate new averages
      const newAvgLatency = latency ? 
        ((existingMetrics.avgLatency * existingMetrics.completionsGenerated) + (latency * completionsGenerated)) / newCompletionsGenerated :
        existingMetrics.avgLatency;
      
      const newAvgAcceptanceRate = newCompletionsGenerated > 0 ? (newCompletionsAccepted / newCompletionsGenerated) * 100 : 0;

      // Update model breakdown
      const currentBreakdown = (existingMetrics.modelBreakdown as any) || {};
      if (!currentBreakdown[modelId]) {
        currentBreakdown[modelId] = { completions: 0, accepted: 0, lines: 0 };
      }
      currentBreakdown[modelId].completions += completionsGenerated;
      currentBreakdown[modelId].accepted += completionsAccepted;
      currentBreakdown[modelId].lines += linesAdded;

      await database.autocompleteMetrics.update({
        where: { id: existingMetrics.id },
        data: {
          completionsGenerated: newCompletionsGenerated,
          completionsAccepted: newCompletionsAccepted,
          linesAdded: newLinesAdded,
          charactersAdded: newCharactersAdded,
          avgLatency: newAvgLatency,
          avgAcceptanceRate: newAvgAcceptanceRate,
          modelBreakdown: currentBreakdown,
        },
      });
    } else {
      // Create new daily metrics
      const modelBreakdown = {
        [modelId]: {
          completions: completionsGenerated,
          accepted: completionsAccepted,
          lines: linesAdded
        }
      };

      await database.autocompleteMetrics.create({
        data: {
          userId: dbUser.id,
          completionsGenerated,
          completionsAccepted,
          linesAdded,
          charactersAdded,
          avgLatency: latency || 0,
          avgSuccessRate: successRate,
          avgAcceptanceRate: acceptanceRate,
          modelBreakdown,
          date: today,
        },
      });
    }

    // Update user's last active timestamp
    await database.user.update({
      where: { id: dbUser.id },
      data: {
        lastActiveAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Autocomplete usage tracked successfully',
      data: {
        completionsGenerated,
        completionsAccepted,
        linesAdded,
        charactersAdded,
        acceptanceRate: acceptanceRate.toFixed(1) + '%'
      }
    });

  } catch (error) {
    console.error('Autocomplete tracking error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve autocomplete statistics
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Find the user in the database
    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
      include: {
        autocompleteMetrics: {
          orderBy: { date: 'desc' },
          take: days,
        },
        autocompleteAnalytics: {
          orderBy: { createdAt: 'desc' },
          take: 100, // Recent autocomplete sessions
        }
      }
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate totals
    const totalMetrics = await database.autocompleteMetrics.aggregate({
      where: { userId: dbUser.id },
      _sum: {
        completionsGenerated: true,
        completionsAccepted: true,
        linesAdded: true,
        charactersAdded: true,
      },
      _avg: {
        avgLatency: true,
        avgAcceptanceRate: true,
      }
    });

    // Calculate model breakdown
    const modelBreakdown = await database.autocompleteAnalytics.groupBy({
      by: ['modelId', 'provider'],
      where: { userId: dbUser.id },
      _sum: {
        completionsGenerated: true,
        completionsAccepted: true,
        linesAdded: true,
        charactersAdded: true,
      },
      _avg: {
        avgLatency: true,
        acceptanceRate: true,
      },
      orderBy: {
        _sum: {
          completionsGenerated: 'desc'
        }
      }
    });

    // Prepare chart data for the last N days
    const chartData = dbUser.autocompleteMetrics.map((metric) => ({
      date: metric.date.toISOString().split('T')[0],
      completions: metric.completionsGenerated,
      accepted: metric.completionsAccepted,
      lines: metric.linesAdded,
      characters: metric.charactersAdded,
      acceptanceRate: metric.avgAcceptanceRate,
    })).reverse();

    const autocompleteData = {
      totalCompletions: totalMetrics._sum.completionsGenerated || 0,
      totalAccepted: totalMetrics._sum.completionsAccepted || 0,
      totalLinesAdded: totalMetrics._sum.linesAdded || 0,
      totalCharactersAdded: totalMetrics._sum.charactersAdded || 0,
      avgLatency: totalMetrics._avg.avgLatency || 0,
      avgAcceptanceRate: totalMetrics._avg.avgAcceptanceRate || 0,
      chartData,
      modelBreakdown: modelBreakdown.map(model => ({
        modelId: model.modelId,
        provider: model.provider,
        completions: model._sum.completionsGenerated || 0,
        accepted: model._sum.completionsAccepted || 0,
        lines: model._sum.linesAdded || 0,
        characters: model._sum.charactersAdded || 0,
        avgLatency: model._avg.avgLatency || 0,
        acceptanceRate: model._avg.acceptanceRate || 0,
      })),
      recentSessions: dbUser.autocompleteAnalytics.map(analytics => ({
        id: analytics.id,
        modelId: analytics.modelId,
        provider: analytics.provider,
        completions: analytics.completionsGenerated,
        accepted: analytics.completionsAccepted,
        lines: analytics.linesAdded,
        language: analytics.language,
        timestamp: analytics.createdAt,
      })),
    };

    return NextResponse.json({
      success: true,
      data: autocompleteData,
      period: `${days} days`,
    });

  } catch (error) {
    console.error('Autocomplete stats fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
