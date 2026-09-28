'use client';

interface DetailInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function DetailInput({
  value,
  onChange,
  onSubmit,
  isLoading
}: DetailInputProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="detail" className="block text-sm font-medium mb-2">
          フォームの詳細を説明してください
        </label>
        <textarea
          id="detail"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="例: 商品の満足度を0-10で評価してもらい、改善点を聞く"
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          disabled={isLoading}
        />
      </div>
      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'フォーム作成中...' : 'フォームを生成'}
      </button>
    </div>
  );
}
