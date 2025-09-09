import React from 'react'
import Chat from '../src/pages/Chat'
import './App.css'
import { LogIn } from 'lucide-react'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  return (
    <div className="App">
      <Chat />
      <Login/>
      <Signup/>
    </div>
  )
}

export default App