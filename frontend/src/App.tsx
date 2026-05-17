import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Translate from './pages/Translate'
import Vocabulary from './pages/Vocabulary'
import Conjugation from './pages/Conjugation'
import Sentences from './pages/Sentences'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="translate" element={<Translate />} />
          <Route path="vocabulary" element={<Vocabulary />} />
          <Route path="conjugation" element={<Conjugation />} />
          <Route path="sentences" element={<Sentences />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
