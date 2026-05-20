import { useState } from 'react'

const MOCK_TABLE = {
  verb: 'parler',
  tense: 'Présent',
  rows: [
    { pronoun: 'je', form: 'parle' },
    { pronoun: 'tu', form: 'parles' },
    { pronoun: 'il/elle', form: 'parle' },
    { pronoun: 'nous', form: 'parlons' },
    { pronoun: 'vous', form: 'parlez' },
    { pronoun: 'ils/elles', form: 'parlent' },
  ],
}

export default function Conjugation() {
  const [verb, setVerb] = useState('')
  const [table, setTable] = useState<typeof MOCK_TABLE | null>(null)

  const handleGenerate = () => {
    setTable(MOCK_TABLE)
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

      <div className="flex gap-2 mb-8">
        <input
          className="flex-1 bg-white border border-cream-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-gold-400 shadow-sm placeholder-gray-300 transition-colors"
          placeholder="Enter a French verb (e.g. parler)..."
          value={verb}
          onChange={(e) => setVerb(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button
          onClick={handleGenerate}
          className="px-5 py-2.5 bg-navy-900 text-white text-sm font-medium rounded-lg hover:bg-navy-800 transition-colors shadow-sm"
        >
          Generate
        </button>
      </div>

      {table && (
        <div>
          <div className="flex items-baseline gap-3 mb-4">
            <h2
              className="text-2xl font-semibold text-navy-900 italic"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {table.verb}
            </h2>
            <span className="text-sm text-gray-400">{table.tense}</span>
          </div>

          <div className="bg-white rounded-xl border border-cream-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-2 bg-cream-100 border-b border-cream-200 px-5 py-2.5">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pronoun</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Form</span>
            </div>
            {table.rows.map((r, i) => (
              <div
                key={r.pronoun}
                className={`grid grid-cols-2 px-5 py-3 ${i !== table.rows.length - 1 ? 'border-b border-cream-200' : ''} ${i % 2 === 0 ? 'bg-white' : 'bg-cream-50'}`}
              >
                <span className="text-sm text-gray-400 font-medium">{r.pronoun}</span>
                <span className="text-sm text-navy-900 font-medium">{r.form}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
