import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Website from './pages/Website.jsx'
import Ecommerce from './pages/Ecommerce.jsx'
import Social from './pages/Social.jsx'
import Chat from './pages/Chat.jsx'
import Payment from './pages/Payment.jsx'
import Wallet from './pages/Wallet.jsx'
import ContentStudio from './pages/ContentStudio.jsx'
import Settings from './pages/Settings.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/website" element={<Website />} />
        <Route path="/ecommerce" element={<Ecommerce />} />
        <Route path="/social" element={<Social />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/studio" element={<ContentStudio />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
