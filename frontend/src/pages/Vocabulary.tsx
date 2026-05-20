import { Dispatch, SetStateAction, useEffect, useState } from 'react'

const API = 'http://localhost:8000'

type Word = { id: string; french_word: string; part_of_speech: string | null }

const POS_COLORS: Record<string, string> = {
  noun: 'bg-blue-50 text-blue-600 border border-blue-100',
  verb: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  adjective: 'bg-violet-50 text-violet-600 border border-violet-100',
  adverb: 'bg-amber-50 text-amber-600 border border-amber-100',
  interjection: 'bg-orange-50 text-orange-600 border border-orange-100',
}

function WordList({ title, words, onAdd, onDelete }: {
  title: string
  words: Word[]
  onAdd: (word: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [input, setInput] = useState('')

  const handleAdd = async () => {
    const trimmed = input.trim()
    if (!trimmed) return
    await onAdd(trimmed)
    setInput('')
  }

  return (
    <div className="flex-1 min-w-0">
      <h2
        className="text-xl font-semibold text-navy-900 mb-4"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {title}
      </h2>
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 bg-white border border-cream-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gold-400 shadow-sm placeholder-gray-300 transition-colors"
          placeholder="Add a French word..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-navy-900 text-white text-sm font-medium rounded-lg hover:bg-navy-800 transition-colors shadow-sm"
        >
          Add
        </button>
      </div>
      {words.length === 0 ? (
        <div className="py-10 text-center bg-white rounded-xl border border-cream-200 shadow-sm">
          <p className="text-sm text-gray-400">No words yet — add one above</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-cream-200 shadow-sm overflow-hidden">
          {words.map((w, i) => (
            <div
              key={w.id}
              className={`flex items-center justify-between px-4 py-3 group ${i !== words.length - 1 ? 'border-b border-cream-200' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-800">{w.french_word}</span>
                {w.part_of_speech && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${POS_COLORS[w.part_of_speech] ?? 'bg-gray-50 text-gray-500 border border-gray-100'}`}>
                    {w.part_of_speech}
                  </span>
                )}
              </div>
              <button
                onClick={() => onDelete(w.id)}
                className="text-gray-300 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-all"
              >
                remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Vocabulary() {
  const [known, setKnown] = useState<Word[]>([])
  const [wantToLearn, setWantToLearn] = useState<Word[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch(`${API}/vocab/known`),
      fetch(`${API}/vocab/want-to-learn`),
    ])
      .then(async ([knownRes, wantRes]) => {
        setKnown(await knownRes.json())
        setWantToLearn(await wantRes.json())
      })
      .catch(() => setError('Could not load vocabulary — is the backend running?'))
  }, [])

  const addWord = (endpoint: string, setList: Dispatch<SetStateAction<Word[]>>, setOther: Dispatch<SetStateAction<Word[]>>) =>
    async (french_word: string) => {
      const res = await fetch(`${API}/vocab/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ french_word }),
      })
      if (res.ok) {
        const word = await res.json()
        setList((prev) => [...prev, word])
        setOther((prev) => prev.filter((w) => w.french_word !== french_word))
      }
    }

  const deleteWord = (endpoint: string, setList: Dispatch<SetStateAction<Word[]>>) =>
    async (id: string) => {
      const res = await fetch(`${API}/vocab/${endpoint}/${id}`, { method: 'DELETE' })
      if (res.ok || res.status === 204) setList((prev) => prev.filter((w) => w.id !== id))
    }

  return (
    <div>
      <h1
        className="text-3xl font-semibold text-navy-900 mb-1"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Vocabulary
      </h1>
      <p className="text-sm text-gray-500 mb-8">Manage your French word lists.</p>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-500">{error}</div>
      )}
      <div className="flex gap-8">
        <WordList title="Known" words={known} onAdd={addWord('known', setKnown, setWantToLearn)} onDelete={deleteWord('known', setKnown)} />
        <div className="w-px bg-cream-200 shrink-0 mt-10" />
        <WordList title="Want to Learn" words={wantToLearn} onAdd={addWord('want-to-learn', setWantToLearn, setKnown)} onDelete={deleteWord('want-to-learn', setWantToLearn)} />
      </div>
    </div>
  )
}
