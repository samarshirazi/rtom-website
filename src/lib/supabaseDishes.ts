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
  'mac-cheese': '/images/dishes/extra-mac-bowl.jpg',
  'spiced-rice': '/images/dishes/extra-spiced-rice.jpg',
  'garlic-toum': '/images/dishes/garlic-toum.jpg',
};

function resolveFallbackImage(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('rice')) return LOCAL_IMAGE_MAP['spiced-rice'];
  if (n.includes('mac')) return LOCAL_IMAGE_MAP['mac-cheese'];
  if (n.includes('toum') || n.includes('garlic')) return LOCAL_IMAGE_MAP['garlic-toum'];
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


  const category = (['mutton', 'chicken', 'beef', 'sides', 'drinks'].includes(row.category)
    ? row.category
    : ['mutton', 'chicken', 'beef', 'sides', 'drinks'].includes(row.dietary_type)
    ? row.dietary_type
    : lowerName.includes('rice') || lowerName.includes('mac') || lowerName.includes('toum')
    ? 'sides'
    : lowerName.includes('chicken')
    ? 'chicken'
    : lowerName.includes('beef') || lowerName.includes('brisket') || lowerName.includes('rib')
    ? 'beef'
    : 'mutton') as 'mutton' | 'chicken' | 'beef' | 'sides';

  return {
    id: String(row.id),
    name,
    description: String(row.description || ''),
    price: Number(row.base_price || 0),
    image: row.image_url || resolveFallbackImage(name),
    category,
    dietary: (category === 'sides' ? 'veg' : category) as 'mutton' | 'chicken' | 'beef' | 'veg' | 'halal',
    isBestSeller: !isLegOfLamb && !lowerName.includes('beef shank'),
    portionSize: isLegOfLamb ? 'Whole Leg (Serves a Group)' : 'Per Person',
    prepTimeMinutes: isLegOfLamb ? 30 : lowerName.includes('chicken') ? 20 : 25,
    deliveryType: isSameDay ? 'same-day' : 'pre-order',
    leadTimeDays: row.lead_time_days ?? (isSameDay ? 0 : 1),
    availableDays: Array.isArray(row.available_days) && row.available_days.length > 0
      ? row.available_days
      : (isLegOfLamb ? [6, 7] : [1, 2, 3, 4, 5, 6, 7]),
    variationGroups,
  };
}

/**
 * Fetch live active dishes for RTOM from Supabase.
 * Returns FALLBACK_DISHES if network or request fails.
 * Automatically sorts dishes by maximum availability of days (daily/same-day first, weekend-only last).
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

    // Sort by maximum availability of number of days (7 days before 2 days)
    // with Same-Day dishes prioritized at the very top.
    liveDishes.sort((a, b) => {
      const aDays = a.availableDays?.length ?? 7;
      const bDays = b.availableDays?.length ?? 7;
      if (bDays !== aDays) return bDays - aDays;

      const aSameDay = a.deliveryType === 'same-day' ? 1 : 0;
      const bSameDay = b.deliveryType === 'same-day' ? 1 : 0;
      if (bSameDay !== aSameDay) return bSameDay - aSameDay;

      return a.name.localeCompare(b.name);
    });

    console.log(`[Supabase Dishes] Successfully loaded and sorted ${liveDishes.length} live dishes by availability`);
    return liveDishes;
  } catch (err) {
    console.warn('[Supabase Dishes] Could not fetch live dishes, using fallback:', err);
    return FALLBACK_DISHES;
  }
}

export interface DeliverySlotRow {
  id: string;
  label: string;
  start_time: string;
  end_time: string;
  cutoff_hours: number;
  active_days: number[];
  is_active: boolean;
}

export async function fetchLiveDeliverySlots(): Promise<DeliverySlotRow[]> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/delivery_slots?select=id,label,start_time,end_time,cutoff_hours,active_days,is_active&is_active=eq.true&order=start_time.asc`;
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    if (!res.ok) {
      return [];
    }
    const rows = await res.json();
    return Array.isArray(rows) ? rows : [];
  } catch (err) {
    console.warn('[Supabase Slots] Could not fetch live slots:', err);
    return [];
  }
}

export const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indpc3pybWthZGRwdnhnaGl6eW1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDMwNTM3MSwiZXhwIjoyMDg1ODgxMzcxfQ.lFkEgmAEviTOD6hZ5E53_wlMdsMGBcoH8rRz74qOH1E';

export const BUSINESS_TIMEZONE = 'America/Edmonton';

export function getBusinessDateISO(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: BUSINESS_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/**
 * Fetch live same-day cooking stock from same_day_dish_stock for today (or specified date).
 * Returns Record<dish_id, units_remaining>.
 */
export async function fetchLiveSameDayStock(dateIso?: string): Promise<Record<string, number>> {
  try {
    const today = dateIso || getBusinessDateISO();
    const url = `${SUPABASE_URL}/rest/v1/same_day_dish_stock?delivery_date=eq.${encodeURIComponent(today)}&select=dish_id,units_remaining`;
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    if (!res.ok) {
      console.warn(`[Supabase Stock] Status ${res.status}`);
      return {};
    }

    const rows = await res.json();
    if (!Array.isArray(rows)) return {};

    const stockMap: Record<string, number> = {};
    for (const r of rows) {
      if (r.dish_id && typeof r.units_remaining === 'number') {
        stockMap[String(r.dish_id)] = r.units_remaining;
      }
    }
    return stockMap;
  } catch (err) {
    console.warn('[Supabase Stock] Could not fetch live stock:', err);
    return {};
  }
}
