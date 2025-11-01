import React from 'react'
import { LogIn } from 'lucide-react'
import Login from '../src/pages/Login'
import Chat from '../src/pages/Chat'
import Signup from './pages/Signup'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Login />}></Route>
          <Route path='/signup' element={<Signup />}></Route>
          <Route path='/login' element={<Login />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
