import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { api } from '../../lib/api'
import type { RestaurantSetting } from '../../types/admin'
import { PageTitle } from './AdminShell'

export function SettingsPage() {
  const { data: settings } = useQuery({
    queryKey: ['restaurant-settings'],
    queryFn: async () =>
      (await api.get<RestaurantSetting>('/api/v1/restaurant/settings')).data,
  })

  if (!settings) {
    return (
      <section>
        <PageTitle
          title="Parametres restaurant"
          subtitle="Configure livraison, taxes et informations publiques."
        />
        <div className="rounded-2xl bg-white p-8 shadow-sm">Chargement...</div>
      </section>
    )
  }

  return <SettingsForm key={settings.id} settings={settings} />
}

function SettingsForm({ settings }: { settings: RestaurantSetting }) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<Partial<RestaurantSetting>>(settings)

  const updateMutation = useMutation({
    mutationFn: async () => api.patch('/api/v1/restaurant/settings', form),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ['restaurant-settings'] }),
  })

  function updateField<K extends keyof RestaurantSetting>(
    key: K,
    value: RestaurantSetting[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    updateMutation.mutate()
  }

  return (
    <section>
      <PageTitle
        title="Parametres restaurant"
        subtitle="Configure livraison, taxes et informations publiques."
      />
      <form
        className="grid gap-4 rounded-2xl bg-white p-5 shadow-sm md:grid-cols-2"
        onSubmit={handleSubmit}
      >
        <Field
          label="Nom restaurant"
          value={form.restaurantName ?? ''}
          onChange={(value) => updateField('restaurantName', value)}
        />
        <Field
          label="Email"
          value={form.email ?? ''}
          onChange={(value) => updateField('email', value)}
        />
        <Field
          label="Telephone"
          value={form.phone ?? ''}
          onChange={(value) => updateField('phone', value)}
        />
        <Field
          label="Adresse"
          value={form.addressLine1 ?? ''}
          onChange={(value) => updateField('addressLine1', value)}
        />
        <Field
          label="Ville"
          value={form.city ?? ''}
          onChange={(value) => updateField('city', value)}
        />
        <Field
          label="Code postal"
          value={form.postalCode ?? ''}
          onChange={(value) => updateField('postalCode', value)}
        />
        <NumberField
          label="Frais livraison cents"
          value={form.deliveryFeeCents ?? 0}
          onChange={(value) => updateField('deliveryFeeCents', value)}
        />
        <NumberField
          label="Commande minimum cents"
          value={form.minimumOrderCents ?? 0}
          onChange={(value) => updateField('minimumOrderCents', value)}
        />
        <label className="flex items-center gap-3 rounded-xl border p-4 md:col-span-2">
          <input
            checked={Boolean(form.isOrderingEnabled)}
            onChange={(event) =>
              updateField('isOrderingEnabled', event.target.checked)
            }
            type="checkbox"
          />
          <span className="font-semibold">Commande en ligne activee</span>
        </label>
        <button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#d9a323] font-bold text-[#2a2114] md:col-span-2">
          <Save className="h-4 w-4" />
          Enregistrer
        </button>
      </form>
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input
        className="mt-2 h-11 w-full rounded-xl border px-3"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input
        className="mt-2 h-11 w-full rounded-xl border px-3"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        type="number"
      />
    </label>
  )
}
