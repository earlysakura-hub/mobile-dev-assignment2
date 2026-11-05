import type { NavigatorScreenParams } from '@react-navigation/native';

export type ShopStackParams = { Store: undefined; Wishlist: undefined };
export type TabParams = { Shop: NavigatorScreenParams<ShopStackParams> | undefined; News: undefined };
export type RootParams = { Home: NavigatorScreenParams<TabParams> | undefined; Account: undefined };
