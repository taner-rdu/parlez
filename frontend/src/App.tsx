import { useState, useEffect } from 'react'

function App() {
  const [isApiUp, setIsApiUp] = useState<boolean | null>(null)
  const [text, setText] = useState('')
  const [translation, setTranslation] = useState('')

  useEffect(() => {
    fetch('http://localhost:8000/health')
      .then(response => setIsApiUp(response.ok))
      .catch(() => setIsApiUp(false))
  }, [])

  const handleTranslate = () => {
    fetch('http://localhost:8000/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text,
        source_lang: 'EN',
        target_lang: 'FR'
      })
    })
      .then(response => response.json())
      .then(data => setTranslation(data.translated_text))
      .catch(() => setTranslation('Error translating'))
  }

  return (
    <div>
      <h1>Parlez</h1>
      <p>
        API Status:{' '}
        <span style={{ color: isApiUp ? 'green' : 'red' }}>
          {isApiUp === null ? 'Checking...' : isApiUp ? 'Online' : 'Offline'}
        </span>
      </p>

      <div>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter English text"
        />
        <button onClick={handleTranslate}>Translate to French</button>
      </div>

      {translation && <p>Translation: {translation}</p>}
    </div>
  )
}

export default App
