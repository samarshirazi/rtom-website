// GoHighLevel (GHL) Lead & Order Capture Service
// Mirrors patterns from sibling repo delivery-guru with non-blocking fire-and-forget calls.

const GHL_API_BASE = 'https://services.leadconnectorhq.com';
const GHL_API_VERSION = '2021-07-28';

const LOCATION_ID = import.meta.env.VITE_GHL_LOCATION_ID || 'vbaHDSiuqbKNonTWfc3v';
const API_TOKEN = import.meta.env.VITE_GHL_API_TOKEN || 'pit-71888f10-aaad-4772-8c9c-680643d353ea';
const PIPELINE_ID = import.meta.env.VITE_GHL_PIPELINE_ID || '6we0uv8LHts7BaahbySK';
const STAGE_NEW_LEAD = import.meta.env.VITE_GHL_STAGE_NEW_LEAD || '9a98c236-9d38-4fcb-95db-483f5eb0cdb3';
const WEBHOOK_URL = import.meta.env.VITE_GHL_WEBHOOK_URL || '';

function splitName(fullName: string): { firstName: string; lastName: string } {
  const clean = (fullName || '').trim();
  if (!clean) return { firstName: 'BBQ Guest', lastName: '' };
  const parts = clean.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

export type GhlOrderPayload = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryDate: string;
  timeSlot: string;
  itemsSummary: string;
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  deliveryType?: 'same-day' | 'pre-order';
};

export type GhlCateringPayload = {
  guestCount?: number;
  selectedMeats?: string[];
  selectedSides?: string[];
  serviceStyle?: string;
  totalPrice?: number;
  perPersonPrice?: number;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
};

/**
 * Capture BBQ Cart Order in GoHighLevel (Contacts & Opportunities)
 */
export async function pushOrderToGhl(payload: GhlOrderPayload): Promise<void> {
  const { firstName, lastName } = splitName(payload.customerName);

  const tags = [
    'rtom-order',
    'rtom-whatsapp-order',
    'waiting-admin-approval',
    'status:pending-approval',
    'source:website-whatsapp',
    'edmonton',
    payload.deliveryType === 'same-day' ? 'delivery:same-day' : 'delivery:pre-order',
  ];

  const contactBody = {
    locationId: LOCATION_ID,
    firstName,
    lastName,
    phone: payload.customerPhone,
    address1: payload.customerAddress,
    city: 'Edmonton',
    state: 'AB',
    country: 'CA',
    tags,
  };

  // 1. Optional Inbound Webhook (GHL Automation Workflow trigger for instant SMS/alert)
  if (WEBHOOK_URL) {
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'whatsapp_order_pending_approval',
        needs_admin_approval: true,
        ...payload,
        tags,
      }),
    }).catch((err) => console.warn('[GHL Webhook] Error:', err));
  }

  // 2. Direct GHL REST API Upsert (Fire-and-forget)
  if (LOCATION_ID && API_TOKEN) {
    try {
      const res = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Version': GHL_API_VERSION,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(contactBody),
      });

      if (res.ok) {
        const json = await res.json().catch(() => ({}));
        const contactId = json?.contact?.id || json?.id;

        // If pipeline configured, create an Opportunity marked PENDING APPROVAL
        if (contactId && PIPELINE_ID && STAGE_NEW_LEAD) {
          await fetch(`${GHL_API_BASE}/opportunities`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${API_TOKEN}`,
              'Version': GHL_API_VERSION,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              pipelineId: PIPELINE_ID,
              pipelineStageId: STAGE_NEW_LEAD,
              locationId: LOCATION_ID,
              contactId,
              name: `🔥 PENDING APPROVAL (WhatsApp): ${payload.customerName} ($${payload.grandTotal.toFixed(2)})`,
              status: 'open',
              monetaryValue: payload.grandTotal,
            }),
          }).catch((err) => console.warn('[GHL Opportunity] Error:', err));
        }
      } else {
        const text = await res.text().catch(() => '');
        console.warn(`[GHL] Upsert notice (${res.status}): ${text.slice(0, 150)}`);
      }
    } catch (err) {
      console.warn('[GHL] Non-blocking push skipped:', err);
    }
  }
}

/**
 * Capture Catering Inquiry in GoHighLevel
 */
export async function pushCateringToGhl(payload: GhlCateringPayload): Promise<void> {
  const { firstName, lastName } = splitName(payload.customerName || 'Catering Guest');

  const tags = [
    'rtom-catering-lead',
    'source:website-estimator',
    'edmonton',
    `guests:${payload.guestCount}`,
    `service:${payload.serviceStyle}`,
  ];

  if (WEBHOOK_URL) {
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'catering_inquiry',
        ...payload,
        tags,
      }),
    }).catch(() => {});
  }

  if (LOCATION_ID && API_TOKEN) {
    try {
      await fetch(`${GHL_API_BASE}/contacts/upsert`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Version': GHL_API_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locationId: LOCATION_ID,
          firstName,
          lastName,
          phone: payload.customerPhone || undefined,
          tags,
        }),
      });
    } catch (err) {
      console.warn('[GHL Catering] Non-blocking push skipped:', err);
    }
  }
}
