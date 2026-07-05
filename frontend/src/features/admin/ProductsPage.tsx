import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Clock, Eye, Plus, Star, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { api } from '../../lib/api'
import type { Category, Product } from '../../types/admin'
import { PageTitle } from './AdminShell'
import { formatCurrency, slugify } from './utils'

const fallbackImage = '/brand/logo.jpeg'
const defaultImageUrl = '/products/jollof-rice-royal.svg'

export function ProductsPage() {
  const queryClient = useQueryClient()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [price, setPrice] = useState('18.99')
  const [imageUrl, setImageUrl] = useState(defaultImageUrl)
  const [imageFileName, setImageFileName] = useState('')
  const [imageError, setImageError] = useState('')
  const [preparationMinutes, setPreparationMinutes] = useState('25')
  const [isFeatured, setIsFeatured] = useState(false)
  const [description, setDescription] = useState('')

  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () =>
      (
        await api.get<Product[]>('/api/v1/products', {
          params: { includeUnavailable: true },
        })
      ).data,
  })
  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () =>
      (
        await api.get<Category[]>('/api/v1/categories', {
          params: { includeInactive: true },
        })
      ).data,
  })

  const defaultCategoryId = useMemo(
    () => categoryId || categories[0]?.id || '',
    [categoryId, categories],
  )

  const createMutation = useMutation({
    mutationFn: async () =>
      api.post('/api/v1/products', {
        categoryId: defaultCategoryId,
        name,
        slug: slugify(name),
        description,
        priceCents: Math.round(Number(price) * 100),
        imageUrl,
        preparationMinutes: Number(preparationMinutes),
        isAvailable: true,
        isFeatured,
      }),
    onSuccess: async () => {
      resetForm()
      setIsCreateOpen(false)
      await queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/api/v1/products/${id}`),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  })

  function resetForm() {
    setName('')
    setDescription('')
    setImageUrl(defaultImageUrl)
    setImageFileName('')
    setImageError('')
    setPreparationMinutes('25')
    setPrice('18.99')
    setIsFeatured(false)
  }

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setImageError('Choisis un fichier image valide.')
      return
    }

    if (file.size > 1_500_000) {
      setImageError('Image trop lourde. Utilise une image de moins de 1.5 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setImageUrl(String(reader.result))
      setImageFileName(file.name)
      setImageError('')
    }
    reader.onerror = () => {
      setImageError("L'image n'a pas pu etre chargee.")
    }
    reader.readAsDataURL(file)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    createMutation.mutate()
  }

  return (
    <section>
      <PageTitle
        title="Produits"
        subtitle="Tableau des plats avec images, prix, categories et disponibilite."
      />

      <div className="rounded-2xl border border-[#eadfca] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Base de donnees produits</h2>
            <p className="mt-1 text-sm text-stone-500">
              {products.length} plats configures dans le menu.
            </p>
          </div>
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#d9a323] px-4 font-bold text-[#2a2114] transition hover:bg-[#f4c84f]"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Ajouter un plat
          </button>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-[#eadfca] text-xs uppercase tracking-wide text-stone-400">
              <tr>
                <th className="py-3">Plat</th>
                <th>Categorie</th>
                <th>Prix</th>
                <th>Preparation</th>
                <th>Vedette</th>
                <th>Statut</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  className="cursor-pointer border-b border-[#f0e8d8] transition hover:bg-[#fffaf0]"
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                >
                  <td className="py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={product.imageUrl || fallbackImage}
                        alt={product.name}
                        className="h-14 w-16 shrink-0 rounded-xl border border-[#eadfca] bg-[#fff8e8] object-cover"
                        onError={(event) => {
                          event.currentTarget.src = fallbackImage
                        }}
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-[#2a2114]">{product.name}</p>
                        <p className="max-w-[340px] truncate text-sm text-stone-500">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="font-semibold">
                    {product.category?.name ?? 'Sans categorie'}
                  </td>
                  <td className="font-black">
                    {formatCurrency(product.priceCents)}
                  </td>
                  <td>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#f4f0e8] px-3 py-1 text-xs font-semibold text-stone-600">
                      <Clock className="h-3.5 w-3.5" />
                      {product.preparationMinutes} min
                    </span>
                  </td>
                  <td>
                    {product.isFeatured ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#fff0c7] px-3 py-1 text-xs font-bold text-[#9b6a22]">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        Oui
                      </span>
                    ) : (
                      <span className="text-stone-400">Non</span>
                    )}
                  </td>
                  <td>
                    <span className="rounded-full bg-[#fff0c7] px-3 py-1 text-xs font-bold text-[#9b6a22]">
                      {product.isAvailable ? 'Disponible' : 'Masque'}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfca] text-[#9b6a22] transition hover:bg-[#fff0c7]"
                        onClick={(event) => {
                          event.stopPropagation()
                          setSelectedProduct(product)
                        }}
                        title="Voir"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 text-red-600 transition hover:bg-red-50"
                        onClick={(event) => {
                          event.stopPropagation()
                          deleteMutation.mutate(product.id)
                        }}
                        title="Desactiver"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateOpen ? (
        <ProductModal title="Ajouter un plat" onClose={() => setIsCreateOpen(false)}>
          <form className="grid gap-4 lg:grid-cols-[320px_1fr]" onSubmit={handleSubmit}>
            <div>
              <div className="overflow-hidden rounded-2xl border border-[#eadfca] bg-[#fff8e8]">
                <img
                  src={imageUrl || fallbackImage}
                  alt=""
                  className="h-56 w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = fallbackImage
                  }}
                />
              </div>
              <label className="mt-3 flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-dashed border-[#d9a323] bg-[#fffaf0] px-4 text-center text-sm font-bold text-[#9b6a22] transition hover:bg-[#fff0c7]">
                Importer une image
                <input
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageUpload}
                  type="file"
                />
              </label>
              {imageFileName ? (
                <p className="mt-2 truncate text-xs font-semibold text-[#9b6a22]">
                  {imageFileName}
                </p>
              ) : null}
              {imageError ? (
                <p className="mt-2 text-xs font-semibold text-red-600">
                  {imageError}
                </p>
              ) : null}
              <p className="mt-3 text-sm text-stone-500">
                Tu peux importer une image depuis ton ordinateur ou coller une URL.
              </p>
            </div>

            <div className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Nom du plat"
                  value={name}
                  onChange={setName}
                  required
                />
                <label className="block">
                  <span className="text-sm font-semibold">Categorie</span>
                  <select
                    className="mt-2 h-11 w-full rounded-xl border px-3 outline-none focus:border-[#d9a323]"
                    value={defaultCategoryId}
                    onChange={(event) => setCategoryId(event.target.value)}
                    required
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Prix USD" value={price} onChange={setPrice} required />
                <Field
                  label="Preparation"
                  value={preparationMinutes}
                  onChange={setPreparationMinutes}
                  type="number"
                  required
                />
                <label className="flex items-center gap-3 rounded-xl border border-[#eadfca] bg-[#fffaf0] px-3 py-2 text-sm font-semibold sm:mt-7">
                  <input
                    checked={isFeatured}
                    onChange={(event) => setIsFeatured(event.target.checked)}
                    type="checkbox"
                  />
                  Plat vedette
                </label>
              </div>

              <Field
                label="URL image"
                value={imageUrl}
                onChange={setImageUrl}
                required
              />
              <label className="block">
                <span className="text-sm font-semibold">Description</span>
                <textarea
                  className="mt-2 min-h-28 w-full rounded-xl border p-3 outline-none focus:border-[#d9a323]"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                />
              </label>

              <button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#d9a323] font-bold text-[#2a2114] transition hover:bg-[#f4c84f]">
                <Plus className="h-4 w-4" />
                Enregistrer le plat
              </button>
            </div>
          </form>
        </ProductModal>
      ) : null}

      {selectedProduct ? (
        <ProductModal
          title="Details du plat"
          onClose={() => setSelectedProduct(null)}
        >
          <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
            <img
              src={selectedProduct.imageUrl || fallbackImage}
              alt={selectedProduct.name}
              className="h-72 w-full rounded-2xl border border-[#eadfca] bg-[#fff8e8] object-cover"
              onError={(event) => {
                event.currentTarget.src = fallbackImage
              }}
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#fff0c7] px-3 py-1 text-xs font-bold text-[#9b6a22]">
                  {selectedProduct.category?.name ?? 'Sans categorie'}
                </span>
                <span className="rounded-full bg-[#f4f0e8] px-3 py-1 text-xs font-semibold text-stone-600">
                  {selectedProduct.preparationMinutes} min
                </span>
                {selectedProduct.isFeatured ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#fff0c7] px-3 py-1 text-xs font-bold text-[#9b6a22]">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    Vedette
                  </span>
                ) : null}
              </div>
              <h3 className="mt-4 text-3xl font-black">{selectedProduct.name}</h3>
              <p className="mt-2 text-2xl font-black text-[#9b6a22]">
                {formatCurrency(selectedProduct.priceCents)}
              </p>
              <p className="mt-5 leading-7 text-stone-600">
                {selectedProduct.description}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Info label="Slug" value={selectedProduct.slug} />
                <Info
                  label="Disponibilite"
                  value={selectedProduct.isAvailable ? 'Disponible' : 'Masque'}
                />
                <Info label="Image" value={selectedProduct.imageUrl ?? '-'} />
                <Info label="ID" value={selectedProduct.id} />
              </div>
            </div>
          </div>
        </ProductModal>
      ) : null}
    </section>
  )
}

function ProductModal({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a2114]/30 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl shadow-[#8b6a1f]/20">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b58116]">
              Produits
            </p>
            <h2 className="text-2xl font-black">{title}</h2>
          </div>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfca] text-[#9b6a22]"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input
        className="mt-2 h-11 w-full rounded-xl border px-3 outline-none focus:border-[#d9a323]"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        required={required}
      />
    </label>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#eadfca] bg-[#fffdf8] p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-stone-400">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-semibold">{value}</p>
    </div>
  )
}
