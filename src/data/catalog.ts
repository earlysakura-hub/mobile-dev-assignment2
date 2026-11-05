import type { ImageSourcePropType } from 'react-native';

// All images come from the six Steam reference screenshots.
export const ART = {
  avatar: require('../../assets/steam/avatar.jpg'),
  phantom: require('../../assets/steam/phantom.jpg'),
  leaf: require('../../assets/steam/leaf.jpg'),
  apex: require('../../assets/steam/apex.jpg'),
  cities: require('../../assets/steam/cities.jpg'),
  wukong: require('../../assets/steam/wukong.jpg'),
  ace: require('../../assets/steam/ace.jpg'),
};

export type Game = {
  id: string;
  title: string;
  image: ImageSourcePropType;
  price: number;
  releaseDate: string;
  reviews: string;
  badge?: string;
};

export const GAMES: Game[] = [
  { id: 'wukong', title: 'Black Myth: Wukong', image: ART.wukong, price: 79.99,
    releaseDate: 'AUG 19, 2024', reviews: 'VERY POSITIVE' },
  { id: 'ace', title: 'Ace Attorney Investigations Collection', image: ART.ace,
    price: 59.99, releaseDate: 'SEP 5, 2024', reviews: 'OVERWHELMINGLY POSITIVE',
    badge: 'Demo Available' },
  { id: 'phantom', title: 'Phantom Blade Zero', image: ART.phantom,
    price: 79.99, releaseDate: 'COMING SOON', reviews: 'VERY POSITIVE' },
];

export type NewsItem = { id: string; game: string; title: string; description: string; image: ImageSourcePropType; time: string };
export const NEWS: NewsItem[] = [
  { id: 'apex', game: 'Apex Legends™', title: 'Apex Legends | Godzilla Event',
    description: 'Fight your rivals in the destruction left in Godzilla’s wake, or dodge its attacks to claim a piece of its power.',
    image: ART.apex, time: '51 MINUTES AGO' },
  { id: 'cities', game: 'Cities: Skylines', title: 'Cities: Skylines — New Content',
    description: 'Discover new holiday getaways, neighborhoods, and more.',
    image: ART.cities, time: '2 HOURS AGO' },
];
