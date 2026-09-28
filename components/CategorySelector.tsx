'use client';

import { FormCategory } from '@/types/form';

interface CategorySelectorProps {
  selected: FormCategory | null;
  onSelect: (category: FormCategory) => void;
}

const categories: { id: FormCategory; label: string; description: string }[] = [
  {
    id: 'survey',
    label: 'アンケート',
    description: '顧客満足度やフィードバック収集用'
  },
  {
    id: 'campaign',
    label: 'キャンペーン募集',
    description: 'イベント参加や商品購入の申し込み用'
  },
  {
    id: 'contact',
    label: 'お問合せ対応',
    description: '問い合わせやサポートリクエスト用'
  }
];

export default function CategorySelector({
  selected,
  onSelect
}: CategorySelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">フォームの種類を選択してください</h2>
      <div className="grid gap-3">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`p-4 text-left rounded-lg border-2 transition-colors ${
              selected === category.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="font-semibold">{category.label}</div>
            <div className="text-sm text-gray-600">{category.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
