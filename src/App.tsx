import { Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { ScrollToTop } from './components/ScrollToTop'
import { HomePage } from './pages/HomePage'
import { CityPage } from './pages/CityPage'
import { DiscoverPage } from './pages/DiscoverPage'
import { EventPage } from './pages/EventPage'
import { EventsPage } from './pages/EventsPage'
import { ExperiencesPage } from './pages/ExperiencesPage'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ville/:cityId" element={<CityPage />} />
          <Route path="/decouvrir" element={<DiscoverPage />} />
          <Route path="/evenement/:eventId" element={<EventPage />} />
          <Route path="/evenements" element={<EventsPage />} />
          <Route path="/experiences" element={<ExperiencesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
