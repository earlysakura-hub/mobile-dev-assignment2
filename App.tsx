import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommonActions, NavigationContainer, NavigatorScreenParams, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabBarProps, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// All images come from the six Steam reference screenshots.
const ART = {
  avatar: require('./assets/steam/avatar.jpg'),
  phantom: require('./assets/steam/phantom.jpg'),
  leaf: require('./assets/steam/leaf.jpg'),
  apex: require('./assets/steam/apex.jpg'),
  cities: require('./assets/steam/cities.jpg'),
  wukong: require('./assets/steam/wukong.jpg'),
  ace: require('./assets/steam/ace.jpg'),
};

const C = {
  background: '#0e1923',
  header: '#202127',
  panel: '#292d36',
  panelLight: '#373d48',
  card: '#1b3045',
  blue: '#1a9fff',
  softBlue: '#65b6e3',
  text: '#f0f1f2',
  muted: '#a4aab4',
  green: '#75a924',
};
const DISPLAY_NAME = 'SteamUser'; // Change this if you want a different demo name.
const SCREEN_WIDTH = Dimensions.get('window').width;

type Game = {
  id: string;
  title: string;
  image: ImageSourcePropType;
  price: number;
  releaseDate: string;
  reviews: string;
  badge?: string;
};

const GAMES: Game[] = [
  { id: 'wukong', title: 'Black Myth: Wukong', image: ART.wukong, price: 79.99,
    releaseDate: 'AUG 19, 2024', reviews: 'VERY POSITIVE' },
  { id: 'ace', title: 'Ace Attorney Investigations Collection', image: ART.ace,
    price: 59.99, releaseDate: 'SEP 5, 2024', reviews: 'OVERWHELMINGLY POSITIVE',
    badge: 'Demo Available' },
  { id: 'phantom', title: 'Phantom Blade Zero', image: ART.phantom,
    price: 79.99, releaseDate: 'COMING SOON', reviews: 'VERY POSITIVE' },
];

const formatPrice = (amount: number) => `C$ ${amount.toFixed(2)}`;
const demoAlert = (_title: string) => {};

type WishlistState = {
  ids: string[];
  toggle: (id: string) => void;
  remove: (id: string) => void;
};
const WishlistContext = createContext<WishlistState | null>(null);
function useWishlist() {
  const value = useContext(WishlistContext);
  if (!value) throw new Error('WishlistContext not found');
  return value;
}

type ShopStackParams = { Store: undefined; Wishlist: undefined };
type TabParams = { Shop: NavigatorScreenParams<ShopStackParams> | undefined; News: undefined };
type RootParams = { Home: NavigatorScreenParams<TabParams> | undefined; Account: undefined };
const RootStack = createNativeStackNavigator<RootParams>();
const Tab = createBottomTabNavigator<TabParams>();
const ShopStack = createNativeStackNavigator<ShopStackParams>();

function Avatar({ size = 38, onPress }: { size?: number; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} accessibilityLabel="Account">
      <Image source={ART.avatar} style={{ width: size, height: size }} />
    </Pressable>
  );
}

function StoreHeader({ showBack = false, onBack, onWishlist, onAccount }: {
  showBack?: boolean;
  onBack?: () => void;
  onWishlist: () => void;
  onAccount: () => void;
}) {
  return (
    <View style={s.storeHeader}>
      <View style={s.storeHeaderRow}>
        {showBack && (
          <Pressable onPress={onBack} style={s.backButton} accessibilityLabel="Back">
            <Ionicons name="chevron-back" color={C.text} size={28} />
          </Pressable>
        )}
        <Pressable style={s.steamLogoBox} onPress={() => demoAlert('Steam Store')}>
          <MaterialCommunityIcons name="steam" size={27} color="#7e838c" />
          <Text style={s.steamLogoText}>STEAM</Text>
          <View style={{ flex: 1 }} />
          <Ionicons name="search" color="#9fa5ad" size={25} />
        </Pressable>
        <Pressable style={s.ellipsis} onPress={() => demoAlert('More options')}>
          <Ionicons name="ellipsis-vertical" size={24} color={C.muted} />
        </Pressable>
        <Avatar onPress={onAccount} />
      </View>
      <View style={s.storeLinks}>
        <Pressable onPress={() => demoAlert('Store menu')}>
          <Text style={s.storeLinkText}>MENU⌄</Text>
        </Pressable>
        <Pressable onPress={onWishlist}>
          <Text style={s.storeLinkText}>WISHLIST</Text>
        </Pressable>
        <Pressable onPress={() => demoAlert('Wallet')}>
          <Text style={s.storeLinkText}>WALLET <Text style={{ color: C.blue }}>(CDN$ 0.00)</Text></Text>
        </Pressable>
      </View>
    </View>
  );
}

