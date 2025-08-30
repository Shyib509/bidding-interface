import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AuctionView from './components/AuctionView'
import BidSuccess from './components/BidSuccess'
import NotFound from './components/NotFound'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Routes>
          <Route path="/auction/:auctionId" element={<AuctionView />} />
          <Route path="/success" element={<BidSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
