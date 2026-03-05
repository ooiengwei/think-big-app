import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Assessment from './pages/Assessment'
import Results from './pages/Results'
import Report from './pages/Report'
import Methodology from './pages/Methodology'
import Terms from './pages/Terms'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/results" element={<Results />} />
        <Route path="/results/:assessmentId" element={<Results />} />
        <Route path="/report" element={<Report />} />
        <Route path="/report/:assessmentId" element={<Report />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/methodology" element={<Methodology />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Layout>
  )
}
