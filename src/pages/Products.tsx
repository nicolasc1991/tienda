// src/pages/Productos.tsx
import { useEffect, useState } from 'react'
import { fetchProducts, fetchCategorias } from '../services/sheetsApi'
import { Product } from '../types/Product'
import ProductCard from '../components/ProductCard'

export default function Productos() {
  const [productos, setProductos] = useState<Product[]>([])
  const [categorias, setCategorias] = useState<string[]>([])
  const [filtroCategoria, setFiltroCategoria] = useState<string>('')
  const [filtroClub, setFiltroClub] = useState<string>('')

  // Para llenar clubs disponibles (únicos) de los productos
  const [clubsDisponibles, setClubsDisponibles] = useState<string[]>([])

  useEffect(() => {
    async function cargarDatos() {
      const prods = await fetchProducts()
      setProductos(prods)
      setCategorias(await fetchCategorias())

      // Sacamos clubes únicos
      const clubs = Array.from(new Set(prods.map((p) => p.club))).filter(
        Boolean
      )
      setClubsDisponibles(clubs)
    }
    cargarDatos()
  }, [])

  // Filtrar productos
  const productosFiltrados = productos.filter((p) => {
    const matchCategoria = filtroCategoria
      ? p.categoria === filtroCategoria
      : true
    const matchClub = filtroClub ? p.club === filtroClub : true
    return matchCategoria && matchClub
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Productos</h1>

      {/* FILTROS */}
      <div className="flex flex-col md:flex-row md:justify-center gap-4 mb-8">
        <select
          className="border rounded px-3 py-2 w-full md:w-48"
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="">Todas las Categorías</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-2 w-full md:w-48"
          value={filtroClub}
          onChange={(e) => setFiltroClub(e.target.value)}
        >
          <option value="">Todos los Clubes</option>
          {clubsDisponibles.map((club) => (
            <option key={club} value={club}>
              {club}
            </option>
          ))}
        </select>
      </div>

      {/* GRILLA DE PRODUCTOS */}
      {productosFiltrados.length === 0 ? (
        <p className="text-center text-gray-600">
          No hay productos para mostrar.
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {productosFiltrados.map((producto) => (
            <ProductCard key={producto.id} product={producto} />
          ))}
        </div>
      )}
    </div>
  )
}
