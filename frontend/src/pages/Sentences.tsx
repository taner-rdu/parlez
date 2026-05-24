import { useState } from 'react'

const API = 'http://localhost:8000'
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

type CheckResult = { score: number; correct_translation: string }

type SentenceState = {
  text: string
  input: string
  result: CheckResult | null
  loading: boolean
  submitted: boolean
}

export default function Sentences() {
  const [topic, setTopic] = useState('')
  const [level, setLevel] = useState('A1')
  const [useKnownWords, setUseKnownWords] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [sentences, setSentences] = useState<SentenceState[]>([])

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setGenerating(true)
    setGenerateError(null)
    try {
      const res = await fetch(`${API}/sentences/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), level, use_known_words_only: useKnownWords }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      setSentences(
        data.sentences.map((s: string) => ({
          text: s, input: '', result: null, loading: false, submitted: false,
        }))
      )
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Échec de la génération')
    } finally {
      setGenerating(false)
    }
  }

  const handleCheck = async (index: number) => {
    const sentence = sentences[index]
    if (!sentence.input.trim()) return
    setSentences(prev => prev.map((s, i) => i === index ? { ...s, loading: true } : s))
    try {
      const res = await fetch(`${API}/sentences/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ english_sentence: sentence.text, user_translation: sentence.input }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      setSentences(prev =>
        prev.map((s, i) => i === index ? { ...s, result: data, loading: false, submitted: true } : s)
      )
    } catch {
      setSentences(prev => prev.map((s, i) => i === index ? { ...s, loading: false } : s))
    }
  }

  const handleReset = () => setSentences([])

  return (
    <div>
      <h1 className="text-4xl font-semibold text-navy-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        Phrases
      </h1>
      <p className="text-base text-gray-400 mb-10">Pratiquez la traduction de l'anglais vers le français.</p>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-cream-200 shadow-sm px-8 py-7 mb-10">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Sujet à pratiquer
            </label>
            <input
              className="w-full bg-cream-50 border border-cream-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-gold-400 placeholder-gray-300 transition-colors"
              placeholder="Ex : la nourriture, les voyages, les émotions…"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Niveau
              </label>
              <div className="flex gap-1.5">
                {LEVELS.map(l => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      level === l
                        ? 'bg-navy-900 text-white'
                        : 'bg-cream-50 border border-cream-200 text-gray-600 hover:border-gold-400 hover:text-navy-900'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="ml-auto flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={useKnownWords}
                  onChange={(e) => setUseKnownWords(e.target.checked)}
                  className="w-4 h-4 rounded accent-navy-900"
                />
                <span className="text-sm text-gray-600">Mots connus uniquement</span>
              </label>
              <button
                onClick={handleGenerate}
                disabled={!topic.trim() || generating}
                className="px-5 py-2.5 bg-navy-900 text-white text-sm font-medium rounded-lg hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {generating ? 'Génération…' : 'Générer'}
              </button>
            </div>
          </div>
        </div>

        {generateError && (
          <p className="mt-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
            {generateError}
          </p>
        )}
      </div>

      {/* Sentence list */}
      {sentences.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              10 phrases — {level}
            </p>
            <button
              onClick={handleReset}
              className="px-4 py-1.5 text-xs font-medium text-gray-500 border border-cream-200 rounded-lg hover:border-red-200 hover:text-red-400 transition-colors"
            >
              Réinitialiser
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {sentences.map((sentence, i) => (
              <div key={i} className="bg-white rounded-xl border border-cream-200 shadow-sm overflow-hidden">
                <div className="bg-navy-900 px-5 py-4 border-l-4 border-gold-500">
                  <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-1">
                    {i + 1}. Traduisez en français
                  </p>
                  <p className="text-white text-base" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {sentence.text}
                  </p>
                </div>

                <div className="px-5 py-4">
                  {!sentence.submitted ? (
                    <div className="flex gap-3">
                      <input
                        className="flex-1 bg-cream-50 border border-cream-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-gold-400 placeholder-gray-300 transition-colors"
                        placeholder="Votre traduction en français…"
                        value={sentence.input}
                        onChange={(e) =>
                          setSentences(prev =>
                            prev.map((s, idx) => idx === i ? { ...s, input: e.target.value } : s)
                          )
                        }
                        onKeyDown={(e) => e.key === 'Enter' && handleCheck(i)}
                        disabled={sentence.loading}
                      />
                      <button
                        onClick={() => handleCheck(i)}
                        disabled={!sentence.input.trim() || sentence.loading}
                        className="px-4 py-2.5 bg-navy-900 text-white text-sm font-medium rounded-lg hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm whitespace-nowrap"
                      >
                        {sentence.loading ? '…' : 'Soumettre'}
                      </button>
                    </div>
                  ) : sentence.result !== null && (
                    sentence.result.score === 100 ? (
                      <div className="flex items-center gap-3">
                        <span className="text-green-500 text-xl">✓</span>
                        <div>
                          <p className="text-sm font-medium text-green-700">Parfait !</p>
                          <p className="text-sm text-gray-600 mt-0.5">{sentence.input}</p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-red-400 text-base">✗</span>
                          <span className="text-sm font-semibold text-red-500">{sentence.result.score}%</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">
                          Votre réponse : <span className="text-gray-700">{sentence.input}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Traduction correcte :{' '}
                          <span className="text-navy-900 font-medium">{sentence.result.correct_translation}</span>
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 text-sm font-medium text-gray-500 border border-cream-200 rounded-lg hover:bg-cream-50 hover:border-gold-400 hover:text-navy-900 transition-colors"
            >
              Nouvelle série →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