function FeaturedCard({ game }: { game: Game }) {
  const { ids, toggle } = useWishlist();
  const saved = ids.includes(game.id);
  return (
    <View style={[s.featureCard, { width: SCREEN_WIDTH - 48 }]}>
      <Image source={game.image} style={s.featureImage} resizeMode="cover" />
      <View style={s.featureDetails}>
        <Text style={s.featureTitle}>{game.title}</Text>
        <Text style={s.featureReviews}>
          Very Positive <Text style={{ color: C.text }}>(6,593 Reviews)</Text>
        </Text>
        <View style={s.featureBottom}>
          <Pressable onPress={() => toggle(game.id)} style={s.wishButton}>
            <Ionicons name={saved ? 'heart' : 'heart-outline'} size={19} color={saved ? '#f2676e' : C.text} />
            <Text style={s.smallButtonText}>{saved ? 'Wishlisted' : 'Wishlist'}</Text>
          </Pressable>
          <Text style={s.featurePrice}>{formatPrice(game.price)}</Text>
        </View>
      </View>
    </View>
  );
}

function StoreScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ShopStackParams>>();
  const openAccount = () => navigation.getParent()?.getParent()?.dispatch(CommonActions.navigate('Account'));
  return (
    <View style={s.screen}>
      <StoreHeader onWishlist={() => navigation.navigate('Wishlist')} onAccount={openAccount} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={s.sectionHeading}>Featured &amp; Recommended</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.hCarousel}>
          <FeaturedCard game={GAMES[2]} />
          <FeaturedCard game={GAMES[0]} />
        </ScrollView>
        <Text style={[s.sectionHeading, { marginTop: 30 }]}>Discounts &amp; Events</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.hCarousel}>
          <Pressable onPress={() => demoAlert('Midweek Deal')} style={s.dealCard}>
            <Image source={ART.leaf} style={s.dealImage} />
            <Text style={s.dealLabel}>MIDWEEK DEAL</Text>
          </Pressable>
          <Pressable onPress={() => demoAlert('Publisher Sale')} style={s.dealCard}>
            <Image source={ART.ace} style={s.dealImage} resizeMode="cover" />
            <Text style={s.dealLabel}>PUBLISHER SALE</Text>
          </Pressable>
        </ScrollView>
        <Text style={[s.sectionHeading, { marginTop: 25 }]}>Recommended for You</Text>
        <Pressable style={s.recommendRow} onPress={() => navigation.navigate('Wishlist')}>
          <Image source={ART.wukong} style={s.recommendImage} />
          <View style={{ flex: 1 }}>
            <Text style={s.recommendTitle}>Black Myth: Wukong</Text>
            <Text style={s.featureReviews}>Very Positive</Text>
            <Text style={s.featurePrice}>{formatPrice(79.99)}</Text>
          </View>
        </Pressable>
        <Text style={s.bottomHint}>Steam Store UI Demo</Text>
      </ScrollView>
    </View>
  );
}

type NewsItem = { id: string; game: string; title: string; description: string; image: ImageSourcePropType; time: string };
const NEWS: NewsItem[] = [
  { id: 'apex', game: 'Apex Legends™', title: 'Apex Legends | Godzilla Event',
    description: 'Fight your rivals in the destruction left in Godzilla’s wake, or dodge its attacks to claim a piece of its power.',
    image: ART.apex, time: '51 MINUTES AGO' },
  { id: 'cities', game: 'Cities: Skylines', title: 'Cities: Skylines — New Content',
    description: 'Discover new holiday getaways, neighborhoods, and more.',
    image: ART.cities, time: '2 HOURS AGO' },
];

function NewsScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<TabParams>>();
  const [category, setCategory] = useState<'YOUR NEWS' | 'UPCOMING' | 'FEATURED'>('YOUR NEWS');
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const openAccount = () => navigation.getParent()?.dispatch(CommonActions.navigate('Account'));
  const visibleNews = category === 'UPCOMING' ? [NEWS[1]] : category === 'FEATURED' ? [NEWS[0]] : NEWS;
  return (
    <View style={s.screen}>
      <View style={s.newsHeader}>
        <Text style={s.newsHeading}>NEWS</Text>
        <Pressable onPress={() => demoAlert('News menu')}>
          <Ionicons name="ellipsis-vertical" color={C.muted} size={24} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Avatar onPress={openAccount} />
      </View>
      <View style={s.newsTabs}>
        <Pressable onPress={() => demoAlert('News settings')}><Ionicons name="settings" color={C.text} size={20} /></Pressable>
        <Pressable onPress={() => demoAlert('News search')}><Ionicons name="search" color={C.text} size={20} /></Pressable>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 22, alignItems: 'center' }}>
          {(['YOUR NEWS', 'UPCOMING', 'FEATURED'] as const).map((name) => (
            <Pressable key={name} onPress={() => setCategory(name)} style={[s.newsTab, category === name && s.newsTabActive]}>
              <Text style={[s.newsTabText, category === name && { color: C.blue }]}>
                {name}{name === 'UPCOMING' ? '  0' : ''}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={s.today}>TODAY</Text>
        {visibleNews.map((item) => {
          const liked = likedIds.includes(item.id);
          return (
            <View key={item.id} style={s.newsCard}>
              <Image source={item.image} style={s.newsImage} resizeMode="cover" />
              <Text style={s.newsGame}>🟥  {item.game}</Text>
              <Text style={s.newsTitle}>{item.title}</Text>
              <Text style={s.newsDescription}>{item.description}</Text>
              <Text style={s.newsTime}>{item.time}</Text>
              <View style={s.newsActions}>
                <Pressable onPress={() => setLikedIds((old) => liked ? old.filter((x) => x !== item.id) : [...old, item.id])} style={s.newsAction}>
                  <Ionicons name={liked ? 'thumbs-up' : 'thumbs-up-outline'} color={liked ? C.blue : '#8e939c'} size={20} />
                  <Text style={s.newsActionText}>{(item.id === 'apex' ? 6 : 2) + (liked ? 1 : 0)}</Text>
                </Pressable>
                <Pressable onPress={() => demoAlert('Comments')} style={s.newsAction}>
                  <Ionicons name="chatbubble" color="#8e939c" size={20} />
                  <Text style={s.newsActionText}>1</Text>
                </Pressable>
                <Pressable onPress={() => demoAlert('More news options')} style={s.newsAction}>
                  <Ionicons name="ellipsis-horizontal-circle" color="#8e939c" size={22} />
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function WishlistFooter() {
  const columns = [
    ['STEAM', 'About Steam', 'Steam SSA', 'Steamworks', 'Steam Distribution', 'Gift Cards'],
    ['VALVE', 'About Valve', 'Jobs', 'Hardware', 'Recycling'],
    ['LEGAL', 'Privacy', 'Accessibility', 'Notices & Policies', 'Cookies', 'Refunds'],
    ['MORE', 'Get Steam', 'Get Mobile Apps', 'Get Support', 'My Account'],
  ];
  return (
    <View style={s.footer}>
      <View style={s.footerGrid}>
        {columns.map((column) => (
          <View key={column[0]} style={s.footerColumn}>
            <Text style={s.footerHeading}>{column[0]}</Text>
            {column.slice(1).map((label) => (
              <Pressable onPress={() => demoAlert(label)} key={label}>
                <Text style={s.footerLink}>{label}</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
      <Text style={s.footerLogo}>◉ STEAM       VALVE</Text>
      <Text style={s.footerCopy}>© 2026 Valve Corporation. All rights reserved.{'\n'}This is a non-commercial student interface recreation.</Text>
    </View>
  );
}

function WishlistScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ShopStackParams>>();
  const { ids, remove } = useWishlist();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'rank' | 'name' | 'price'>('rank');
  const [positiveOnly, setPositiveOnly] = useState(false);
  const games = useMemo(() => {
    let result = GAMES.filter((game) => ids.includes(game.id) && game.title.toLowerCase().includes(search.toLowerCase()));
    if (positiveOnly) result = result.filter((game) => game.reviews.includes('POSITIVE'));
    if (sort === 'name') result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'price') result = [...result].sort((a, b) => a.price - b.price);
    return result;
  }, [ids, search, sort, positiveOnly]);
  const nextSort = () => setSort((previous) => previous === 'rank' ? 'name' : previous === 'name' ? 'price' : 'rank');
  const sortLabel = sort === 'rank' ? 'Your Rank' : sort === 'name' ? 'Name' : 'Price (Low to High)';
  const openAccount = () => navigation.getParent()?.getParent()?.dispatch(CommonActions.navigate('Account'));
  return (
    <View style={s.screen}>
      <StoreHeader showBack onBack={() => navigation.goBack()} onWishlist={() => {}} onAccount={openAccount} />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={s.wishlistIntro}>
          <Avatar size={62} onPress={openAccount} />
          <Text style={s.wishlistIntroText}>{DISPLAY_NAME.toUpperCase()}'S{ '\n' }WISHLIST</Text>
        </View>
        <View style={s.wishlistControls}>
          <TextInput
            placeholder="Search by name, tag, or category"
            placeholderTextColor="#808995"
            style={s.wishlistSearch}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />
          <View style={s.wishlistOptionsRow}>
            <Pressable style={[s.optionBox, { flex: 1 }]} onPress={() => setPositiveOnly((v) => !v)}>
              <Text style={s.optionText}>{positiveOnly ? 'Positive ✓' : 'Options'}　⌄</Text>
            </Pressable>
            <Pressable style={[s.optionBox, { flex: 1.7 }]} onPress={nextSort}>
              <Text style={s.optionText}><Text style={{ color: C.blue }}>Sort by:</Text> {sortLabel}　⌄</Text>
            </Pressable>
            <Pressable style={[s.optionBox, { width: 42, alignItems: 'center' }]} onPress={() => demoAlert('Share Wishlist')}>
              <Ionicons name="share-social-outline" size={23} color={C.text} />
            </Pressable>
          </View>
        </View>
        {games.length === 0 && (
          <Text style={s.emptyWishlist}>No matching games. Add a game from the Store or change your search.</Text>
        )}
        {games.map((game) => (
          <View key={game.id} style={s.wishlistCard}>
            <View style={s.wishlistCardTop}>
              {game.badge ? <Text style={s.demoBadge}>{game.badge}</Text> : <View />}
              <Pressable onPress={() => remove(game.id)} style={s.removeButton}>
                <Ionicons name="close" size={18} color="#fff" />
                <Text style={s.removeText}>remove</Text>
              </Pressable>
            </View>
            <Image source={game.image} style={s.wishlistGameImage} resizeMode="cover" />
            <Text style={s.wishlistGameTitle}>{game.title}</Text>
            <View style={s.categoryRow}>
              <Text style={s.detailMuted}>MY CATEGORIES:</Text>
              <Pressable style={s.plusButton} onPress={() => demoAlert('Categories')}><Ionicons name="add" color={C.muted} size={18} /></Pressable>
            </View>
            <Text style={s.detailMuted}>RELEASE DATE: <Text style={s.detailValue}>{game.releaseDate}</Text></Text>
            <Text style={s.detailMuted}>ENGLISH REVIEWS: <Text style={{ color: C.softBlue }}>{game.reviews}</Text></Text>
            <View style={s.cartRow}>
              <Text style={s.cartPrice}>{formatPrice(game.price)}</Text>
              <Pressable style={s.cartButton} onPress={() => demoAlert('Add to Cart')}>
                <Text style={s.cartButtonText}>Add to Cart</Text>
              </Pressable>
            </View>
          </View>
        ))}
        <WishlistFooter />
      </ScrollView>
    </View>
  );
}

function AccountScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootParams>>();
  const accountRows = ['Friend Activity', 'Friends', 'Groups', 'Screenshots/Videos', 'Badges', 'Inventory'];
  return (
    <View style={[s.screen, { backgroundColor: C.header }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.accountHero}>
          <Pressable onPress={() => navigation.goBack()} style={s.accountBack} accessibilityLabel="Back">
            <Ionicons name="chevron-back" color={C.text} size={30} />
          </Pressable>
          <Avatar size={82} />
          <View style={{ flex: 1, marginLeft: 17 }}>
            <Text style={s.accountName} numberOfLines={1}>{DISPLAY_NAME}</Text>
            <Pressable style={s.profileButton} onPress={() => demoAlert('View Profile')}>
              <Text style={s.profileButtonText}>View Profile</Text>
            </Pressable>
          </View>
        </View>
        <View style={s.accountStats}>
          {[['48', 'Games'], ['8', 'Friends'], ['C$ 0.00', 'Wallet']].map(([value, label]) => (
            <View key={label} style={s.statBox}>
              <Text style={s.statNumber}>{value}</Text>
              <Text style={s.statLabel}>{label}</Text>
            </View>
          ))}
          <Pressable onPress={() => demoAlert('Add Friends')} style={s.addFriends}>
            <Ionicons name="person-add" size={21} color="#fff" />
            <Text style={s.addFriendsText}>Add friends</Text>
          </Pressable>
        </View>
        <Text style={s.myContent}>MY CONTENT</Text>
        {accountRows.map((label) => (
          <Pressable key={label} onPress={() => demoAlert(label)} style={s.accountRow}>
            <Text style={s.accountRowText}>{label}</Text>
          </Pressable>
        ))}
        {[
          ['Account Details', 'Store, Security, Family'],
          ['Change Account', DISPLAY_NAME.toLowerCase()],
          ['Sign Out', ''],
        ].map(([label, sub]) => (
          <Pressable key={label} onPress={() => demoAlert(label)} style={s.accountRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.accountRowText}>{label}</Text>
              {sub ? <Text style={s.accountSubText}>{sub}</Text> : null}
            </View>
            {label !== 'Sign Out' && <Ionicons name="chevron-forward" color={C.text} size={25} />}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function SteamBottomBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const active = state.routes[state.index].name;
  const actions: { icon: keyof typeof Ionicons.glyphMap; selected: boolean; onPress: () => void; label: string }[] = [
    { icon: 'pricetag', selected: active === 'Shop', onPress: () => navigation.navigate('Shop', { screen: 'Store' }), label: 'Store' },
    { icon: 'newspaper', selected: active === 'News', onPress: () => navigation.navigate('News'), label: 'News' },
    { icon: 'shield', selected: false, onPress: () => demoAlert('Steam Guard'), label: 'Steam Guard' },
    { icon: 'notifications', selected: false, onPress: () => demoAlert('Notifications'), label: 'Notifications' },
    { icon: 'menu', selected: false, onPress: () => navigation.dispatch(CommonActions.navigate('Account')), label: 'Account menu' },
  ];
  return (
    <View style={[s.bottomBar, { paddingBottom: insets.bottom, height: 58 + insets.bottom }]}>
      {actions.map((action) => (
        <Pressable key={action.label} onPress={action.onPress} style={s.bottomIcon} accessibilityLabel={action.label}>
          <Ionicons name={action.icon} size={25} color={action.selected ? C.blue : '#d8dce1'} />
        </Pressable>
      ))}
    </View>
  );
}

function ShopNavigator() {
  return (
    <ShopStack.Navigator screenOptions={{ headerShown: false }}>
      <ShopStack.Screen name="Store" component={StoreScreen} />
      <ShopStack.Screen name="Wishlist" component={WishlistScreen} />
    </ShopStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <SteamBottomBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Shop" component={ShopNavigator} />
      <Tab.Screen name="News" component={NewsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [ids, setIds] = useState<string[]>(['wukong', 'ace']);
  const wishlist: WishlistState = {
    ids,
    toggle: (id) => setIds((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id]),
    remove: (id) => setIds((current) => current.filter((x) => x !== id)),
  };
  return (
    <SafeAreaProvider>
      <WishlistContext.Provider value={wishlist}>
        <SafeAreaView style={{ flex: 1, backgroundColor: C.header }} edges={['top']}>
          <StatusBar barStyle="light-content"  />
          <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
              <RootStack.Screen name="Home" component={MainTabs} />
              <RootStack.Screen name="Account" component={AccountScreen} />
            </RootStack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </WishlistContext.Provider>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.background },
  storeHeader: { backgroundColor: C.header },
  storeHeaderRow: { height: 76, paddingHorizontal: 17, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton: { marginLeft: -9, paddingRight: 0 },
  steamLogoBox: { flex: 1, height: 38, backgroundColor: '#2a2d35', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, gap: 7 },
  steamLogoText: { color: '#737984', fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },
  ellipsis: { width: 19, alignItems: 'center' },
  storeLinks: { height: 47, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },
  storeLinkText: { color: '#e1e2e5', fontSize: 12, letterSpacing: 0.9 },
  sectionHeading: { fontSize: 17, fontWeight: 'bold', color: C.text, marginLeft: 8, marginTop: 13, marginBottom: 12 },
  hCarousel: { paddingHorizontal: 8, gap: 11 },
  featureCard: { backgroundColor: C.card },
  featureImage: { width: '100%', height: 188 },
  featureDetails: { paddingHorizontal: 10, paddingTop: 10, paddingBottom: 10 },
  featureTitle: { color: C.text, fontSize: 20 },
  featureReviews: { color: C.softBlue, fontSize: 13, marginTop: 7 },
  featureBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  wishButton: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 5 },
  smallButtonText: { color: C.text, fontSize: 12 },
  featurePrice: { color: C.text, fontSize: 14, backgroundColor: '#102133', paddingHorizontal: 9, paddingVertical: 8 },
  dealCard: { width: SCREEN_WIDTH * 0.7, height: 258, backgroundColor: C.card, overflow: 'hidden' },
  dealImage: { width: '100%', height: '100%' },
  dealLabel: { position: 'absolute', left: 12, top: 14, backgroundColor: '#9a2464', paddingHorizontal: 8, paddingVertical: 5, color: '#fff', fontWeight: 'bold' },
  recommendRow: { flexDirection: 'row', backgroundColor: C.card, marginHorizontal: 8, marginBottom: 15, gap: 11, padding: 9, alignItems: 'center' },
  recommendImage: { width: 125, height: 80 },
  recommendTitle: { color: C.text, fontSize: 15 },
  bottomHint: { color: C.muted, textAlign: 'center', padding: 25 },
  newsHeader: { height: 89, flexDirection: 'row', alignItems: 'center', paddingLeft: 17, paddingRight: 17, gap: 10, backgroundColor: C.header },
  newsHeading: { color: '#e0e2e6', fontSize: 19, letterSpacing: 1.5, marginLeft: 0 },
  newsTabs: { height: 50, backgroundColor: '#343840', flexDirection: 'row', alignItems: 'center', gap: 18, paddingHorizontal: 10 },
  newsTab: { height: 50, justifyContent: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  newsTabActive: { borderBottomColor: C.blue },
  newsTabText: { color: '#e6e8eb', fontSize: 12, letterSpacing: 0.9 },
  today: { color: C.text, fontSize: 17, letterSpacing: 2, paddingHorizontal: 12, paddingVertical: 13 },
  newsCard: { backgroundColor: '#14212d', marginBottom: 12, paddingHorizontal: 11, paddingTop: 10 },
  newsImage: { width: '100%', height: (SCREEN_WIDTH - 22) * 0.56 },
  newsGame: { color: C.muted, marginTop: 13, fontSize: 13 },
  newsTitle: { color: C.text, fontSize: 20, fontWeight: '600', marginTop: 10 },
  newsDescription: { color: '#a9b4bf', fontSize: 14, lineHeight: 20, marginTop: 8 },
  newsTime: { color: '#87929f', fontSize: 11, marginTop: 11, letterSpacing: 0.8 },
  newsActions: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 25, paddingBottom: 17 },
  newsAction: { flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 50 },
  newsActionText: { color: '#8e939c', fontSize: 12 },
  wishlistIntro: { flexDirection: 'row', alignItems: 'center', gap: 15, paddingHorizontal: 15, paddingTop: 14, paddingBottom: 23 },
  wishlistIntroText: { color: C.text, fontSize: 18, lineHeight: 25, flex: 1 },
  wishlistControls: { marginHorizontal: 8, marginBottom: 11 },
  wishlistSearch: { height: 43, borderRadius: 3, borderColor: '#485463', borderWidth: 1, backgroundColor: '#35404f', paddingHorizontal: 13, color: C.text, fontSize: 14 },
  wishlistOptionsRow: { flexDirection: 'row', gap: 10, marginTop: 9 },
  optionBox: { height: 40, backgroundColor: '#3b404c', justifyContent: 'center', paddingHorizontal: 9 },
  optionText: { color: C.text, fontSize: 12 },
  wishlistCard: { backgroundColor: '#1d3148', marginHorizontal: 8, marginBottom: 12, padding: 12 },
  wishlistCardTop: { minHeight: 29, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  demoBadge: { backgroundColor: '#4dbb4f', color: '#173719', paddingHorizontal: 8, paddingVertical: 6, fontSize: 12 },
  removeButton: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: '#dc3c20', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 3 },
  removeText: { color: '#fff', fontSize: 12 },
  wishlistGameImage: { width: '100%', height: (SCREEN_WIDTH - 40) * 0.468 },
  wishlistGameTitle: { color: C.text, fontSize: 19, marginTop: 7, marginBottom: 8 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 9 },
  plusButton: { backgroundColor: '#334c67', borderColor: '#486581', borderWidth: 1, padding: 4 },
  detailMuted: { color: '#8394a6', fontSize: 11, marginBottom: 9 },
  detailValue: { color: '#bcc6d1' },
  cartRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 4, backgroundColor: '#15293e' },
  cartPrice: { color: C.text, fontSize: 17, paddingHorizontal: 12 },
  cartButton: { backgroundColor: C.green, paddingVertical: 9, paddingHorizontal: 13, borderRadius: 3 },
  cartButtonText: { color: '#fff', fontSize: 15 },
  emptyWishlist: { color: C.muted, textAlign: 'center', padding: 30, lineHeight: 23 },
  footer: { paddingHorizontal: 35, paddingTop: 32, paddingBottom: 60 },
  footerGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  footerColumn: { width: '50%', marginBottom: 22, gap: 13 },
  footerHeading: { color: '#b1b6bd', fontSize: 13, fontWeight: 'bold', marginBottom: 6 },
  footerLink: { color: '#8f97a2', fontSize: 12 },
  footerLogo: { color: '#a6afb8', fontSize: 21, fontWeight: 'bold', marginTop: 20 },
  footerCopy: { color: C.muted, fontSize: 11, marginTop: 18, lineHeight: 17 },
  accountHero: { height: 159, backgroundColor: '#26352f', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18 },
  accountBack: { marginRight: 11 },
  accountName: { color: C.text, fontWeight: 'bold', fontSize: 19 },
  profileButton: { backgroundColor: '#2b343d', alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 16, marginTop: 12, borderRadius: 4 },
  profileButtonText: { color: C.text, fontWeight: 'bold' },
  accountStats: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 18, paddingTop: 18, paddingBottom: 18, gap: 10 },
  statBox: { flex: 1, minWidth: 85, backgroundColor: '#2d3038', alignItems: 'center', paddingVertical: 14, borderRadius: 4 },
  statNumber: { color: C.text, fontSize: 17 },
  statLabel: { color: '#92959c', fontSize: 14 },
  addFriends: { width: '100%', height: 46, alignItems: 'center', justifyContent: 'center', gap: 12, flexDirection: 'row', backgroundColor: '#2196f3', marginTop: 2, borderRadius: 4 },
  addFriendsText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  myContent: { color: '#9a9da5', backgroundColor: '#2c2f37', paddingHorizontal: 18, paddingVertical: 15, letterSpacing: 1.2, fontSize: 13 },
  accountRow: { minHeight: 53, backgroundColor: '#2c2f37', paddingHorizontal: 18, paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#353942', flexDirection: 'row', alignItems: 'center' },
  accountRowText: { color: C.text, fontSize: 17, fontWeight: '600' },
  accountSubText: { color: '#9298a3', marginTop: 3, fontSize: 13 },
  bottomBar: { backgroundColor: C.header, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  bottomIcon: { flex: 1, alignItems: 'center', justifyContent: 'center', height: 58 },
});
