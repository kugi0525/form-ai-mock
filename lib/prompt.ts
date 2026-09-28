import { FormCategory, FormSchema } from '@/types/form';

const categoryPrompts: Record<FormCategory, string> = {
  survey: 'アンケート形式。典型項目例: 年代、性別、満足度（5段階評価）、意見・感想など',
  campaign: 'キャンペーン募集形式。典型項目例: 名前、メール、電話番号、参加理由、選択肢からの選択など',
  contact: 'お問合せ対応フォーム形式。典型項目例: 氏名、メール、会社名、件名、本文、カテゴリ選択など'
};

export function buildPrompt(category: FormCategory, detail: string): string {
  return `You are a form generator. Generate a JSON form definition based on the user's requirements.

Category: ${category}
Typical fields for this category: ${categoryPrompts[category]}

User's detailed requirements: ${detail}

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
- Generate 3-8 fields matching the category and user's requirements
- Each field must have a meaningful label
- Select appropriate field types
- Output ONLY the JSON object, absolutely no markdown code blocks or explanations
- Ensure valid JSON syntax`;
}

export function extractJSON(text: string): FormSchema | null {
  try {
    // JSONスキームを抽出（最初の{から最後の}まで）
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]) as FormSchema;

    // 基本的な検証
    if (!parsed.title || !parsed.description || !Array.isArray(parsed.fields)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
