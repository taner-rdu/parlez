import { useState } from 'react'

const LANGUAGES: Record<string, { name: string; flag: string }> = {
  EN: { name: 'English', flag: '🇬🇧' },
  FR: { name: 'French', flag: '🇫🇷' },
}

export default function Translate() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [sourceLang, setSourceLang] = useState('EN')
  const [targetLang, setTargetLang] = useState('FR')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const swapLanguages = () => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setInput(result ?? '')
    setResult(input || null)
  }

  const handleTranslate = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('http://localhost:8000/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, source_lang: sourceLang, target_lang: targetLang }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      setResult(data.translated_text)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed')
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
        Traduction
      </h1>
      <p className="text-sm text-gray-500 mb-8">Traduisez entre l'anglais et le français instantanément.</p>

      {/* Language bar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-cream-200 shadow-sm">
          <span>{LANGUAGES[sourceLang].flag}</span>
          <span className="text-sm font-medium text-navy-900">{LANGUAGES[sourceLang].name}</span>
        </div>

        <button
          onClick={swapLanguages}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-cream-200 shadow-sm text-gray-400 hover:text-navy-900 hover:border-gold-400 transition-colors text-base"
          title="Inverser les langues"
        >
          ⇄
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-cream-200 shadow-sm">
          <span>{LANGUAGES[targetLang].flag}</span>
          <span className="text-sm font-medium text-navy-900">{LANGUAGES[targetLang].name}</span>
        </div>
      </div>

      {/* Side-by-side panels */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-xl shadow-sm border border-cream-200 p-4 flex flex-col">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            {LANGUAGES[sourceLang].name}
          </p>
          <textarea
            className="flex-1 text-sm text-gray-800 resize-none focus:outline-none bg-transparent placeholder-gray-300 min-h-36"
            rows={6}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Saisissez le texte à traduire..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTranslate() }
            }}
          />
        </div>

        <div className="bg-cream-50 rounded-xl shadow-sm border border-cream-200 p-4 flex flex-col">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            {LANGUAGES[targetLang].name}
          </p>
          <div className="flex-1 text-sm text-navy-900 min-h-36">
            {loading ? (
              <span className="text-gray-400 italic">Traduction en cours…</span>
            ) : result !== null ? (
              <span>{result}</span>
            ) : (
              <span className="text-gray-300">La traduction apparaîtra ici</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleTranslate}
          disabled={loading || !input.trim()}
          className="px-5 py-2.5 bg-navy-900 text-white text-sm font-medium rounded-lg hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Traduction en cours…' : 'Traduire'}
        </button>
        <span className="text-xs text-gray-400">Maj+Entrée pour un saut de ligne</span>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2">{error}</p>
      )}
    </div>
  )
}
