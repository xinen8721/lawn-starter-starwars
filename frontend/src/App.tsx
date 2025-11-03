import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { PreferencesProvider } from './contexts/PreferencesContext'
import SearchPage from './pages/SearchPage'
import PersonDetails from './pages/PersonDetails'
import MovieDetails from './pages/MovieDetails'
import Statistics from './pages/Statistics'

function App() {
  return (
    <HelmetProvider>
      <PreferencesProvider>
        <Router>
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/person/:id" element={<PersonDetails />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </Router>
      </PreferencesProvider>
    </HelmetProvider>
  )
}

export default App

