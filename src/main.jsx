import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Signup from './Signup.jsx'
import HomePage from './HomePage.jsx'
import Dashboard from './Dashboard.jsx'
import SignIn from './SignIn.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   {/* <Signup/> */}
  {/* <Dashboard/> */}
    {/* <SignIn/> */}
    {/* <HomePage/> */}
    {/* <LandingPage/> */}
    <App />
  </StrictMode>,
)
