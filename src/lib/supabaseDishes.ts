import type { Dish, VariationGroup } from '../types';
import { DISHES as FALLBACK_DISHES } from '../data/dishes';

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://wiszrmkaddpvxghizymi.supabase.co';

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indpc3pybWthZGRwdnhnaGl6eW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMDUzNzEsImV4cCI6MjA4NTg4MTM3MX0.SSC1DMfAia9uo8ahxgPunlAI4Lpzpdr2GhXB5Cc2F8U';

// Fallback image map
const LOCAL_IMAGE_MAP: Record<string, string> = {
  'lamb-shank': '/images/dishes/lamb-shank.jpg',
  'chicken': '/images/dishes/whole-leg-chicken.jpg',
  'leg-of-lamb': '/images/dishes/leg-of-lamb.jpg',
  'short-ribs': '/images/dishes/beef-short-ribs-mac.jpg',
  'brisket': '/images/dishes/brisket-mac.jpg',
  'beef-shank': '/images/dishes/beef-shank-mac.jpg',
};

function resolveFallbackImage(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('chicken')) return LOCAL_IMAGE_MAP['chicken'];
  if (n.includes('leg of lamb')) return LOCAL_IMAGE_MAP['leg-of-lamb'];
  if (n.includes('short rib')) return LOCAL_IMAGE_MAP['short-ribs'];
  if (n.includes('brisket')) return LOCAL_IMAGE_MAP['brisket'];
  if (n.includes('beef shank')) return LOCAL_IMAGE_MAP['beef-shank'];
  return LOCAL_IMAGE_MAP['lamb-shank'];
}

// Map Supabase dish row to website Dish model
function mapSupabaseDish(row: any): Dish {
  const name = String(row.name || '').trim();
  const lowerName = name.toLowerCase();

  const isLeadTimeZero = typeof row.lead_time_days === 'number' ? row.lead_time_days === 0 : null;
  const isSameDay =
    isLeadTimeZero !== null
      ? isLeadTimeZero
      : ((lowerName.includes('lamb shank') && !lowerName.includes('beef shank')) ||
         lowerName.includes('chicken'));

  const isLegOfLamb = lowerName.includes('leg of lamb');

  // Map Variation Groups
  const variationGroups: VariationGroup[] = [];

  if (Array.isArray(row.dish_variation_groups) && row.dish_variation_groups.length > 0) {
    for (const g of row.dish_variation_groups) {
      const opts = Array.isArray(g.dish_variation_options)
        ? g.dish_variation_options.map((o: any) => ({
            id: String(o.id),
            name: String(o.name),
            priceDelta: Number(o.price_delta || 0),
          }))
        : [];

      if (opts.length > 0) {
        variationGroups.push({
          id: String(g.id),
          name: String(g.name || 'Choose Your Base Pairing'),
          required: Boolean(g.is_required),
          options: opts,
        });
      }
    }
  }

  // Always provide the standard add-on options group if only base is configured
  if (!variationGroups.some((g) => g.name.toLowerCase().includes('add-on') || g.name.toLowerCase().includes('upgrade'))) {
    if (isLegOfLamb) {
      variationGroups.push({
        id: 'side-upgrade',
        name: 'Optional Feast Upgrade',
        required: false,
        options: [
          { id: 'none', name: 'Standard Communal Platter', priceDelta: 0 },
          { id: 'double-sides', name: 'Both Rice & Mac & Cheese Platters', priceDelta: 19.99 },
          { id: 'garlic-toum-large', name: 'Large House Garlic Toum Jar', priceDelta: 6.99 },
        ],
      });
    } else {
      variationGroups.push({
        id: 'side-upgrade',
        name: 'Optional Add-on / Extra Side',
        required: false,
        options: [
          { id: 'none', name: 'No Extra Add-on', priceDelta: 0 },
          { id: 'extra-rice', name: 'Extra Spiced Basmati Rice Bowl', priceDelta: 4.99 },
          { id: 'extra-mac', name: 'Extra Mac & Cheese', priceDelta: 5.99 },
          { id: 'garlic-toum', name: 'House-Whipped Garlic Toum', priceDelta: 2.99 },
        ],
      });
    }
  }

  const category = (['mutton', 'chicken', 'beef'].includes(row.dietary_type)
    ? row.dietary_type
    : lowerName.includes('chicken')
    ? 'chicken'
    : lowerName.includes('beef') || lowerName.includes('brisket') || lowerName.includes('rib')
    ? 'beef'
    : 'mutton') as 'mutton' | 'chicken' | 'beef';

  return {
    id: String(row.id),
    name,
    description: String(row.description || ''),
    price: Number(row.base_price || 0),
    image: row.image_url || resolveFallbackImage(name),
    category,
    dietary: category,
    isBestSeller: !isLegOfLamb && !lowerName.includes('beef shank'),
    portionSize: isLegOfLamb ? 'Whole Leg (Serves a Group)' : 'Per Person',
    prepTimeMinutes: isLegOfLamb ? 30 : lowerName.includes('chicken') ? 20 : 25,
    deliveryType: isSameDay ? 'same-day' : 'pre-order',
    variationGroups,
  };
}

/**
 * Fetch live active dishes for RTOM from Supabase.
 * Returns FALLBACK_DISHES if network or request fails.
 */
export async function fetchLiveDishes(): Promise<Dish[]> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/dishes?brand=eq.rtom&is_active=eq.true&select=id,name,description,base_price,dietary_type,category,image_url,lead_time_days,available_days,dish_variation_groups(id,name,is_required,max_select,dish_variation_options(id,name,price_delta,is_default))&order=created_at.asc`;

    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!res.ok) {
      console.warn(`[Supabase Dishes] Status ${res.status}, using static fallback`);
      return FALLBACK_DISHES;
    }

    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      return FALLBACK_DISHES;
    }

    const liveDishes = rows.map(mapSupabaseDish);
    console.log(`[Supabase Dishes] Successfully loaded ${liveDishes.length} live dishes from database`);
    return liveDishes;
  } catch (err) {
    console.warn('[Supabase Dishes] Could not fetch live dishes, using fallback:', err);
    return FALLBACK_DISHES;
  }
}
