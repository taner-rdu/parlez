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
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Practice Conjugation</h1>

      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
          placeholder="Enter a French verb (e.g. parler)..."
          value={verb}
          onChange={(e) => setVerb(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700"
        >
          Generate
        </button>
      </div>

      {table && (
        <div>
          <p className="text-sm text-gray-500 mb-3">
            <span className="font-medium text-gray-700">{table.verb}</span> — {table.tense}
          </p>
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-600">
                <th className="px-4 py-2 font-medium border-b border-gray-200">Pronoun</th>
                <th className="px-4 py-2 font-medium border-b border-gray-200">Form</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {table.rows.map((r) => (
                <tr key={r.pronoun}>
                  <td className="px-4 py-2 text-gray-500">{r.pronoun}</td>
                  <td className="px-4 py-2 text-gray-800">{r.form}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
