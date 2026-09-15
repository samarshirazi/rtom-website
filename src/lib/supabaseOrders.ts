// Supabase Direct Order Integration for RTOM Brand
// Syncs customer orders directly into the shared Delivery Guru / RTOM backend
// (https://wiszrmkaddpvxghizymi.supabase.co) under brand: 'rtom'.
// Automatically feeds into:
// 1. Operations & Admin Orders Board for the selected delivery date
// 2. Kitchen Prep Sheets for Chef Sam
// 3. Delivery Routes & Stops for Rider Dispatch

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://wiszrmkaddpvxghizymi.supabase.co';

export const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indpc3pybWthZGRwdnhnaGl6eW1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDMwNTM3MSwiZXhwIjoyMDg1ODgxMzcxfQ.lFkEgmAEviTOD6hZ5E53_wlMdsMGBcoH8rRz74qOH1E';

// Active Supabase Dish UUIDs assigned to Chef Sam under brand: 'rtom'
export const SUPABASE_DISH_MAP: Record<string, string> = {
  'rtom-lamb-shank': '8626cb5f-58d5-4317-ab52-4b1726b10fd0',
  'rtom-whole-leg-chicken': '0c614cf5-5352-4dad-aa0d-a603c185e634',
  'rtom-leg-of-lamb': '64726a02-6fbd-4096-957e-cc0a0282707d',
  'rtom-beef-short-ribs-mac': '7b6b96b3-9b0a-4000-85b7-856a5b6198ff',
  'rtom-brisket-mac': '9b2a25f5-fd56-40ba-b092-befed1182f24',
  'rtom-beef-shank-mac': '0b33ac6d-c6e5-4801-879d-953f0309950f',
  'rtom-extra-rice': '5a112f1a-1c85-49be-b296-94c385f03cd8',
  'rtom-extra-mac': '58b36edf-8cc6-46b4-bff9-566ea8da95dc',
  'rtom-garlic-toum': '1b90444e-d30a-4741-8b82-e19352e625ae',
  'rtom-meat-jus': '16e71154-5834-4db4-9e41-93aebd888cfe',
};

// Delivery slots in Supabase
export const DINNER_SLOT_ID = '47d72ca1-1a6a-42f9-8985-fda83a2f61b8';
export const LUNCH_SLOT_ID = '5cf343f0-7d9a-4d55-8419-b1d73d756473';

export type OrderItemPayload = {
  dishId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  selectedOptions?: { optionName: string }[];
};

export type SupabaseOrderPayload = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryDate: string; // YYYY-MM-DD or readable string
  timeSlot: string;
  items: OrderItemPayload[];
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  notes?: string;
};

function normalizeDigits(raw: string): string {
  return String(raw || '').replace(/\D/g, '');
}

function parseDeliveryDateISO(dateStr: string): string {
  if (!dateStr || dateStr.toLowerCase().includes('today')) {
    return new Date().toISOString().slice(0, 10);
  }
  // If already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  // Try parsing date string like "Friday, Sep 18"
  try {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }
  } catch {
    // fallback to today
  }
  return new Date().toISOString().slice(0, 10);
}

/**
 * Inserts order directly into Supabase (profiles, addresses, orders, order_items)
 * Fire-and-forget safe: will never throw unhandled errors.
 */
