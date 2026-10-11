import { config as loadEnv } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const here = path.dirname(fileURLToPath(import.meta.url))
// apps/admin/src/seed → repo root is ../../../..
loadEnv({ path: path.resolve(here, '../../../../.env') })
loadEnv({ path: path.resolve(here, '../../.env') })
loadEnv({ path: path.resolve(here, '../../.env.local') })

/** Minimal Lexical doc for richText seed fields */
function lexicalParagraph(...paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        children: [
          {
            type: 'text',
            format: 0,
            text,
            mode: 'normal',
            style: '',
            detail: 0,
            version: 1,
          },
        ],
      })),
      direction: 'ltr' as const,
    },
  }
}

function packingItems(labels: string[]) {
  return labels.map((label) => ({ label }))
}

/** COMMON categories shared by both seasons (LISTS from maqueta) */
const COMMON_CATEGORIES = [
  {
    name: 'Documentación',
    season: 'ambas' as const,
    items: packingItems([
      'DNI / Pasaporte',
      'Reservas de hospedaje, traslados, etc.',
      'Seguro de viaje',
      'Licencia de conducir',
    ]),
  },
  {
    name: 'Cuidado personal',
    season: 'ambas' as const,
    items: packingItems([
      'Cepillo de dientes',
      'Pasta de dientes',
      'Shampoo',
      'Acondicionador',
      'Jabón',
      'Crema para peinar',
      'Peine o cepillo',
      'Desodorante',
      'Perfume',
      'Corta uñas',
      'Pinza de depilar',
      'Crema hidratante rostro',
      'Crema hidratante cuerpo',
      'Protector solar',
      'Maquillaje',
    ]),
  },
  {
    name: 'Electrónica',
    season: 'ambas' as const,
    items: packingItems([
      'Adaptador universal',
      'Cargador(es)',
      'Auriculares',
      'Cargador portátil',
    ]),
  },
  {
    name: 'Botiquín',
    season: 'ambas' as const,
    items: packingItems([
      'Medicamentos cotidianos',
      'Analgésicos',
      'Antihistamínicos',
      'Gasas y vendas',
      'Apósitos',
      'Antisépticos',
      'Toallitas húmedas',
      'Repelente de mosquitos',
    ]),
  },
  {
    name: 'Extras',
    season: 'ambas' as const,
    items: packingItems([
      'Bolsa para ropa sucia',
      'Recipiente para alimentos (tipo lonchera)',
      'Dinero en efectivo',
    ]),
  },
]

const SEASON_CATEGORIES = [
  {
    name: 'Ropa',
    season: 'verano' as const,
    items: packingItems([
      'Ropa interior',
      'Medias',
      'Traje de baño',
      'Remeras',
      'Pollera',
      'Short',
      'Jean',
      'Vestido',
      'Buzo',
      'Campera',
      'Pijama',
    ]),
  },
  {
    name: 'Calzado',
    season: 'verano' as const,
    items: packingItems(['Ojotas', 'Sandalias', 'Zapatillas']),
  },
  {
    name: 'Accesorios',
    season: 'verano' as const,
    items: packingItems([
      'Anteojos de sol',
      'Bolsa / mochila playera',
      'Gorra / sombrero',
      'Lona y/o pareo',
      'Botellita para agua',
      'Juego de mate',
      'Hilo y aguja',
      'Libro / cuaderno y birome',
    ]),
  },
  {
    name: 'Ropa',
    season: 'invierno' as const,
    items: packingItems([
      'Ropa interior',
      'Medias',
      'Remeras',
      'Polera',
      'Remera térmica',
      'Calza térmica',
      'Jean',
      'Jogging',
      'Buzo',
      'Suéter',
      'Campera de abrigo',
      'Pijama',
    ]),
  },
  {
    name: 'Calzado',
    season: 'invierno' as const,
    items: packingItems(['Botas / borcegos', 'Zapatillas']),
  },
  {
    name: 'Accesorios',
    season: 'invierno' as const,
    items: packingItems([
      'Anteojos de sol',
      'Bufanda / cuello',
      'Gorro y guantes',
      'Mochila / riñonera',
      'Botellita para agua',
      'Juego de mate',
      'Hilo y aguja',
      'Libro / cuaderno y birome',
    ]),
  },
]

