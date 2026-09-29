'use client';

import { useState } from 'react';
import FormPreview from '@/components/FormPreview';
import { FormSchema } from '@/types/form';

export default function OnlyInput() {
  const [description, setDescription] = useState('');
  const [generatedForm, setGeneratedForm] = useState<FormSchema | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('フォームの説明を入力してください');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-form-free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
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
    setDescription('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-center">AIフォーム作成</h1>

          {!generatedForm ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  フォームの概要を説明してください
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="例: 新商品のベータテスト参加者募集フォーム"
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  disabled={isLoading}
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'フォーム作成中...' : 'フォームを生成'}
              </button>

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
