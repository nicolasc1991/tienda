// src/services/sheetsApi.ts

import { Product } from '../types/Product'
const SHEET_ID = '1use3LvMRS_znh9lxYtVCH59lFh1FYxPo2PSonaM-cN0'

// 🛒 Productos desde hoja pública
export async function fetchProducts(): Promise<Product[]> {
  const GID = '0' // GID de la hoja "Productos"
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${GID}`

  const res = await fetch(url)
  const text = await res.text()
  const json = JSON.parse(text.substring(47, text.length - 2))

  const rows = json.table.rows.map((row: any) =>
    row.c.map((cell: any) => (cell ? cell.v : ''))
  )

  return rows.map(
    ([
      id = '',
      nombre = '',
      precio = '0',
      categoria = '',
      club = '',
      talles = '',
      imagenes = ''
    ]) => ({
      id,
      nombre,
      precio: Number(precio),
      categoria,
      club,
      talles: talles.split(',').map((t) => t.trim()),
      imagenes: imagenes.split(',').map((url) => url.trim())
    })
  )
}

// 📁 Categorías desde hoja pública
export async function fetchCategorias(): Promise<string[]> {
  const GID = '279660350' // GID de la hoja "Categorias" (sacalo desde la URL al cambiar de hoja)
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${GID}`

  const res = await fetch(url)
  const text = await res.text()
  const json = JSON.parse(text.substring(47, text.length - 2))

  return json.table.rows
    .map((row: any) => row.c[0]?.v || '')
    .filter(Boolean)
    .map((c: string) => c.trim())
}
