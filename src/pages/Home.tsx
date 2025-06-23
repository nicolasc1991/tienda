import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-blue-700 mb-4">
        Bienvenido a Mi Tienda
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
        Ropa de clubes, camisetas exclusivas y mucho más. Elegí tu estilo, vestí
        tu pasión.
      </p>
      <Link
        to="/productos"
        className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition"
      >
        Ver Productos
      </Link>
    </div>
  )
}
