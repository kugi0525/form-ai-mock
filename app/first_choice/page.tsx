'use client';

import { useState } from 'react';
import CategorySelector from '@/components/CategorySelector';
import DetailInput from '@/components/DetailInput';
import FormPreview from '@/components/FormPreview';
import { FormCategory, FormSchema } from '@/types/form';

export default function FirstChoice() {
  const [category, setCategory] = useState<FormCategory | null>(null);
  const [detail, setDetail] = useState('');
  const [generatedForm, setGeneratedForm] = useState<FormSchema | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!category) {
      setError('フォームの種類を選択してください');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, detail })
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || 'フォーム生成に失敗しました');
      }

      const form = await response.json() as FormSchema;
      setGeneratedForm(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    setGeneratedForm(null);
    setDetail('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-center">AIフォーム作成</h1>

          {!generatedForm ? (
            <div className="space-y-8">
              <CategorySelector selected={category} onSelect={setCategory} />

              {category && (
                <>
                  <hr />
                  <DetailInput
                    value={detail}
                    onChange={setDetail}
                    onSubmit={handleGenerate}
                    isLoading={isLoading}
                  />
                </>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <>
              <FormPreview
                schema={generatedForm}
                onRegenerate={handleRegenerate}
              />
            </>
          )}
        </div>

        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>© 2025 AI Form Mock - Simple form generator</p>
        </div>
      </div>
    </main>
  );
}
