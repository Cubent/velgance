import { NextRequest, NextResponse } from 'next/server';
import { database } from '@repo/database';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Find user by extension API key
    const dbUser = await database.user.findFirst({
      where: { extensionApiKey: token },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      modelId,
      completionsCount = 1,
      linesWritten = 0,
      cubentUnitsUsed = 0,
      tokensUsed = 0,
      costAccrued = 0,
      sessionId,
      metadata = {},
    } = body;

    if (!modelId) {
      return NextResponse.json(
        { error: 'modelId is required' },
        { status: 400 }
      );
    }

    // Create autocomplete usage analytics entry
    await database.usageAnalytics.create({
      data: {
        userId: dbUser.id,
        modelId,
        tokensUsed: tokensUsed,
        cubentUnitsUsed: cubentUnitsUsed,
        requestsMade: 1, // Each autocomplete request
        costAccrued: costAccrued,
        sessionId: sessionId,
        isAutocomplete: true,
        completionsCount: completionsCount,
        linesWritten: linesWritten,
        metadata: {
          feature: 'autocomplete',
          timestamp: Date.now(),
          ...metadata,
        },
      },
    });

    // Update or create daily usage metrics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingMetrics = await database.usageMetrics.findFirst({
      where: {
        userId: dbUser.id,
        date: today,
      },
    });

    if (existingMetrics) {
      await database.usageMetrics.update({
        where: { id: existingMetrics.id },
        data: {
          tokensUsed: { increment: tokensUsed },
          cubentUnitsUsed: { increment: cubentUnitsUsed },
          requestsMade: { increment: 1 },
          costAccrued: { increment: costAccrued },
          autocompleteCompletions: { increment: completionsCount },
          autocompleteLinesWritten: { increment: linesWritten },
        },
      });
    } else {
      await database.usageMetrics.create({
        data: {
          userId: dbUser.id,
          date: today,
          tokensUsed: tokensUsed,
          cubentUnitsUsed: cubentUnitsUsed,
          requestsMade: 1,
          costAccrued: costAccrued,
          autocompleteCompletions: completionsCount,
          autocompleteLinesWritten: linesWritten,
        },
      });
    }

    // Update user's total usage counters
    await database.user.update({
      where: { id: dbUser.id },
      data: {
        cubentUnitsUsed: {
          increment: cubentUnitsUsed,
        },
        lastActiveAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Autocomplete usage tracked successfully',
      data: {
        completionsCount,
        linesWritten,
        cubentUnitsUsed,
        tokensUsed,
        costAccrued,
      },
    });

  } catch (error) {
    console.error('Autocomplete tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
