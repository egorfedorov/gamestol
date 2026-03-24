import { Routes, Route } from 'react-router-dom'
import { I18nProvider } from './i18n'
import Layout from './components/Layout'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import GamePage from './pages/GamePage'
import Contribute from './pages/Contribute'

export default function App() {
  return (
    <I18nProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/game/:id" element={<GamePage />} />
          <Route path="/contribute" element={<Contribute />} />
        </Route>
      </Routes>
    </I18nProvider>
  )
}
