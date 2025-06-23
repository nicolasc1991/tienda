import React, { useState } from 'react'
import { useCart } from '../context/CartContext'

export default function Carrito() {
  const { cart, clearCart, updateQuantity, removeFromCart } = useCart()

  const [showModal, setShowModal] = useState(false)

  const [formData, setFormData] = useState({
    localidad: '',
    codigoPostal: '',
    direccion: '',
    barrio: '',
    entreCalles: '',
    pisoDepto: '',
    nombreApellido: '',
    telefonoPrincipal: '',
    telefonoAlternativo: '',
    observacion: ''
  })

  const productCountMap: Record<
    string,
    { product: (typeof cart)[number]['product']; count: number; talle: string }
  > = {}

  cart.forEach((item) => {
    const key = `${item.product.id}-${item.talle}`
    if (productCountMap[key]) {
      productCountMap[key].count += item.cantidad
    } else {
      productCountMap[key] = {
        product: item.product,
        count: item.cantidad,
        talle: item.talle
      }
    }
  })

  const productosConCantidad = Object.values(productCountMap)

  const total = productosConCantidad.reduce(
    (sum, { product, count }) => sum + product.precio * count,
    0
  )

  const handleCantidadChange = (
    productId: string,
    talle: string,
    newCantidad: number
  ) => {
    if (newCantidad < 1) return
    updateQuantity(productId, talle, newCantidad)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const isFormValid = () => {
    const {
      localidad,
      codigoPostal,
      direccion,
      entreCalles,
      nombreApellido,
      telefonoPrincipal
    } = formData

    return (
      localidad.trim() &&
      codigoPostal.trim() &&
      direccion.trim() &&
      entreCalles.trim() &&
      nombreApellido.trim() &&
      telefonoPrincipal.trim()
    )
  }

  const handleEnviarPedido = () => {
    if (!isFormValid()) {
      alert('Por favor, completá todos los campos requeridos.')
      return
    }

    const whatsappNumber = '5491159324610'
    const pedidoTexto = productosConCantidad
      .map(
        ({ product, count, talle }) =>
          `${count} x ${product.nombre} (Talle: ${talle}) - $${(
            product.precio * count
          ).toLocaleString('es-AR')}`
      )
      .join('\n')

    const datosEnvioTexto = `
DATOS PARA ENVÍOS
Localidad: ${formData.localidad}
Código Postal: ${formData.codigoPostal}
Dirección: ${formData.direccion}
Barrio: ${formData.barrio}
Entre calles: ${formData.entreCalles}
Piso y Depto: ${formData.pisoDepto}
Nombre y Apellido: ${formData.nombreApellido}
Teléfono Principal: ${formData.telefonoPrincipal}
Teléfono Alternativo: ${formData.telefonoAlternativo}
Observación: ${formData.observacion || 'N/A'}
    `

    const mensajeCompleto = `Hola! Quiero hacer el pedido:\n${pedidoTexto}\n\n${datosEnvioTexto}\n\nTotal: $${total.toLocaleString(
      'es-AR'
    )}`

    const urlWhatsapp = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      mensajeCompleto
    )}`

    window.open(urlWhatsapp, '_blank')
    clearCart()
    setShowModal(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Carrito</h1>

      {productosConCantidad.length === 0 ? (
        <p className="text-center text-gray-600">El carrito está vacío.</p>
      ) : (
        <>
          {/* Vista tipo tabla para escritorio */}
          <table className="w-full border-collapse mb-6 hidden md:table">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Imagen</th>
                <th className="text-left py-2">Producto</th>
                <th className="text-left py-2">Talle</th>
                <th className="text-right py-2">Cantidad</th>
                <th className="text-right py-2">Precio Unitario</th>
                <th className="text-right py-2">Subtotal</th>
                <th className="text-center py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosConCantidad.map(({ product, count, talle }) => {
                const precio = product.precio ?? 0
                return (
                  <tr key={`${product.id}-${talle}`} className="border-b">
                    <td className="py-2">
                      <img
                        src={product.imagenes[0]}
                        alt={product.nombre}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="py-2">{product.nombre}</td>
                    <td className="py-2">{talle}</td>
                    <td className="py-2 text-right">
                      <input
                        type="number"
                        min={1}
                        value={count}
                        onChange={(e) =>
                          handleCantidadChange(
                            product.id.toString(),
                            talle,
                            Number(e.target.value)
                          )
                        }
                        className="w-16 border rounded px-2 py-1 text-right"
                      />
                    </td>
                    <td className="py-2 text-right">
                      ${precio.toLocaleString('es-AR')}
                    </td>
                    <td className="py-2 text-right">
                      ${(precio * count).toLocaleString('es-AR')}
                    </td>
                    <td className="py-2 text-center">
                      <button
                        onClick={() =>
                          removeFromCart(product.id.toString(), talle)
                        }
                        className="text-red-600 hover:text-red-800 font-bold"
                        title="Eliminar producto"
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Vista de tarjetas para móvil */}
          <div className="space-y-4 md:hidden mb-6">
            {productosConCantidad.map(({ product, count, talle }) => {
              const precio = product.precio ?? 0
              return (
                <div
                  key={`${product.id}-${talle}`}
                  className="border rounded p-4 shadow-sm flex flex-col gap-2"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.imagenes[0]}
                      alt={product.nombre}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">{product.nombre}</p>
                      <p className="text-sm text-gray-600">Talle: {talle}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <label className="text-sm">Cantidad:</label>
                    <input
                      type="number"
                      min={1}
                      value={count}
                      onChange={(e) =>
                        handleCantidadChange(
                          product.id.toString(),
                          talle,
                          Number(e.target.value)
                        )
                      }
                      className="w-16 border rounded px-2 py-1 text-right"
                    />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Precio:</span>
                    <span>${precio.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span>Subtotal:</span>
                    <span>${(precio * count).toLocaleString('es-AR')}</span>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        removeFromCart(product.id.toString(), talle)
                      }
                      className="text-red-600 hover:text-red-800 font-bold"
                      title="Eliminar producto"
                    >
                      &times; Quitar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Total y botones */}
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center mb-6">
            <div className="text-lg font-bold">
              Total: ${total.toLocaleString('es-AR')}
            </div>
            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Vaciar carrito
              </button>

              <button
                onClick={() => setShowModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Confirmar pedido por WhatsApp
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal de envío */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">DATOS PARA ENVÍOS</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleEnviarPedido()
              }}
              className="space-y-3"
            >
              {[
                { label: 'Localidad', name: 'localidad', required: true },
                {
                  label: 'Código Postal',
                  name: 'codigoPostal',
                  required: true
                },
                { label: 'Dirección', name: 'direccion', required: true },
                { label: 'Barrio', name: 'barrio' },
                { label: 'Entre calles', name: 'entreCalles', required: true },
                { label: 'Piso y Depto', name: 'pisoDepto' },
                {
                  label: 'Nombre y Apellido',
                  name: 'nombreApellido',
                  required: true
                },
                {
                  label: 'Teléfono Principal',
                  name: 'telefonoPrincipal',
                  required: true
                },
                { label: 'Teléfono Alternativo', name: 'telefonoAlternativo' }
              ].map(({ label, name, required }) => (
                <div key={name}>
                  <label className="block font-semibold mb-1" htmlFor={name}>
                    {label}:
                  </label>
                  <input
                    type="text"
                    id={name}
                    name={name}
                    required={required}
                    value={(formData as any)[name]}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              ))}

              <div>
                <label
                  className="block font-semibold mb-1"
                  htmlFor="observacion"
                >
                  Observación:
                </label>
                <textarea
                  id="observacion"
                  name="observacion"
                  value={formData.observacion}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
                  placeholder="Opcional"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid()}
                  className={`px-4 py-2 rounded text-white ${
                    isFormValid()
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Confirmar pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
