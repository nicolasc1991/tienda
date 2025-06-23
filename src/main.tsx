import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import App from './App'
import Home from './pages/Home'
import Productos from './pages/Products'
import Carrito from './pages/Checkout'

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CartProvider>
      {' '}
      {/* Aquí envuelvo todo para que el contexto esté disponible */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="productos" element={<Productos />} />
            <Route path="carrito" element={<Carrito />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </React.StrictMode>
)
