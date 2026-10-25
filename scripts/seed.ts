/**
 * ENCETT e-commerce seed script.
 * Run: bun run scripts/seed.ts
 */
import { PrismaClient } from '@prisma/client'
import { randomBytes, scryptSync } from 'crypto'

const db = new PrismaClient()

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

async function main() {
  console.log('Clearing existing data...')
  await db.orderItem.deleteMany()
  await db.order.deleteMany()
  await db.session.deleteMany()
  await db.product.deleteMany()
  await db.category.deleteMany()
  await db.user.deleteMany()

  console.log('Creating users...')
  await db.user.create({
    data: {
      email: 'demo@encett.com',
      name: 'Demo Shopper',
      password: hashPassword('demo1234'),
      role: 'CUSTOMER',
    },
  })
  await db.user.create({
    data: {
      email: 'admin@encett.com',
      name: 'ENCETT Admin',
      password: hashPassword('admin1234'),
      role: 'ADMIN',
    },
  })

  console.log('Creating categories...')
  const totes = await db.category.create({
    data: { name: 'Tote Bags', slug: 'totes', tagline: 'Roomy carry-alls for every day' },
  })
  const shoulder = await db.category.create({
    data: { name: 'Shoulder Bags', slug: 'shoulder', tagline: 'Effortless silhouettes, hands-free ease' },
  })
  const crossbody = await db.category.create({
    data: { name: 'Crossbody', slug: 'crossbody', tagline: 'Compact companions for the city' },
  })
  const clutches = await db.category.create({
    data: { name: 'Clutches', slug: 'clutches', tagline: 'Evening pieces with a quiet glow' },
  })

  console.log('Creating products...')
  const products = [
    // ---- Totes ----
    {
      name: 'Milano Leather Tote',
      slug: 'milano-leather-tote',
      description:
        'A structured everyday tote in full-grain pebbled leather. Suede-lined interior, interior zip pocket and magnetic closure keep your essentials organised from morning commute to dinner reservations.',
      details: 'Full-grain pebbled leather · Suede lining · Fits a 14" laptop · H 30 × W 38 × D 14 cm',
      price: 189,
      imageUrl: '/products/milano-tote.jpg',
      categoryId: totes.id,
      stock: 24,
      rating: 4.8,
      reviewCount: 132,
      featured: true,
      isNew: false,
    },
    {
      name: 'Firenze Woven Tote',
      slug: 'firenze-woven-tote',
      description:
        'Hand-woven cognac leather with a sculptural chain strap. Each bag is woven by artisans, so no two pieces share exactly the same pattern — the mark of true handwork.',
      details: 'Hand-woven calf leather · Chain shoulder strap · Cotton canvas lining · H 26 × W 40 × D 12 cm',
      price: 249,
      imageUrl: '/products/firenze-tote.jpg',
      categoryId: totes.id,
      stock: 12,
      rating: 4.9,
      reviewCount: 87,
      featured: true,
      isNew: true,
    },
    {
      name: 'Vienna Mini Tote',
      slug: 'vienna-mini-tote',
      description:
        'A miniature take on our signature tote in buttery cream leather. Polished top handle and just enough room for your phone, cardholder and lipstick.',
      details: 'Smooth calf leather · Top handle · Gold-tone hardware · H 18 × W 22 × D 9 cm',
      price: 159,
      imageUrl: '/products/vienna-tote.jpg',
      categoryId: totes.id,
      stock: 18,
      rating: 4.7,
      reviewCount: 64,
      featured: false,
      isNew: true,
    },
    // ---- Shoulder ----
    {
      name: 'Serena Everyday Shoulder',
      slug: 'serena-everyday-shoulder',
      description:
        'The bag you will reach for every single morning. Softly structured tan leather, a wide shoulder strap that stays put, and an interior that swallows a tablet, planner and cosmetic pouch.',
      details: 'Saffiano-textured leather · Fixed shoulder strap · Interior slip pockets · H 28 × W 34 × D 11 cm',
      price: 215,
      imageUrl: '/products/serena-shoulder.jpg',
      categoryId: shoulder.id,
      stock: 20,
      rating: 4.8,
      reviewCount: 158,
      featured: true,
      isNew: false,
    },
    {
      name: 'Lumière Hobo Bag',
      slug: 'lumiere-hobo-bag',
      description:
        'A slouchy hobo in deep plum grained leather that drapes beautifully over the shoulder. Cinch it with the side ties for a more sculpted silhouette.',
      details: 'Grained leather · Slouchy hobo silhouette · Drawstring side ties · H 30 × W 36 × D 14 cm',
      price: 195,
      imageUrl: '/products/lumiere-hobo.jpg',
      categoryId: shoulder.id,
      stock: 14,
      rating: 4.6,
      reviewCount: 73,
      featured: false,
      isNew: false,
    },
    {
      name: 'Nomad Hobo Bag',
      slug: 'nomad-hobo-bag',
      description:
        'Made for long city days: an unstructured black leather hobo that softens with wear. Generous enough for a water bottle and a folded magazine.',
      details: 'Vegetable-tanned leather · Wide shoulder strap · Unlined interior · H 32 × W 40 × D 15 cm',
      price: 175,
      imageUrl: '/products/nomad-hobo.jpg',
      categoryId: shoulder.id,
      stock: 16,
      rating: 4.5,
      reviewCount: 49,
      featured: false,
      isNew: false,
    },
    // ---- Crossbody ----
    {
      name: 'Soho Barrel Bag',
      slug: 'soho-barrel-bag',
      description:
        'A compact barrel silhouette in rich chocolate leather with a curved top handle and adjustable webbing strap. Wear it crossbody by day, carry it by the handle at night.',
      details: 'Smooth calf leather · Detachable webbing strap · Brass hardware · H 16 × W 26 × D 12 cm',
      price: 145,
      imageUrl: '/products/soho-barrel.jpg',
      categoryId: crossbody.id,
      stock: 30,
      rating: 4.8,
      reviewCount: 211,
      featured: true,
      isNew: false,
    },
    {
      name: 'Brooklyn Camera Bag',
      slug: 'brooklyn-camera-bag',
      description:
        'Inspired by classic camera cases, this khaki crossbody features a double-zip body, gold accents and a strap that adjusts from shoulder to hip length.',
      details: 'Pebbled leather · Double-zip closure · Adjustable strap up to 128 cm · H 15 × W 22 × D 8 cm',
      price: 125,
      imageUrl: '/products/brooklyn-camera.jpg',
      categoryId: crossbody.id,
      stock: 26,
      rating: 4.7,
      reviewCount: 96,
      featured: false,
      isNew: false,
    },
    {
      name: 'Voyager Organizer Crossbody',
      slug: 'voyager-organizer-crossbody',
      description:
        'Three stacked zip compartments keep passports, cards and cables exactly where you left them. Open it flat and everything stays visible — no more bottomless-pit digging.',
      details: 'Buffed leather · 3 zip compartments · Card slots inside lid · H 18 × W 13 × D 7 cm',
      price: 135,
      imageUrl: '/products/voyager-crossbody.jpg',
      categoryId: crossbody.id,
      stock: 22,
      rating: 4.9,
      reviewCount: 184,
      featured: false,
      isNew: true,
    },
    {
      name: 'Tribeca Mini Pouch',
      slug: 'tribeca-mini-pouch',
      description:
        'A slim, hand-finished pouch on a long strap — the minimalist answer to nights out and quick errands. Fits a large phone plus cards.',
      details: 'Pull-up leather · Snap flap closure · Long crossbody strap · H 17 × W 11 × D 3 cm',
      price: 95,
      imageUrl: '/products/tribeca-pouch.jpg',
      categoryId: crossbody.id,
      stock: 35,
      rating: 4.6,
      reviewCount: 58,
      featured: false,
      isNew: false,
    },
    {
      name: 'Florence Tooled Crossbody',
      slug: 'florence-tooled-crossbody',
      description:
        'Hand-tooled floral leather in warm cognac tones, finished with burnished edges. A piece that ages into an heirloom rather than a trend.',
      details: 'Hand-tooled leather · Flap with stud closure · Hand-burnished edges · H 20 × W 14 × D 5 cm',
      price: 165,
      imageUrl: '/products/florence-crossbody.jpg',
      categoryId: crossbody.id,
      stock: 9,
      rating: 4.9,
      reviewCount: 42,
      featured: false,
      isNew: true,
    },
    // ---- Clutches ----
    {
      name: 'Monaco Box Clutch',
      slug: 'monaco-box-clutch',
      description:
        'A sculptural amber box clutch with a fine gold chain. The lacquered wood body catches candlelight beautifully — your plus-one for weddings and gallery nights.',
      details: 'Lacquered wood body · Detachable gold chain · Suede interior · W 19 × H 11 × D 5 cm',
      price: 110,
      imageUrl: '/products/monaco-clutch.jpg',
      categoryId: clutches.id,
      stock: 15,
      rating: 4.7,
      reviewCount: 77,
      featured: true,
      isNew: false,
    },
    {
      name: 'Riviera Frame Clutch',
      slug: 'riviera-frame-clutch',
      description:
        'Woven raffia meets a crystal-studded metal frame in this vintage-inspired evening bag. Equally at home over a summer dress or a little black dress.',
      details: 'Woven raffia · Crystal-set frame clasp · Top handle · W 22 × H 14 × D 7 cm',
      price: 135,
      imageUrl: '/products/riviera-clutch.jpg',
      categoryId: clutches.id,
      stock: 11,
      rating: 4.8,
      reviewCount: 66,
      featured: false,
      isNew: true,
    },
    {
      name: 'Noir Crystal Pouch',
      slug: 'noir-crystal-pouch',
      description:
        'A soft gathered pouch fully hand-set with jet crystals. Cinch the drawstring and let it glow against an evening gown.',
      details: 'Crystal-embellished mesh · Drawstring closure · Satin lining · W 18 × H 12 × D 6 cm',
      price: 89,
      imageUrl: '/products/noir-pouch.jpg',
      categoryId: clutches.id,
      stock: 20,
      rating: 4.5,
      reviewCount: 38,
      featured: false,
      isNew: false,
    },
  ]

  for (const p of products) {
    await db.product.create({ data: p })
  }

  const counts = {
    users: await db.user.count(),
    categories: await db.category.count(),
    products: await db.product.count(),
  }
  console.log('Seed complete:', counts)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
