import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';
import { buildPrompt, extractJSON } from '@/lib/prompt';
import { FormCategory } from '@/types/form';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, detail } = body as {
      category: FormCategory;
      detail: string;
    };

    // バリデーション
    if (!category || !['survey', 'campaign', 'contact'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    if (!detail || detail.trim().length === 0) {
      return NextResponse.json(
        { error: 'Detail is required' },
        { status: 400 }
      );
    }

    // OpenAI APIを呼び出し
    const client = getOpenAIClient();
    const prompt = buildPrompt(category, detail);

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // レスポンスからJSONを抽出
    const content = response.choices[0].message.content;
    if (!content) {
      return NextResponse.json(
        { error: 'Unexpected response from OpenAI' },
        { status: 500 }
      );
    }

    const formSchema = extractJSON(content);
    if (!formSchema) {
      return NextResponse.json(
        { error: 'Failed to parse form schema from response' },
        { status: 500 }
      );
    }

    return NextResponse.json(formSchema);
  } catch (error) {
    console.error('Error generating form:', error);

    if (error instanceof Error) {
      if (error.message.includes('OPENAI_API_KEY')) {
        return NextResponse.json(
          { error: 'API key not configured' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate form' },
      { status: 500 }
    );
  }
}
