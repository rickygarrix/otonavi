export type Prefecture = {
  id: string;
  name_ja: string;
  code: number;
};

export type City = {
  id: string;
  name: string;
  is_23ward: boolean;
  sort_order: number;
};
