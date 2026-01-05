// types/master.ts
export type DrinkDefinition = {
  key: string
  label: string
  display_order?: number | null
}

export type GenericMaster = {
  id: string
  key: string
  label: string
  table: string
  display_order: number
}