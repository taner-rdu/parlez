import { useState } from 'react'

const API = 'http://localhost:8000'

const TENSES = [
  'Présent',
  'Passé composé',
  'Imparfait',
  'Futur simple',
  'Conditionnel présent',
  'Subjonctif présent',
]
const PRONOUNS = ['je', 'tu', 'il/elle/on', 'nous', 'vous', 'ils/elles']

type ConjugationTable = {
  verb: string
  tenses: Record<string, Record<string, string>>
}

export default function Conjugation() {
  const [verb, setVerb] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [table, setTable] = useState<ConjugationTable | null>(null)

  const handleGenerate = async () => {
    const trimmed = verb.trim()
    if (!trimmed) return
    setLoading(true)
    setError(null)
    setTable(null)
    try {
      const res = await fetch(`${API}/conjugation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verb: trimmed }),
      })
      if (!res.ok) throw new Error('Server error')
      const data = await res.json()
      if (!data.valid) {
        setError(data.error ?? 'Not a valid French verb')
        return
      }
      setTable({ verb: trimmed, tenses: data.tenses })
    } catch {
      setError('Could not reach the conjugation service.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1
        className="text-3xl font-semibold text-navy-900 mb-1"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Conjugation
      </h1>
      <p className="text-sm text-gray-500 mb-8">Enter a verb to see its full conjugation table.</p>

      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 bg-white border border-cream-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-gold-400 shadow-sm placeholder-gray-300 transition-colors"
          placeholder="Enter a French verb (e.g. parler)..."
          value={verb}
          onChange={(e) => setVerb(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-5 py-2.5 bg-navy-900 text-white text-sm font-medium rounded-lg hover:bg-navy-800 transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? 'Loading…' : 'Generate'}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2 mb-6">
          {error}
        </p>
      )}

      {table && (
        <div>
          <h2
            className="text-2xl font-semibold text-navy-900 italic mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {table.verb}
          </h2>

          <div className="rounded-xl border border-cream-200 shadow-sm">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-cream-100 border-b border-cream-200">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Pronoun
                  </th>
                  {TENSES.map((tense) => (
                    <th
                      key={tense}
                      className="text-left px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                    >
                      {tense}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRONOUNS.map((pronoun, i) => (
                  <tr
                    key={pronoun}
                    className={`${i !== PRONOUNS.length - 1 ? 'border-b border-cream-200' : ''} ${i % 2 === 0 ? 'bg-white' : 'bg-cream-50'}`}
                  >
                    <td className="px-4 py-3 text-gray-400 font-medium">
                      {pronoun}
                    </td>
                    {TENSES.map((tense) => (
                      <td key={tense} className="px-4 py-3 text-navy-900 font-medium">
                        {table.tenses[tense]?.[pronoun] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
