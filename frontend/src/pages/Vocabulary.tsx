import { Dispatch, SetStateAction, useEffect, useState } from 'react'

const API = 'http://localhost:8000'

type Word = { id: string; french_word: string; part_of_speech: string | null }

const POS_COLORS: Record<string, string> = {
  noun: 'bg-blue-100 text-blue-700',
  verb: 'bg-green-100 text-green-700',
  adjective: 'bg-purple-100 text-purple-700',
  adverb: 'bg-yellow-100 text-yellow-700',
  interjection: 'bg-orange-100 text-orange-700',
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
      <h2 className="text-lg font-medium text-gray-700 mb-4">{title}</h2>
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
          placeholder="Add a French word..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button onClick={handleAdd} className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700">
          Add
        </button>
      </div>
      {words.length === 0 ? (
        <p className="text-sm text-gray-400 py-6 text-center border border-gray-100 rounded-lg">No words yet</p>
      ) : (
        <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg">
          {words.map((w) => (
            <li key={w.id} className="flex items-center justify-between px-4 py-3 group">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-800">{w.french_word}</span>
                {w.part_of_speech && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${POS_COLORS[w.part_of_speech] ?? 'bg-gray-100 text-gray-600'}`}>
                    {w.part_of_speech}
                  </span>
                )}
              </div>
              <button
                onClick={() => onDelete(w.id)}
                className="text-gray-300 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                remove
              </button>
            </li>
          ))}
        </ul>
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
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Vocabulary</h1>
      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
      )}
      <div className="flex gap-8">
        <WordList title="Known" words={known} onAdd={addWord('known', setKnown, setWantToLearn)} onDelete={deleteWord('known', setKnown)} />
        <div className="w-px bg-gray-100 shrink-0" />
        <WordList title="Want to Learn" words={wantToLearn} onAdd={addWord('want-to-learn', setWantToLearn, setKnown)} onDelete={deleteWord('want-to-learn', setWantToLearn)} />
      </div>
    </div>
  )
}
