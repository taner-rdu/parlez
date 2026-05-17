import { useState } from 'react'

const SENTENCE = 'Le chat dort sur le canapé.'
const MOCK_FEEDBACK = 'Good try! The correct translation is: "The cat is sleeping on the sofa." Watch the article — "le canapé" is "the sofa", not "the couch".'

export default function Sentences() {
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleSubmit = () => {
    setFeedback(MOCK_FEEDBACK)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Practice Sentences</h1>

      <div className="border border-gray-200 rounded-lg px-4 py-4 mb-6 bg-gray-50">
        <p className="text-xs text-gray-400 mb-1">Translate this sentence</p>
        <p className="text-lg text-gray-800 font-medium">{SENTENCE}</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Your translation</label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-gray-400"
          placeholder="Type your English translation..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700"
      >
        Submit
      </button>

      {feedback !== null && (
        <div className="mt-6 border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
          <p className="text-xs text-gray-400 mb-1">Feedback</p>
          <p className="text-sm text-gray-700">{feedback}</p>
        </div>
      )}
    </div>
  )
}
