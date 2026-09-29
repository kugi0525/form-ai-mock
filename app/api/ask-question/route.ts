import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient, OPENAI_MODEL } from '@/lib/openai';
import { formatHistory } from '@/lib/prompt';
import { QA } from '@/types/form';

const MAX_QUESTIONS = 5;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, history = [] } = body as {
      description: string;
      history?: QA[];
    };

    if (history.length >= MAX_QUESTIONS) {
      return NextResponse.json({ question: null });
    }

    if (!description || description.trim().length === 0) {
      return NextResponse.json(
        { error: 'フォームの説明を入力してください' },
        { status: 400 }
      );
    }

    const client = getOpenAIClient();
    const prompt = `You are a form design consultant. Based on the user's form description and the Q&A so far, decide whether ONE more clarifying question would meaningfully improve the form.

User's form description: ${description}
${history.length > 0 ? `\nQ&A so far:\n${formatHistory(history)}\n` : ''}
Useful things to clarify:
- The target audience
- The specific use case
- Key metrics or goals
- Any constraints or special requirements

Rules:
- Never repeat or rephrase a question that was already asked.
- If you already have enough information to build a good form, do not ask anything. Do not ask questions just to keep the conversation going.
- The question must be a single, specific, actionable question in Japanese.

Respond with ONLY JSON (no markdown, no explanation):
{ "question": "your question here" } or { "question": null } if no further question is needed.`;

    const response = await client.chat.completions.create({
      model: OPENAI_MODEL,
      max_completion_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return NextResponse.json(
        { error: 'Unexpected response from OpenAI' },
        { status: 500 }
      );
    }

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return NextResponse.json(
          { error: 'Failed to parse question from response' },
          { status: 500 }
        );
      }

      const parsed = JSON.parse(jsonMatch[0]) as { question: string | null };
      return NextResponse.json({ question: parsed.question?.trim() || null });
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse question from response' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error generating question:', error);

    if (error instanceof Error) {
      if (error.message.includes('OPENAI_API_KEY')) {
        return NextResponse.json(
          { error: 'API key not configured' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate question' },
      { status: 500 }
    );
  }
}
