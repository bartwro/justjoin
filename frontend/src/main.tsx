import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Skills from './Skills.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import JobsBySkill from './JobsBySkill.tsx'
import Navbar from './Navbar.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Skills />} />
        <Route path="/jobs/:skillName" element={<JobsBySkill />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
