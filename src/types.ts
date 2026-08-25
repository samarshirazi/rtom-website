export type Category = 'all' | 'mutton' | 'chicken' | 'beef' | 'sides' | 'drinks';

export type VariationOption = {
  id: string;
  name: string;
  priceDelta: number;
};

export type VariationGroup = {
  id: string;
  name: string;
  required: boolean;
  options: VariationOption[];
};

export type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  dietary: 'mutton' | 'chicken' | 'beef' | 'veg' | 'halal';
  isBestSeller?: boolean;
  portionSize: string;
  prepTimeMinutes?: number;
  variationGroups?: VariationGroup[];
};

export type CartItem = {
  cartId: string;
  dishId: string;
  name: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  selectedOptions: { groupId: string; groupName: string; optionId: string; optionName: string; priceDelta: number }[];
  portionSize: string;
  itemTotal: number;
  image: string;
};

export type ServiceStyle = 'buffet' | 'individual' | 'live-bbq-pit';

export type CateringEstimate = {
  guestCount: number;
  meats: string[];
  sides: string[];
  serviceStyle: ServiceStyle;
  estimatedPrice: number;
  perPersonPrice: number;
};
