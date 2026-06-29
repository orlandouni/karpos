import {groq} from 'next-sanity'

export const menuQuery = groq`*[_type == "menuSemanal"][0]{
  semana,
  dias[]{ nombre, platillo, descripcion, precio }
}`

export const contactoQuery = groq`*[_type == "contacto"][0]{
  whatsapp, telefono, direccion, horario, facebook, instagram
}`

export type Dia = {
  nombre?: string
  platillo?: string
  descripcion?: string
  precio?: number
}

export type Menu = {
  semana?: string
  dias?: Dia[]
}

export type Contacto = {
  whatsapp?: string
  telefono?: string
  direccion?: string
  horario?: string
  facebook?: string
  instagram?: string
}
