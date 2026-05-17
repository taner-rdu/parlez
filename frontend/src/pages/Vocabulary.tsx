import { useState } from 'react'

type Word = { text: string; pos: string }

const INITIAL_WORDS: Word[] = [
  { text: 'bonjour', pos: 'interjection' },
  { text: 'maison', pos: 'noun' },
  { text: 'courir', pos: 'verb' },
  { text: 'beau', pos: 'adjective' },
]

const POS_COLORS: Record<string, string> = {
  noun: 'bg-blue-100 text-blue-700',
  verb: 'bg-green-100 text-green-700',
  adjective: 'bg-purple-100 text-purple-700',
  adverb: 'bg-yellow-100 text-yellow-700',
  interjection: 'bg-orange-100 text-orange-700',
}

export default function Vocabulary() {
  const [words, setWords] = useState<Word[]>(INITIAL_WORDS)
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setWords([...words, { text: trimmed, pos: 'noun' }])
    setInput('')
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Vocabulary</h1>

      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
          placeholder="Add a French word..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700"
        >
          Add
        </button>
      </div>

      <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg">
        {words.map((w, i) => (
          <li key={i} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-gray-800">{w.text}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${POS_COLORS[w.pos] ?? 'bg-gray-100 text-gray-600'}`}
            >
              {w.pos}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
