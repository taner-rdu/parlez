import { useState } from 'react'

export default function Translate() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<string | null>(null)

  const handleTranslate = () => {
    setResult('Je voudrais apprendre le français.')
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Translate</h1>

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">English text</label>
        <textarea
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 resize-none focus:outline-none focus:border-gray-400"
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to translate..."
        />
      </div>

      <button
        onClick={handleTranslate}
        className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700"
      >
        Translate
      </button>

      {result !== null && (
        <div className="mt-6">
          <label className="block text-sm text-gray-600 mb-1">French translation</label>
          <div className="border border-gray-200 rounded-lg px-3 py-3 text-sm text-gray-800 bg-gray-50 min-h-16">
            {result}
          </div>
        </div>
      )}
    </div>
  )
}
