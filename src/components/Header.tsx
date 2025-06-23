import { NavLink } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Header() {
  const { cart } = useCart()

  // Contar cantidad total sumando las cantidades de cada item (producto + talle)
  const totalCantidad = cart.reduce((sum, item) => sum + item.cantidad, 0)

  return (
    <header className="bg-white shadow-md px-4 py-3 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <NavLink to="/" className="text-2xl font-bold text-blue-700">
          🛍️ Mi Tienda
        </NavLink>

        <div className="flex items-center gap-8">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? 'text-blue-700 font-semibold underline'
                : 'text-gray-600 hover:text-blue-700'
            }
          >
            Inicio
          </NavLink>

          <NavLink
            to="/productos"
            className={({ isActive }) =>
              isActive
                ? 'text-blue-700 font-semibold underline'
                : 'text-gray-600 hover:text-blue-700'
            }
          >
            Productos
          </NavLink>

          <NavLink
            to="/carrito"
            className={({ isActive }) =>
              isActive
                ? 'relative text-blue-700 font-semibold underline'
                : 'relative text-gray-600 hover:text-blue-700'
            }
          >
            <ShoppingCart className="w-6 h-6 inline-block align-middle" />
            {totalCantidad > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalCantidad}
              </span>
            )}
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
