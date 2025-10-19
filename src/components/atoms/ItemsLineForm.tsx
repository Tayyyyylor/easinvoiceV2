/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Formfield } from './Formfield'
import { Select } from './Select'
import { Button } from '../ui/button'

interface ItemsLineFormProps {
    fields: {
        id: string
        description: string
        type: string
        quantity?: number
        unit_price?: number
        tax_rate?: number
        total_price?: number
    }[]
    form: any
    remove: (index: number) => void
    append: (item: any) => void
    tvaNonApplicable?: boolean
}

export const ItemsLineForm = ({
    fields,
    form,
    remove,
    append,
    tvaNonApplicable = false,
}: ItemsLineFormProps) => {
    return (
        <div className="space-y-3 ">
            <div className="text-sm font-medium">Lignes</div>
            {fields.map((f, i) => (
                <div
                    key={f.id}
                    className="grid grid-cols-12 gap-2 items-end border rounded p-3"
                >
                    <div className="col-span-4">
                        <Formfield
                            form={form}
                            name={`lines.${i}.description`}
                            label="Description"
                            placeholder="Ex: Intégration"
                        />
                    </div>
                    <div className="col-span-2 border rounded p-2">
                        <Select
                            label="Type"
                            id={`lines.${i}.type`}
                            value={form.watch(`lines.${i}.type`)}
                            onChange={(e) => {
                                form.setValue(`lines.${i}.type`, e.target.value)
                            }}
                            options={[
                                { value: 'service', label: 'Service' },
                                { value: 'produit', label: 'Produit' },
                            ]}
                        />
                    </div>

                    <div className="col-span-1">
                        <Formfield
                            form={form}
                            name={`lines.${i}.quantity`}
                            label="Qté"
                            placeholder="1"
                        />
                    </div>
                    <div className="col-span-2">
                        <Formfield
                            form={form}
                            name={`lines.${i}.unit_price`}
                            label="Prix unitaire (€)"
                            placeholder="0"
                        />
                    </div>
                    <div className="col-span-2">
                        <Formfield
                            form={form}
                            name={`lines.${i}.tax_rate`}
                            label="TVA %"
                            placeholder="20"
                            disabled={tvaNonApplicable}
                        />
                    </div>
                    <div className="col-span-1">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => remove(i)}
                        >
                            −
                        </Button>
                    </div>
                </div>
            ))}
            <Button
                type="button"
                variant="secondary"
                onClick={() =>
                    append({
                        description: '',
                        type: 'service',
                        quantity: 1,
                        unit_price: 0,
                        tax_rate: tvaNonApplicable ? 0 : 20,
                    })
                }
            >
                + Ajouter une ligne
            </Button>
        </div>
    )
}
