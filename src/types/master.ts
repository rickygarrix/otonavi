export type Prefecture = {
  id: string
  name_ja: string
  region: string
}

export type Area = {
  id: string
  name: string
  is_23ward: boolean
}

export type DrinkDefinition = {
  key: string
  label: string
}

export type GenericMaster = {
  id: string
  key: string
  label: string
  table: string
}