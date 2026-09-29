import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient, OPENAI_MODEL } from '@/lib/openai';
import { extractJSON, formatHistory } from '@/lib/prompt';
import { QA } from '@/types/form';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, history = [] } = body as {
      description: string;
      history?: QA[];
    };

    if (!description || description.trim().length === 0) {
      return NextResponse.json(
        { error: 'フォームの説明を入力してください' },
        { status: 400 }
      );
    }

    const client = getOpenAIClient();
    const prompt = `You are a form generator. Generate a JSON form definition based on the user's description.

User's requirements: ${description}
${history.length > 0 ? `\nAdditional context from Q&A with the user:\n${formatHistory(history)}\n` : ''}
Generate a JSON form schema with the following structure (output ONLY valid JSON, no markdown, no explanation):
{
  "title": "string",
  "description": "string",
  "fields": [
    {
      "label": "string",
      "type": "text|textarea|radio|checkbox|select|email|date",
      "required": true or false,
      "options": ["string"] // only for radio/checkbox/select types
    }
  ]
}

Requirements:
- Generate 3-8 fields matching the user's requirements
- Each field must have a meaningful label
- Select appropriate field types
- Output ONLY the JSON object, absolutely no markdown code blocks or explanations
- Ensure valid JSON syntax`;

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
