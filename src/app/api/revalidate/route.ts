import {revalidateTag} from 'next/cache'
import {type NextRequest, NextResponse} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  try {
    const {isValidSignature, body} = await parseBody<{_type?: string}>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    )

    if (!isValidSignature) {
      return new Response('Firma inválida', {status: 401})
    }
    if (!body?._type) {
      return new Response('Falta _type en el cuerpo', {status: 400})
    }

    // Revalida solo la sección que cambió.
    revalidateTag(body._type === 'contacto' ? 'contacto' : 'menu')

    return NextResponse.json({revalidated: true, type: body._type, now: Date.now()})
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return new Response(message, {status: 500})
  }
}
