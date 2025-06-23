import Header from './components/Header'
import { Outlet } from 'react-router-dom'
import './App.css'

export default function App() {
  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto p-6">
        <Outlet />
      </main>

      <footer className="bg-gray-100 text-center p-4 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Mi Tienda. Todos los derechos
        reservados.
      </footer>
    </>
  )
}
