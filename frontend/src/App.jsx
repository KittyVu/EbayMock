import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Chat from './components/Chat'
function App() {
  return (
      <>
        <Header />
        <Outlet />
        <Footer />
        
      </>
  )
}

export default App
