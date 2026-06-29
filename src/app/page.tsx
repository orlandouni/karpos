import Image from 'next/image'
import {client} from '@/sanity/client'
import {menuQuery, contactoQuery, type Menu, type Contacto} from '@/sanity/queries'

// Respaldo: revalida cada 5 min aunque no llegue el webhook.
export const revalidate = 300

async function getData() {
  const [menu, contacto] = await Promise.all([
    client.fetch<Menu>(menuQuery, {}, {next: {tags: ['menu']}}),
    client.fetch<Contacto>(contactoQuery, {}, {next: {tags: ['contacto']}}),
  ])
  return {menu, contacto}
}

export default async function Home() {
  const {menu, contacto} = await getData()
  const dias = menu?.dias ?? []

  const waNumero = contacto?.whatsapp ? `52${contacto.whatsapp.replace(/\D/g, '')}` : null
  const waLink = waNumero
    ? `https://wa.me/${waNumero}?text=${encodeURIComponent('¡Hola KARPOS! Me gustaría hacer un pedido 🌿')}`
    : null

  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
      {/* Encabezado */}
      <header className="text-center">
        <Image
          src="/logo.jpeg"
          alt="KARPOS · cocina casera saludable"
          width={180}
          height={180}
          priority
          className="mx-auto rounded-full"
        />
        <p className="mt-4 font-serif text-xl italic text-cocoa-soft">
          Hecha con amor, para tu bienestar
        </p>
      </header>

      {/* Menú */}
      <section className="mt-14">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-salvia-soft">Menú de la semana</p>
          {menu?.semana && (
            <p className="mt-2 font-serif text-2xl italic text-cocoa-soft">{menu.semana}</p>
          )}
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-arena/60" />
            <span className="text-arena">♥</span>
            <span className="h-px w-12 bg-arena/60" />
          </div>
        </div>

        {dias.length === 0 ? (
          <p className="mt-10 text-center text-cocoa-soft">
            Pronto publicaremos el menú de esta semana.
          </p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {dias.map((dia, i) => (
              <article
                key={i}
                className="rounded-xl border border-borde bg-crema-card p-5"
              >
                <div className="flex items-baseline justify-between border-b border-borde pb-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-salvia">
                    {dia.nombre}
                  </span>
                  {typeof dia.precio === 'number' && (
                    <span className="text-sm text-arena">${dia.precio}</span>
                  )}
                </div>
                <h3 className="mt-3 font-serif text-2xl text-cocoa">{dia.platillo}</h3>
                {dia.descripcion && (
                  <p className="mt-1 font-serif text-lg italic leading-snug text-cocoa-soft">
                    {dia.descripcion}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Contacto */}
      <section className="mt-16 rounded-2xl border border-borde bg-crema-card px-6 py-10 text-center">
        <h2 className="font-serif text-3xl text-cocoa">Haz tu pedido</h2>

        {contacto?.horario && (
          <p className="mt-2 text-cocoa-soft">{contacto.horario}</p>
        )}

        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-salvia px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
          >
            Pedir por WhatsApp
          </a>
        )}

        <div className="mt-8 space-y-1 text-cocoa-soft">
          {contacto?.telefono && <p>Tel. {contacto.telefono}</p>}
          {contacto?.direccion && <p>{contacto.direccion}</p>}
        </div>

        {(contacto?.facebook || contacto?.instagram) && (
          <div className="mt-6 flex items-center justify-center gap-5 text-sm text-arena">
            {contacto.facebook && (
              <a href={contacto.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-cocoa">
                Facebook
              </a>
            )}
            {contacto.instagram && (
              <a href={contacto.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-cocoa">
                Instagram
              </a>
            )}
          </div>
        )}
      </section>

      <footer className="mt-12 text-center text-xs uppercase tracking-[0.25em] text-salvia-soft">
        KARPOS · cocina casera saludable
      </footer>
    </main>
  )
}
