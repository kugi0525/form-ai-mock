import Link from 'next/link';

const pages = [
  { href: '/first_choice', title: '種類を選んで作成', description: 'フォームの種類を3つから選び、詳細を入力して生成' },
  { href: '/only_input', title: '自由入力で作成', description: 'フォームの概要を自由に入力して生成' },
  { href: '/input_and_question', title: '質問に答えて改善', description: '生成後、AIからの質問に答えてフォームを改善' }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-center">AIフォーム作成</h1>
          <ul className="space-y-4">
            {pages.map(page => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <p className="font-semibold">{page.title}</p>
                  <p className="text-sm text-gray-600">{page.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
