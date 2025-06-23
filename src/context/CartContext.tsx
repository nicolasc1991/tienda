import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react'
import { Product } from '../types/Product'

export interface CartItem {
  product: Product
  talle: string
  cantidad: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product, talle: string, cantidad?: number) => void
  clearCart: () => void
  removeFromCart: (productId: string, talle: string) => void
  updateQuantity: (productId: string, talle: string, cantidad: number) => void
}

const STORAGE_KEY = 'miTienda_carrito'

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Leer carrito del localStorage al iniciar
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem(STORAGE_KEY)
      return storedCart ? JSON.parse(storedCart) : []
    }
    return []
  })

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    }
  }, [cart])

  const addToCart = (product: Product, talle: string, cantidad: number = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.talle === talle
      )

      if (existingIndex !== -1) {
        const updatedCart = [...prevCart]
        updatedCart[existingIndex].cantidad += cantidad
        return updatedCart
      }

      return [...prevCart, { product, talle, cantidad }]
    })
  }

  const removeFromCart = (productId: string, talle: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(item.product.id.toString() === productId && item.talle === talle)
      )
    )
  }

  const updateQuantity = (
    productId: string,
    talle: string,
    cantidad: number
  ) => {
    if (cantidad < 1) return // evitar cantidades inválidas

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id.toString() === productId && item.talle === talle
          ? { ...item, cantidad }
          : item
      )
    )
  }

  const clearCart = () => setCart([])

  return (
    <CartContext.Provider
      value={{ cart, addToCart, clearCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de un <CartProvider>')
  }
  return context
}
