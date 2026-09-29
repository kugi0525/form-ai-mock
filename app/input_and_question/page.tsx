'use client';

import { useState } from 'react';
import FormPreview from '@/components/FormPreview';
import { FormSchema, QA } from '@/types/form';

async function postJSON<T>(url: string, body: unknown, fallback: string): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || fallback);
  return data as T;
}

function fetchFormAndQuestion(description: string, history: QA[]) {
  return Promise.all([
    postJSON<FormSchema>('/api/generate-form-free', { description, history }, 'フォーム生成に失敗しました'),
    postJSON<{ question: string | null }>('/api/ask-question', { description, history }, '質問の生成に失敗しました')
  ]);
}

export default function InputAndQuestion() {
  const [description, setDescription] = useState('');
  const [history, setHistory] = useState<QA[]>([]);
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [generatedForm, setGeneratedForm] = useState<FormSchema | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (nextHistory: QA[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const [form, questionData] = await fetchFormAndQuestion(description, nextHistory);
      setGeneratedForm(form);
      setQuestion(questionData.question);
      setHistory(nextHistory);
      setAnswer('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = () => {
    if (!description.trim()) {
      setError('フォームの説明を入力してください');
      return;
    }
    run([]);
  };

  const handleAnswer = () => {
    if (!question) return;
    if (!answer.trim()) {
      setError('質問への回答を入力してください');
      return;
    }
    run([...history, { question, answer }]);
  };

  const handleReset = () => {
    setDescription('');
    setHistory([]);
    setQuestion(null);
    setAnswer('');
    setGeneratedForm(null);
    setError(null);
  };

  const buttonClass =
    'w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors';
  const textareaClass =
    'w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500';

  const errorBox = error && (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
  );

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
                  placeholder="例: アンケートフォームを作ってください"
                  className={textareaClass}
                  rows={4}
                  disabled={isLoading}
                />
              </div>
              <button onClick={handleGenerate} disabled={isLoading} className={buttonClass}>
                {isLoading ? 'フォーム作成中...' : 'フォームを生成'}
              </button>
              {errorBox}
            </div>
          ) : (
            <div className="space-y-6">
              <FormPreview schema={generatedForm} />

              {question ? (
                <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-700">
                    AIからの質問{history.length > 0 && `（${history.length + 1}問目）`}：答えるとフォームを改善します
                  </p>
                  <p>{question}</p>
                  <textarea
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    placeholder="回答を入力してください"
                    className={`${textareaClass} bg-white`}
                    rows={3}
                    disabled={isLoading}
                  />
                  <button onClick={handleAnswer} disabled={isLoading} className={buttonClass}>
                    {isLoading ? 'フォーム再生成中...' : '回答してフォームを再生成'}
                  </button>
                </div>
              ) : (
                history.length > 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    AIからの質問は以上です。{history.length}件の回答を反映したフォームです。
                  </div>
                )
              )}

              {errorBox}

              <button
                onClick={handleReset}
                disabled={isLoading}
                className="w-full bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 disabled:bg-gray-400 transition-colors"
              >
                戻る
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
