import { Dispatch, SetStateAction, useEffect, useState } from 'react'

const API = 'http://localhost:8000'

type Word = { id: string; french_word: string; part_of_speech: string | null; gender: string | null }

const POS_COLORS: Record<string, string> = {
  noun: 'bg-blue-50 text-blue-600 border border-blue-100',
  verb: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  adjective: 'bg-violet-50 text-violet-600 border border-violet-100',
  adverb: 'bg-amber-50 text-amber-600 border border-amber-100',
  pronoun: 'bg-orange-50 text-orange-600 border border-orange-100',
  article: 'bg-gray-50 text-gray-500 border border-gray-100',
  question_word: 'bg-rose-50 text-rose-600 border border-rose-100',
  preposition: 'bg-teal-50 text-teal-600 border border-teal-100',
  contraction: 'bg-yellow-50 text-yellow-600 border border-yellow-100',
  demonstrative: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
  connector: 'bg-pink-50 text-pink-600 border border-pink-100',
}

const GENDER_BG: Record<string, string> = {
  masculine: 'bg-blue-50',
  feminine: 'bg-rose-50',
}

function WordList({ title, words, onAdd, onDelete }: {
  title: string
  words: Word[]
  onAdd: (word: string) => Promise<string | null>
  onDelete: (id: string) => Promise<void>
}) {
  const [input, setInput] = useState('')
  const [addError, setAddError] = useState<string | null>(null)

  const handleAdd = async () => {
    const trimmed = input.trim()
    if (!trimmed) return
    const err = await onAdd(trimmed)
    if (err) {
      setAddError(err)
    } else {
      setInput('')
      setAddError(null)
    }
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
      {addError && (
        <p className="text-xs text-red-500 mb-2 px-1">{addError}</p>
      )}
      {words.length === 0 ? (
        <div className="py-10 text-center bg-white rounded-xl border border-cream-200 shadow-sm">
          <p className="text-sm text-gray-400">No words yet — add one above</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-cream-200 shadow-sm overflow-hidden">
          {words.map((w, i) => (
            <div
              key={w.id}
              className={`flex items-center justify-between px-4 py-3 group ${i !== words.length - 1 ? 'border-b border-cream-200' : ''} ${w.gender ? GENDER_BG[w.gender] ?? '' : ''}`}
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
    const controller = new AbortController()

    Promise.all([
      fetch(`${API}/vocab/known`, { signal: controller.signal }),
      fetch(`${API}/vocab/want-to-learn`, { signal: controller.signal }),
    ])
      .then(async ([knownRes, wantRes]) => {
        setKnown(await knownRes.json())
        setWantToLearn(await wantRes.json())
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError('Could not load vocabulary — is the backend running?')
        }
      })

    return () => controller.abort()
  }, [])

  const addWord = (endpoint: string, setList: Dispatch<SetStateAction<Word[]>>, setOther: Dispatch<SetStateAction<Word[]>>) =>
    async (french_word: string): Promise<string | null> => {
      const res = await fetch(`${API}/vocab/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ french_word }),
      })
      if (res.ok) {
        const word = await res.json()
        setList((prev) => [...prev, word])
        setOther((prev) => prev.filter((w) => w.french_word !== word.french_word))
        return null
      }
      if (res.status === 422) {
        const body = await res.json()
        return body.detail ?? 'Invalid word'
      }
      if (res.status === 503) {
        const body = await res.json()
        return body.detail ?? 'Service temporarily unavailable, please try again'
      }
      return 'Something went wrong'
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
