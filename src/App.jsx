import { useState } from 'react'
import Header from './components/Header'

function App() {
  const [currentPage, setCurrentPage] = useState(0)

  return (
    <>
      <Header />
    </>
  )
}

export default App