async function seed() {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET is required (load root .env)')
  }
  if (!process.env.DATABASE_URI && !process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
    throw new Error('DATABASE_URI (or DATABASE_URL / POSTGRES_URL) is required')
  }

  // Dynamic import so dotenv runs before payload.config reads process.env
  const { getPayload } = await import('payload')
  const { default: config } = await import('../payload.config.js')

  const payload = await getPayload({ config })

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@pellegrinaviajes.local'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMeNow!123'

  const existingUsers = await payload.find({
    collection: 'users',
    where: { email: { equals: adminEmail } },
    limit: 1,
  })

  if (existingUsers.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: adminEmail,
        password: adminPassword,
      },
    })
    payload.logger.info(`Created admin user: ${adminEmail}`)
  } else {
    payload.logger.info(`Admin user already exists: ${adminEmail}`)
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'Pellegrina Viajes',
      whatsappNumber: '54XXXXXXXXXX',
      whatsappDefaultMessage: 'Hola Jaz! Quiero planear mi próximo viaje',
      contactEmail: 'hola@tudominio.com',
      socialLinks: [
        { platform: 'instagram', url: 'https://instagram.com/pellegrina.viajes' },
      ],
      defaultSeo: {
        title: 'Pellegrina Viajes',
        description:
          'Te acompaño antes, durante y después del viaje. Viajes a medida, con cercanía y honestidad.',
      },
    },
  })

  const existingHome = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  })

  const homeData = {
    title: 'Home',
    slug: 'home',
    meta: {
      title: 'Pellegrina Viajes',
      description:
        'El mejor viaje es el que está hecho a tu medida. Te acompaño antes, durante y después.',
    },
    layout: [
      {
        blockType: 'pellegrinaHero' as const,
        stageLabel: 'Despegue',
        greeting: 'Hola, viajero/a:',
        typedTitle: 'El mejor viaje es el que está hecho a tu medida.',
        signature: '— Jaz, de Pellegrina',
        stampAlt: 'Logo de Pellegrina Viajes',
        stampImage: null,
        globeImage: null,
        addressLines: [
          { label: 'Para', value: 'vos' },
          { label: 'Destino', value: 'el que soñás' },
          { label: 'Hecho por', value: 'una persona, no una máquina' },
        ],
        lead: lexicalParagraph(
          'Te acompaño antes, durante y después del viaje, con la misma dedicación que le pongo cuando el viaje es mío.',
        ),
        primaryCta: { text: 'Contame tu próximo viaje', url: '#contacto' },
        secondaryCta: { text: 'Cómo trabajo', url: '#itinerario' },
        chips: [
          { label: 'Un café', color: 'agua' as const },
          { label: 'Un audio', color: 'aire' as const },
          { label: 'WhatsApp', color: 'tierra' as const },
        ],
      },
      {
        blockType: 'pellegrinaWhy' as const,
        stageLabel: 'El nombre',
        legLabel: 'Tramo 2 · Por qué Pellegrina',
        word: 'pellegrina',
        pronunciation: 'del italiano — sustantivo femenino',
        dictionaryBody: lexicalParagraph(
          '1. Quien emprende un camino hacia un lugar valioso, sagrado.',
          '2. Persona que sabe que el viaje no es solo el destino: también es todo lo que pasa antes y después de llegar.',
        ),
        heading: 'No vendo el viaje más barato. Busco el mejor viaje para vos.',
        highlight: 'Me involucro en cada viaje como me involucro en los míos.',
        body: lexicalParagraph(
          'Cuando alguien me escribe, le ofrezco distintas formas de charlar: un café, un audio, WhatsApp. Elegís la que te haga sentir más cómodo/a. Te llamo por tu nombre y busco que haya confianza de verdad.',
          'Mi valor no está en el precio. Está en lo personalizado, en la cercanía y en la honestidad con la que armo cada propuesta.',
        ),
      },
      {
        blockType: 'pellegrinaPassport' as const,
        stageLabel: 'Itinerario',
        legLabel: 'Tramo 3 · Cómo trabajo',
        heading:
          'Tres sellos y ya estás viajando, aunque todavía no hayas subido al avión.',
        intro: 'PASAPORTE DE VIAJE · PELLEGRINA — Hojas 1 a 3',
        steps: [
          {
            stepNumber: '1',
            stampLabel: 'CHARLAMOS',
            title: 'Una conversación, no un formulario',
            description: lexicalParagraph(
              'Café, audio o WhatsApp: elegís vos. Te escucho para entender qué buscás en este viaje y qué no.',
            ),
            tags: [
              { label: 'Café' },
              { label: 'Audio' },
              { label: 'WhatsApp' },
            ],
          },
          {
            stepNumber: '2',
            stampLabel: 'DISEÑO A MEDIDA',
            title: 'Un viaje armado para vos',
            description: lexicalParagraph(
              'Investigo el destino, la temporada y los mejores vuelos, y te armo una guía personalizada en PDF para que empieces a vivir el viaje antes de salir.',
            ),
            tags: [
              { label: 'Destino' },
              { label: 'Temporada' },
              { label: 'Vuelos' },
              { label: 'Guía PDF' },
            ],
          },
          {
            stepNumber: '3',
            stampLabel: 'TE ACOMPAÑO',
            title: 'No te dejo solo/a',
            description: lexicalParagraph(
              'Antes, durante y después. Si algo se complica, buscamos juntos la vuelta, para que el viaje termine en gratitud y no en frustración.',
            ),
            tags: [
              { label: 'Antes' },
              { label: 'Durante' },
              { label: 'Después' },
            ],
          },
        ],
      },
      {
        blockType: 'pellegrinaValues' as const,
        stageLabel: 'Brújula',
        legLabel: 'Tramo 4 · Lo que me guía',
        heading: 'Cuatro puntos cardinales para cada viaje',
        items: [
          {
            title: 'Honestidad',
            tone: 'agua' as const,
            description: lexicalParagraph(
              'Transparencia con lo económico y con lo que sé y lo que no. Prudencia antes que promesas.',
            ),
          },
          {
            title: 'Escucha',
            tone: 'aire' as const,
            description: lexicalParagraph(
              'Entender qué querés vos, no lo que se vende más fácil. Definimos juntos las prioridades del viaje.',
            ),
          },
          {
            title: 'Gratitud',
            tone: 'agua' as const,
            description: lexicalParagraph(
              'Que los imprevistos no se vuelvan frustración. Te acompaño para que todo fluya, incluso cuando algo se corre de lugar.',
            ),
          },
          {
            title: 'Valoración',
            tone: 'aire' as const,
            description: lexicalParagraph(
              'Reconozco el valor de tu tiempo, tu confianza y tu historia. Un viaje armado por alguien, no por una máquina.',
            ),
          },
        ],
      },
      {
        blockType: 'pellegrinaGuides' as const,
        stageLabel: 'Guías',
        legLabel: 'Tramo 5 · Si preferís armarlo vos',
        heading: 'Guías de destino con toda la investigación ya hecha',
        body: lexicalParagraph(
          'Accedé al mismo trabajo que hago para cada persona que viaja conmigo, en una guía pensada para que te sumerjas en el destino antes de llegar.',
        ),
        includes: [
          { item: 'Qué ver y cómo organizar los días' },
          { item: 'La mejor temporada para ir' },
          { item: 'Cómo conseguir los mejores vuelos' },
          { item: 'Tips prácticos para moverte allá' },
        ],
        price: '$7.000',
        priceNote: 'por guía, en PDF',
        cta: { text: 'Quiero una guía', url: '#contacto' },
        pages: [
          {
            kicker: 'GUÍA DE DESTINO',
            title: 'Ejemplo: Florianópolis',
            body: lexicalParagraph(
              'Vista previa de cómo se ve una guía. Tocá la página para hojearla.',
              'Temporada ideal: Dic a Mar · Días sugeridos: 7 a 10 · Moneda: Real (BRL) · Documentación: DNI vigente',
            ),
          },
          {
            kicker: 'CUÁNDO IR',
            title: 'La temporada, mes a mes',
            body: lexicalParagraph(
              'Mes a mes: E F M A M J J A S O N D — marzo y temporada alta destacados.',
            ),
            note: 'Marzo es mi favorito: sigue el calor, hay menos gente y bajan los precios.',
          },
          {
            kicker: 'VUELOS',
            title: 'Cómo llegar sin pagar de más',
            body: lexicalParagraph(
              'EZE → FLN. Directo en temporada alta. Fuera de temporada conviene comparar con escala en São Paulo.',
            ),
            note: 'Tip: los martes y miércoles suelen tener tarifas más bajas.',
          },
          {
            title: '¿Te la armo para tu destino?',
            body: lexicalParagraph('Cada guía se hace a pedido.'),
          },
        ],
      },
      {
        blockType: 'pellegrinaSuitcase' as const,
        stageLabel: 'Valija',
        legLabel: 'Tramo 6 · Armar la valija',
        heading: '¿Tenés todo? Tildá lo que ya guardaste.',
        intro:
          'Mi lista de equipaje de siempre, ahora para usar acá mismo. Elegí la temporada y andá marcando.',
        tipMessage:
          'Arrancá por la documentación: es lo único que no se compra allá.',
        doneCtaLabel: '¿A dónde la llevamos?',
        doneCtaSub: 'Contame y armamos el viaje',
        footerNote: lexicalParagraph(
          'Las cantidades van a depender de los días de viaje y del tamaño de equipaje que tengas. Cualquier duda, escribime y lo vemos juntos/as.',
        ),
        categories: [...COMMON_CATEGORIES, ...SEASON_CATEGORIES],
      },
      {
        blockType: 'pellegrinaPostcards' as const,
        stageLabel: 'Postales',
        legLabel: 'Tramo 7 · Postales de vuelta',
        heading: 'Viajeros que volvieron a elegirme',
        items: [
          {
            fromPlace: 'República Dominicana',
            toPlace: 'Brasil',
            who: 'Familia Vivona',
            quote:
              'La familia Vivona viajó a República Dominicana, y antes de terminar ese viaje ya me habían pedido una cotización para el próximo destino: Brasil.',
          },
        ],
        nextCardTitle: 'La próxima postal puede ser la tuya',
        nextCardBody: 'Contame a dónde querés ir y empezamos a escribirla.',
        nextCardCta: { text: 'Escribime por WhatsApp', url: '#contacto' },
      },
      {
        blockType: 'pellegrinaDestination' as const,
        stageLabel: 'Próximo destino',
        legLabel: 'Tramo 8 · Próximo destino',
        heading: '¿Charlamos sobre tu próximo viaje?',
        intro:
          'Completá tu pasaje y te escribo. O si preferís, mandame un mensaje directo.',
        ways: [
          {
            title: 'WhatsApp',
            description: 'La forma más rápida. Te respondo yo.',
            tone: 'aire' as const,
            whatsapp: true,
          },
          {
            title: 'Un audio',
            description: 'Si te resulta más fácil contarlo hablando.',
            tone: 'agua' as const,
            whatsapp: false,
          },
          {
            title: 'Un café',
            description: 'Para los que prefieren charlarlo en persona.',
            tone: 'tierra' as const,
            whatsapp: false,
          },
        ],
        formEnabled: true,
      },
    ],
  }

  if (existingHome.docs.length === 0) {
    await payload.create({
      collection: 'pages',
      data: homeData,
    })
    payload.logger.info('Created Home page with Pellegrina blocks')
  } else {
    await payload.update({
      collection: 'pages',
      id: existingHome.docs[0].id,
      data: homeData,
    })
    payload.logger.info('Updated existing Home page with Pellegrina layout')
  }

  payload.logger.info('Seed complete')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
