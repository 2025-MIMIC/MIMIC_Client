import React from 'react'
import Chat from '../src/pages/Chat'
import './App.css'
import { LogIn } from 'lucide-react'
import Login from './pages/Login'

function App() {
  return (
    <div className="App">
      <Chat />
      <LogIn/>
    </div>
  )
}

export default App