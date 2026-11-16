import { Product } from '@/types';

export const images = {
  peugeot: require('../../assets/images/products/peugeot-lr01.png'),
  electric: require('../../assets/images/products/electric-bike.png'),
  helmet: require('../../assets/images/products/smith-helmet.png'),
};

export const categoryIcons = {
  electric: require('../../assets/images/icons/ebike.png'),
  road: require('../../assets/images/icons/road.png'),
  mountain: require('../../assets/images/icons/mountain.png'),
  helmet: require('../../assets/images/icons/helmet.png'),
};

export const products: Product[] = [
  {
    id: '1',
    name: 'LR01',
    brand: 'PEUGEOT',
    price: 1999.99,
    originalPrice: 2857.13,
    image: images.peugeot,
    category: 'road',
    label: 'Road Bike',
    discount: 30,
    description:
      'The LR01 uses the same design as the most iconic bikes from PEUGEOT Cycles’ 130-year history and combines it with agile, dynamic performance that’s perfectly suited to navigating today’s cities. As well as a lugged steel frame and iconic PEUGEOT black-and-white chequer design, this city bike also features a 16-speed Shimano Claris drivetrain.',
  },
  {
    id: '2',
    name: 'Trade',
    brand: 'SMITH',
    price: 120,
    image: images.helmet,
    category: 'helmet',
    label: 'Road Helmet',
    description: 'Premium road helmet with advanced ventilation and MIPS technology.',
  },
  {
    id: '3',
    name: 'CHROMOLY 520',
    brand: 'PILOT',
    price: 3999.99,
    // TODO: export the black PILOT bike from Figma and use it here.
    image: images.electric,
    category: 'road',
    label: 'Road Bike',
    description: 'High-end chromoly steel frame built for endurance and comfort.',
  },
  {
    id: '4',
    name: 'Trade',
    brand: 'SMITH',
    price: 120,
    image: images.helmet,
    category: 'helmet',
    label: 'Road Helmet',
    description: 'Lightweight and aerodynamic design.',
  },
];

export const formatPrice = (value: number) =>
  `$ ${value.toLocaleString('en-US', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
