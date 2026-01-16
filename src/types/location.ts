export enum RegionKey {
  北海道東北 = '北海道・東北',
  関東 = '関東',
  中部 = '中部',
  近畿 = '近畿',
  中国四国 = '中国・四国',
  九州沖縄 = '九州・沖縄',
}

export type Prefecture = {
  id: string;
  name_ja: string;
  region: RegionKey;
  code: number;
};

export type City = {
  id: string;
  name: string;
  is_23ward: boolean;
  display_order: number;
};
