// src/types/CartItem.ts
import { Product } from './Product'

export interface CartItem {
  product: Product
  cantidad: number
  talle: string
}
