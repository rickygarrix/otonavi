/** 汎用的なKV型 (旧 common.ts) */
export type DefinitionKV = {
  key: string;
  label: string;
};

/** エリア関連 (旧 location.ts) */
export type Prefecture = {
  id: string;
  key: string;
  name: string;
  sort_order: number;
};

export type City = {
  id: string;
  key: string;
  name: string;
  sort_order: number;
};

/** マスター定義 (既存) */
export type DrinkDefinition = {
  key: string;
  label: string;
  sort_order?: number | null;
};

export type GenericMaster = {
  id: string;
  key: string;
  label: string;
  table: string;
  sort_order: number;
};