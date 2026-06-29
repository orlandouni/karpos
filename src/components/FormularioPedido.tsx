'use client'

import {useState} from 'react'
import type {Dia} from '@/sanity/queries'

const HORA_CIERRE = 12
const COSTO_DOMICILIO = 40

const ORDEN_DIAS: Record<string, number> = {
  Lunes: 1, Martes: 2, Miércoles: 3, Jueves: 4,
  Viernes: 5, Sábado: 6, Domingo: 0,
}

function diasDisponibles(dias: Dia[]): Dia[] {
  const ahora = new Date()
  const utc = ahora.getTime() + ahora.getTimezoneOffset() * 60000
  const mx = new Date(utc - 6 * 3600000)
  const diaSemanaHoy = mx.getDay()
  const horaHoy = mx.getHours()

  return dias.filter((dia) => {
    if (!dia.nombre) return false
    const diaSemana = ORDEN_DIAS[dia.nombre]
    if (diaSemana === undefined) return false
    let diff = diaSemana - diaSemanaHoy
    if (diff < 0) diff += 7
    if (diff === 0) diff = 7
    if (diff === 1 && horaHoy >= HORA_CIERRE) return false
    return true
  })
}

export default function FormularioPedido({
  dias,
  waNumero,
  descuentoSemanal,
}: {
  dias: Dia[]
  waNumero: string
  descuentoSemanal?: number
}) {
  const disponibles = diasDisponibles(dias)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [entrega, setEntrega] = useState<'domicilio' | 'recoger' | ''>('')
  const [direccion, setDireccion] = useState('')
  const [horarioEntrega, setHorarioEntrega] = useState('')
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set())
  const [enviado, setEnviado] = useState(false)

  function toggleDia(nombre: string) {
    setSeleccionados((prev) => {
      const next = new Set(prev)
      next.has(nombre) ? next.delete(nombre) : next.add(nombre)
      return next
    })
  }

  function seleccionarTodo() {
    if (seleccionados.size === disponibles.length) {
      setSeleccionados(new Set())
    } else {
      setSeleccionados(new Set(disponibles.map((d) => d.nombre ?? '')))
    }
  }

  const diasPedido = disponibles.filter((d) => seleccionados.has(d.nombre ?? ''))
  const todoSeleccionado = seleccionados.size === disponibles.length && disponibles.length > 0
  const totalNormal = diasPedido.reduce((sum, d) => sum + (d.precio ?? 0), 0)
  const esPaqueteSemanal = todoSeleccionado && !!descuentoSemanal && descuentoSemanal > 0
  const totalConDescuento = esPaqueteSemanal
    ? Math.round(totalNormal * (1 - descuentoSemanal / 100))
    : totalNormal
  const ahorras = totalNormal - totalConDescuento
  const costoEnvio = entrega === 'domicilio' ? COSTO_DOMICILIO : 0
  const totalFinal = totalConDescuento + costoEnvio

  const formValido =
    nombre.trim() &&
    entrega !== '' &&
    horarioEntrega.trim() &&
    (entrega === 'recoger' || direccion.trim()) &&
    diasPedido.length > 0

  function handlePedir() {
    if (!formValido) return

    const lineasPlatillos = diasPedido
      .map((d) => `  - ${d.nombre}: ${d.platillo}${d.precio ? ` ($${d.precio})` : ''}`)
      .join('\n')

    const mensaje = [
      `Hola KARPOS! Quiero hacer un pedido:`,
      ``,
      `Nombre: ${nombre.trim()}`,
      telefono.trim() ? `Tel: ${telefono.trim()}` : '',
      `Entrega: ${entrega === 'domicilio' ? 'A domicilio' : 'Paso a recoger'}`,
      entrega === 'domicilio' ? `Direccion: ${direccion.trim()}` : '',
      `Horario: ${horarioEntrega.trim()}`,
      ``,
      esPaqueteSemanal ? `Paquete semanal (${descuentoSemanal}% de descuento):` : `Dias pedidos:`,
      lineasPlatillos,
      ``,
      esPaqueteSemanal && ahorras > 0 ? `Subtotal: $${totalNormal} - Descuento: $${ahorras} = $${totalConDescuento}` : '',
      entrega === 'domicilio' ? `Envio: $${COSTO_DOMICILIO}` : '',
      `Total: $${totalFinal}`,
      ``,
      `Pago en efectivo. Gracias!`,
    ]
      .filter((l) => l !== null && l !== undefined && l !== '')
      .join('\n')

    const url = `https://wa.me/${waNumero}?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank')
    setEnviado(true)
  }

  function resetear() {
    setEnviado(false)
    setSeleccionados(new Set())
    setNombre('')
    setTelefono('')
    setEntrega('')
    setDireccion('')
    setHorarioEntrega('')
  }

  if (disponibles.length === 0) {
    return (
      <section className="mt-10 rounded-2xl border border-borde bg-crema-card px-6 py-8 text-center">
        <h2 className="font-serif text-3xl text-cocoa">Hacer un pedido</h2>
        <p className="mt-3 text-cocoa-soft">
          Los pedidos para esta semana ya están cerrados.<br />
          Pronto publicamos el menu de la siguiente semana!
        </p>
      </section>
    )
  }

  return (
    <section className="mt-10 rounded-2xl border border-borde bg-crema-card px-6 py-10">
      <h2 className="font-serif text-3xl text-cocoa text-center">Hacer un pedido</h2>
      <p className="mt-1 text-center text-sm text-cocoa-soft">
        Elige uno o varios dias · pedidos con un dia de anticipacion antes de las 12pm
      </p>

      {/* Banner descuento */}
      {descuentoSemanal && descuentoSemanal > 0 && (
        <div className="mt-5 rounded-xl border border-salvia/40 bg-salvia/10 px-4 py-3 text-center">
          <p className="text-sm text-cocoa">
            Pide <span className="font-semibold">toda la semana</span> y obtén{' '}
            <span className="font-semibold text-salvia">{descuentoSemanal}% de descuento</span>
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2">

        {/* Nombre */}
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest text-salvia">
            Tu nombre <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="rounded-lg border border-borde bg-crema px-4 py-3 text-cocoa placeholder:text-cocoa-soft/50 focus:outline-none focus:ring-1 focus:ring-arena"
          />
        </div>

        {/* Teléfono */}
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest text-salvia">
            Telefono <span className="normal-case text-cocoa-soft">(opcional)</span>
          </label>
          <input
            type="tel"
            placeholder="Tu numero"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="rounded-lg border border-borde bg-crema px-4 py-3 text-cocoa placeholder:text-cocoa-soft/50 focus:outline-none focus:ring-1 focus:ring-arena"
          />
        </div>

        {/* Tipo de entrega */}
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label className="text-xs uppercase tracking-widest text-salvia">
            Tipo de entrega <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setEntrega('domicilio')}
              className={`rounded-xl border px-4 py-4 text-left transition-all ${
                entrega === 'domicilio'
                  ? 'border-arena bg-arena/10'
                  : 'border-borde bg-crema hover:border-arena/60'
              }`}
            >
              <p className="font-serif text-lg text-cocoa">A domicilio</p>
              <p className="text-xs text-arena mt-1">+ ${COSTO_DOMICILIO} de envio</p>
            </button>
            <button
              onClick={() => setEntrega('recoger')}
              className={`rounded-xl border px-4 py-4 text-left transition-all ${
                entrega === 'recoger'
                  ? 'border-arena bg-arena/10'
                  : 'border-borde bg-crema hover:border-arena/60'
              }`}
            >
              <p className="font-serif text-lg text-cocoa">Paso a recoger</p>
              <p className="text-xs text-cocoa-soft mt-1">Sin costo de envio</p>
            </button>
          </div>
        </div>

        {/* Dirección — solo si es domicilio */}
        {entrega === 'domicilio' && (
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-xs uppercase tracking-widest text-salvia">
              Direccion de entrega <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Calle, numero, colonia"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="rounded-lg border border-borde bg-crema px-4 py-3 text-cocoa placeholder:text-cocoa-soft/50 focus:outline-none focus:ring-1 focus:ring-arena"
            />
          </div>
        )}

        {/* Horario */}
        {entrega !== '' && (
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-xs uppercase tracking-widest text-salvia">
              {entrega === 'domicilio' ? 'Horario de entrega' : 'Horario en que pasas'}{' '}
              <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: entre 12pm y 1pm"
              value={horarioEntrega}
              onChange={(e) => setHorarioEntrega(e.target.value)}
              className="rounded-lg border border-borde bg-crema px-4 py-3 text-cocoa placeholder:text-cocoa-soft/50 focus:outline-none focus:ring-1 focus:ring-arena"
            />
          </div>
        )}

        {/* Selector de días */}
        <div className="flex flex-col gap-3 sm:col-span-2">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase tracking-widest text-salvia">
              Que dias? <span className="text-red-400">*</span>
            </label>
            <button
              onClick={seleccionarTodo}
              className="text-xs text-arena underline underline-offset-2 hover:text-cocoa transition-colors"
            >
              {todoSeleccionado ? 'Quitar todo' : 'Seleccionar toda la semana'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {disponibles.map((dia) => {
              const activo = seleccionados.has(dia.nombre ?? '')
              return (
                <button
                  key={dia.nombre}
                  onClick={() => toggleDia(dia.nombre ?? '')}
                  className={`rounded-xl border px-4 py-3 text-left transition-all ${
                    activo
                      ? 'border-arena bg-arena/10'
                      : 'border-borde bg-crema hover:border-arena/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-xs uppercase tracking-widest text-salvia">{dia.nombre}</p>
                    <span className={`mt-0.5 h-4 w-4 rounded-full border-2 flex-shrink-0 transition-all ${
                      activo ? 'border-arena bg-arena' : 'border-borde'
                    }`} />
                  </div>
                  <p className="mt-1 font-serif text-base leading-tight text-cocoa">{dia.platillo}</p>
                  {dia.precio && <p className="mt-1 text-xs text-arena">${dia.precio}</p>}
                </button>
              )
            })}
          </div>
        </div>

        {/* Resumen */}
        {diasPedido.length > 0 && (
          <div className="sm:col-span-2 rounded-xl border border-arena/30 bg-arena/5 px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-widest text-salvia">Resumen</p>
              {esPaqueteSemanal && (
                <span className="text-xs rounded-full bg-salvia/20 text-salvia px-3 py-0.5 font-semibold">
                  Paquete semanal
                </span>
              )}
            </div>

            <div className="space-y-1">
              {diasPedido.map((d) => (
                <div key={d.nombre} className="flex justify-between text-sm">
                  <span className="text-cocoa-soft">
                    {d.nombre} — <span className="text-cocoa font-serif">{d.platillo}</span>
                  </span>
                  {d.precio && <span className="text-arena">${d.precio}</span>}
                </div>
              ))}
            </div>

            {totalNormal > 0 && (
              <div className="mt-3 border-t border-arena/20 pt-2 space-y-1">
                {esPaqueteSemanal && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-cocoa-soft">Subtotal</span>
                      <span className="text-cocoa-soft line-through">${totalNormal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-salvia">Descuento {descuentoSemanal}%</span>
                      <span className="text-salvia">- ${ahorras}</span>
                    </div>
                  </>
                )}
                {entrega === 'domicilio' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-cocoa-soft">Envio a domicilio</span>
                    <span className="text-cocoa-soft">+ ${COSTO_DOMICILIO}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-semibold pt-1 border-t border-arena/20">
                  <span className="text-cocoa">Total</span>
                  <span className="text-arena">${totalFinal}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Botón */}
      <div className="mt-8 text-center">
        {enviado ? (
          <div className="space-y-2">
            <p className="text-cocoa">
              Listo! Se abrio WhatsApp con tu pedido. Recuerda enviarlo para confirmarlo.
            </p>
            <button onClick={resetear} className="text-sm text-arena underline">
              Hacer otro pedido
            </button>
          </div>
        ) : (
          <button
            onClick={handlePedir}
            disabled={!formValido}
            className="inline-flex items-center gap-2 rounded-full bg-salvia px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {esPaqueteSemanal
              ? 'Pedir paquete semanal por WhatsApp'
              : diasPedido.length > 1
              ? `Pedir ${diasPedido.length} dias por WhatsApp`
              : 'Pedir por WhatsApp'}
          </button>
        )}
      </div>
    </section>
  )
}