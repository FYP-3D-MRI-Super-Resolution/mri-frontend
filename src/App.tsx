import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Jobs from './pages/Jobs'
import Viewer from './pages/Viewer'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/viewer/:jobId" element={<Viewer />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
