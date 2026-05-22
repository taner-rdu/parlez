import { useState } from 'react'

const SENTENCE = 'Le chat dort sur le canapé.'
const MOCK_FEEDBACK = 'Bon essai ! La traduction correcte est : « The cat is sleeping on the sofa. » Attention à l\'article — « le canapé » signifie « the sofa », pas « the couch ».'

export default function Sentences() {
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleSubmit = () => {
    setFeedback(MOCK_FEEDBACK)
  }

  return (
    <div>
      <h1
        className="text-3xl font-semibold text-navy-900 mb-1"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Phrases
      </h1>
      <p className="text-sm text-gray-500 mb-8">Traduisez la phrase ci-dessous en anglais.</p>

      {/* Sentence card */}
      <div className="bg-navy-900 rounded-xl px-6 py-5 mb-6 border-l-4 border-gold-500">
        <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-2">Traduisez cette phrase</p>
        <p
          className="text-2xl text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {SENTENCE}
        </p>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-600 mb-2">Votre traduction</label>
        <input
          className="w-full bg-white border border-cream-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-gold-400 shadow-sm placeholder-gray-300 transition-colors"
          placeholder="Saisissez votre traduction en anglais..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!input.trim()}
        className="px-5 py-2.5 bg-navy-900 text-white text-sm font-medium rounded-lg hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        Soumettre
      </button>

      {feedback !== null && (
        <div className="mt-6 bg-white rounded-xl border border-cream-200 shadow-sm px-5 py-4">
          <p className="text-xs font-semibold text-gold-500 uppercase tracking-wider mb-2">Commentaires</p>
          <p className="text-sm text-gray-700 leading-relaxed">{feedback}</p>
        </div>
      )}
    </div>
  )
}
