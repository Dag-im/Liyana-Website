import { Navigate, Route, Routes } from 'react-router-dom'

import AppShell from '@/components/layout/AppShell'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />} path="/">
        <Route element={<HomePage />} index />
      </Route>
      <Route element={<Navigate replace to="/" />} path="/home" />
      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  )
}
