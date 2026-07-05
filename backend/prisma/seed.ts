import { PrismaClient, UserRole } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const adminPasswordHash = await bcrypt.hash('Admin123!', 12)

  await prisma.user.upsert({
    where: { email: 'admin@africanrestaurantsofia.com' },
    update: {},
    create: {
      email: 'admin@africanrestaurantsofia.com',
      passwordHash: adminPasswordHash,
      firstName: 'Sofia',
      lastName: 'Admin',
      role: UserRole.ADMIN,
      isActive: true,
    },
  })

  const categories = [
    {
      name: 'Plats signatures',
      slug: 'plats-signatures',
      description: 'Recettes africaines premium preparees pour la livraison.',
      sortOrder: 1,
    },
    {
      name: 'Grillades',
      slug: 'grillades',
      description: 'Viandes et poissons grilles avec epices maison.',
      sortOrder: 2,
    },
    {
      name: 'Accompagnements',
      slug: 'accompagnements',
      description: 'Riz, plantains et sides pour completer la commande.',
      sortOrder: 3,
    },
    {
      name: 'Boissons',
      slug: 'boissons',
      description: 'Boissons fraiches inspirees du continent africain.',
      sortOrder: 4,
    },
  ]

  const categoryRecords = new Map<string, string>()

  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    })
    categoryRecords.set(category.slug, record.id)
  }

  const products = [
    {
      categorySlug: 'plats-signatures',
      name: 'Jollof Rice Royal',
      slug: 'jollof-rice-royal',
      description:
        'Riz jollof parfume, poulet braise, legumes confits et sauce maison.',
      priceCents: 2299,
      imageUrl: '/products/jollof-rice-royal.svg',
      isFeatured: true,
    },
    {
      categorySlug: 'plats-signatures',
      name: 'Mafe de Boeuf Premium',
      slug: 'mafe-boeuf-premium',
      description:
        'Boeuf mijote dans une sauce arachide onctueuse, servi avec riz blanc.',
      priceCents: 2499,
      imageUrl: '/products/mafe-boeuf-premium.svg',
      isFeatured: true,
    },
    {
      categorySlug: 'grillades',
      name: 'Poulet Yassa Grille',
      slug: 'poulet-yassa-grille',
      description:
        'Poulet marine citron-oignons, grille et accompagne de riz parfume.',
      priceCents: 2199,
      imageUrl: '/products/poulet-yassa-grille.svg',
      isFeatured: false,
    },
    {
      categorySlug: 'grillades',
      name: 'Poisson Braise Attieke',
      slug: 'poisson-braise-attieke',
      description:
        'Poisson entier braise, attieke, crudites et sauce piquante.',
      priceCents: 2799,
      imageUrl: '/products/poisson-braise-attieke.svg',
      isFeatured: true,
    },
    {
      categorySlug: 'accompagnements',
      name: 'Alloco Maison',
      slug: 'alloco-maison',
      description: 'Plantains murs frits, sauce tomate epicee.',
      priceCents: 799,
      imageUrl: '/products/alloco-maison.svg',
      isFeatured: false,
    },
    {
      categorySlug: 'boissons',
      name: 'Bissap Hibiscus',
      slug: 'bissap-hibiscus',
      description: "Infusion hibiscus fraiche, menthe et notes d'agrumes.",
      priceCents: 599,
      imageUrl: '/products/bissap-hibiscus.svg',
      isFeatured: false,
    },
  ]

  for (const product of products) {
    const categoryId = categoryRecords.get(product.categorySlug)

    if (!categoryId) {
      throw new Error(`Missing category ${product.categorySlug}`)
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        categoryId,
        name: product.name,
        description: product.description,
        priceCents: product.priceCents,
        imageUrl: product.imageUrl,
        isFeatured: product.isFeatured,
      },
      create: {
        categoryId,
        name: product.name,
        slug: product.slug,
        description: product.description,
        priceCents: product.priceCents,
        imageUrl: product.imageUrl,
        isFeatured: product.isFeatured,
      },
    })
  }

  await prisma.restaurantSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      restaurantName: 'African Restaurant Sofia',
      phone: '+1 212 555 0199',
      email: 'orders@africanrestaurantsofia.com',
      addressLine1: 'Ghost Kitchen New York',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      deliveryRadiusMiles: 5,
      minimumOrderCents: 1500,
      deliveryFeeCents: 499,
      taxRateBasisPoints: 887,
      isOrderingEnabled: true,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
