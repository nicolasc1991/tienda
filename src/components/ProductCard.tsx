import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product } from '../types/Product'
import { useCart } from '../context/CartContext'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const imagenes = product.imagenes.length
    ? product.imagenes
    : ['https://via.placeholder.com/300x300?text=Sin+imagen']

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedTalle, setSelectedTalle] = useState('')
  const [showTalleError, setShowTalleError] = useState(false)
  const [flyImage, setFlyImage] = useState<{ x: number; y: number } | null>(
    null
  )

  const imgRef = useRef<HTMLImageElement>(null)

  const abrirModal = (index: number) => {
    setCurrentImageIndex(index)
    setIsModalOpen(true)
  }

  const cerrarModal = () => setIsModalOpen(false)

  const siguienteImagen = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imagenes.length)
  }

  const anteriorImagen = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + imagenes.length) % imagenes.length
    )
  }

  const handleAddToCart = () => {
    if (!selectedTalle) {
      setShowTalleError(true)
      return
    }

    const img = imgRef.current
    const cartIcon = (window as any).cartIconRef?.current

    if (img && cartIcon) {
      const imgRect = img.getBoundingClientRect()
      const cartRect = cartIcon.getBoundingClientRect()
      const deltaX = cartRect.left - imgRect.left
      const deltaY = cartRect.top - imgRect.top
      setFlyImage({ x: deltaX, y: deltaY })

      setTimeout(() => {
        addToCart(product, selectedTalle)

        setFlyImage(null)
      }, 600)
    } else {
      addToCart(product, selectedTalle)
    }
  }

  return (
    <>
      <div className="border rounded-lg shadow-sm hover:shadow-md transition p-4 flex flex-col relative overflow-hidden">
        <img
          ref={imgRef}
          src={imagenes[0]}
          alt={product.nombre}
          className="w-full h-48 object-cover rounded-md mb-4 cursor-pointer"
          onClick={() => abrirModal(0)}
        />

        <h3 className="text-lg font-semibold mb-1">{product.nombre}</h3>
        <p className="text-sm text-gray-600 mb-2">Club: {product.club}</p>

        <p className="text-xl font-bold mb-2">
          ${product.precio.toLocaleString('es-AR')}
        </p>

        {/* Selector de talles visual */}
        <p className="text-sm font-medium mb-2">Talle:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {product.talles.map((talle) => (
            <button
              key={talle}
              onClick={() => {
                setSelectedTalle(talle)
                setShowTalleError(false)
              }}
              className={`px-3 py-1 rounded-full border text-sm transition ${
                selectedTalle === talle
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {talle}
            </button>
          ))}
        </div>

        {showTalleError && (
          <p className="text-red-600 text-sm mb-2">Seleccioná un talle</p>
        )}

        <button
          onClick={handleAddToCart}
          className="mt-auto bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Agregar al carrito
        </button>

        {flyImage && (
          <motion.img
            src={imagenes[0]}
            alt=""
            className="w-20 h-20 object-cover rounded-full absolute"
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{
              x: flyImage.x,
              y: flyImage.y,
              scale: 0.2,
              opacity: 0.2
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{ top: 0, left: 0, pointerEvents: 'none', zIndex: 50 }}
          />
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrarModal}
          >
            <motion.div
              className="relative bg-white rounded-lg max-w-lg w-full p-4"
              onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                e.stopPropagation()
              }
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="relative w-full h-96 overflow-hidden flex items-center justify-center">
                <motion.img
                  src={imagenes[currentImageIndex]}
                  alt={`${product.nombre} imagen ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain rounded transition-opacity duration-300"
                  key={imagenes[currentImageIndex]}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  loading="lazy"
                />
              </div>
              <button
                onClick={anteriorImagen}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-300 hover:bg-gray-400 rounded-full p-2"
              >
                &#8592;
              </button>
              <button
                onClick={siguienteImagen}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-300 hover:bg-gray-400 rounded-full p-2"
              >
                &#8594;
              </button>
              <button
                onClick={cerrarModal}
                className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 text-2xl font-bold"
              >
                &times;
              </button>
              <p className="text-center mt-2 text-sm text-gray-600">
                Imagen {currentImageIndex + 1} de {imagenes.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
