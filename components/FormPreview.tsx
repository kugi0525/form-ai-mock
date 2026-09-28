'use client';

import { FormSchema } from '@/types/form';

interface FormPreviewProps {
  schema: FormSchema;
  onRegenerate: () => void;
}

export default function FormPreview({ schema, onRegenerate }: FormPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-2">{schema.title}</h2>
        <p className="text-gray-600 mb-6">{schema.description}</p>

        <form className="space-y-4">
          {schema.fields.map((field, index) => (
            <div key={index} className="space-y-2">
              <label className="block font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === 'text' && (
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder={field.label}
                />
              )}

              {field.type === 'email' && (
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="example@example.com"
                />
              )}

              {field.type === 'date' && (
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              )}

              {field.type === 'textarea' && (
                <textarea
                  className="w-full p-2 border border-gray-300 rounded resize-none"
                  rows={4}
                  placeholder={field.label}
                />
              )}

              {field.type === 'radio' && field.options && (
                <div className="space-y-2">
                  {field.options.map((option, optIdx) => (
                    <label key={optIdx} className="flex items-center">
                      <input
                        type="radio"
                        name={`field-${index}`}
                        className="mr-2"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {field.type === 'checkbox' && field.options && (
                <div className="space-y-2">
                  {field.options.map((option, optIdx) => (
                    <label key={optIdx} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {field.type === 'select' && field.options && (
                <select className="w-full p-2 border border-gray-300 rounded">
                  <option value="">選択してください</option>
                  {field.options.map((option, optIdx) => (
                    <option key={optIdx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </form>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onRegenerate}
          className="flex-1 bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
        >
          もう一度生成
        </button>
        <button className="flex-1 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
          このフォームを使用
        </button>
      </div>
    </div>
  );
}