export async function pushOrderToSupabase(
  payload: SupabaseOrderPayload
): Promise<{ orderId?: string; error?: string }> {
  try {
    const digits = normalizeDigits(payload.customerPhone);
    const last10 = digits.length >= 10 ? digits.slice(-10) : digits;
    const cleanPhone = digits.length > 0 ? digits : '0000000000';
    const deliveryDateISO = parseDeliveryDateISO(payload.deliveryDate);

    // 1. Find or create Customer Profile
    let userId: string | null = null;
    if (last10.length >= 7) {
      const checkRes = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?brand=eq.rtom&phone=ilike.*${last10}*&select=id`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      );
      if (checkRes.ok) {
        const found = await checkRes.json();
        if (Array.isArray(found) && found.length > 0) {
          userId = found[0].id;
        }
      }
    }

    if (!userId) {
      // Create auth user + profile
      const pseudoEmail = `phone${cleanPhone}@rtom.deliveryguru.local`;
      const createAuthRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: pseudoEmail,
          password: `RtomGuest!${Math.random().toString(36).slice(-8)}`,
          email_confirm: true,
          user_metadata: { full_name: payload.customerName || 'RTOM Guest' },
        }),
      });

      if (createAuthRes.ok) {
        const authData = await createAuthRes.json();
        userId = authData?.id || authData?.user?.id;
      }

      if (userId) {
        await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
          method: 'POST',
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates',
          },
          body: JSON.stringify({
            id: userId,
            full_name: payload.customerName || 'RTOM Guest',
            phone: cleanPhone,
            role: 'customer',
            brand: 'rtom',
            dietary_preference: 'non-veg',
            customer_status: 'regular',
          }),
        });
      }
    }

    // Fallback user if auth creation fails
    if (!userId) {
      console.warn('[Supabase Order] Could not resolve customer profile ID');
      return { error: 'Customer profile setup skipped' };
    }

    // 2. Create Address record
    const addrRes = await fetch(`${SUPABASE_URL}/rest/v1/addresses`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        user_id: userId,
        label: 'Delivery Address',
        line1: payload.customerAddress || 'Edmonton, AB',
        city: 'Edmonton',
        state: 'AB',
        country: 'CA',
        is_default: true,
      }),
    });

    let addressId: string | null = null;
    if (addrRes.ok) {
      const addrs = await addrRes.json();
      addressId = addrs[0]?.id;
    }

    if (!addressId) {
      console.warn('[Supabase Order] Address creation failed');
      return { error: 'Address creation failed' };
    }

    // 3. Create Order
    const notesSummary = [
      `Website Quick-Order`,
      payload.notes || '',
      `Phone: ${payload.customerPhone}`,
      `Time Window: ${payload.timeSlot}`,
    ]
      .filter(Boolean)
      .join(' | ');

    const orderRes = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        user_id: userId,
        brand: 'rtom',
        delivery_date: deliveryDateISO,
        slot_id: (payload.timeSlot || '').toLowerCase().includes('lunch')
          ? LUNCH_SLOT_ID
          : DINNER_SLOT_ID,
        address_id: addressId,
        status: 'confirmed',
        notes: notesSummary,
        total_amount: payload.grandTotal,
      }),
    });

    if (!orderRes.ok) {
      const errText = await orderRes.text();
      console.warn('[Supabase Order] Failed to insert order:', errText);
      return { error: errText };
    }

    const createdOrders = await orderRes.json();
    const orderId = createdOrders[0]?.id;

    if (!orderId) {
      return { error: 'No order ID returned' };
    }

    // 4. Create Order Items
    const isUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const itemsToInsert = payload.items.map((item) => {
      const dishUuid = isUuid(item.dishId) ? item.dishId : (SUPABASE_DISH_MAP[item.dishId] || null);
      const variationLabel = item.selectedOptions
        ?.map((opt) => opt.optionName)
        .join(', ');

      return {
        order_id: orderId,
        dish_id: dishUuid,
        dish_name: item.name,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        variation_label: variationLabel || null,
      };
    });

    if (itemsToInsert.length > 0) {
      await fetch(`${SUPABASE_URL}/rest/v1/order_items`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemsToInsert),
      });
    }

    console.log(`[Supabase Order] Successfully synced order #${orderId.slice(0, 8)} for ${deliveryDateISO}`);
    return { orderId };
  } catch (err: any) {
    console.warn('[Supabase Order] Non-blocking push error:', err);
    return { error: err?.message || 'Unknown error' };
  }
}
