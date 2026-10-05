export const META_PIXEL_ID = '498806323226092';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

/**
 * Safely trigger an event using the Meta Pixel (fbq).
 */
export function trackMetaEvent(
  eventName: string,
  parameters: Record<string, any> = {},
  options?: Record<string, any>
) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    try {
      if (options) {
        window.fbq('track', eventName, parameters, options);
      } else {
        window.fbq('track', eventName, parameters);
      }
    } catch (err) {
      console.warn('[Meta Pixel] Error tracking event:', eventName, err);
    }
  }
}

/**
 * Safely trigger a custom event using the Meta Pixel (fbq).
 */
export function trackMetaCustomEvent(eventName: string, parameters: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    try {
      window.fbq('trackCustom', eventName, parameters);
    } catch (err) {
      console.warn('[Meta Pixel] Error tracking custom event:', eventName, err);
    }
  }
}

/**
 * Track standard PageView (helpful for SPA route/view changes)
 */
export function trackPageView(pageName?: string) {
  trackMetaEvent('PageView', pageName ? { page_name: pageName } : {});
}

/**
 * Track ViewContent when customer views a dish or menu item
 */
export function trackViewContent(dish: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) {
  trackMetaEvent('ViewContent', {
    content_name: dish.name,
    content_ids: [dish.id],
    content_type: 'product',
    content_category: dish.category || 'BBQ',
    value: dish.price,
    currency: 'CAD',
  });
}

/**
 * Track AddToCart when customer adds an item
 */
export function trackAddToCart(item: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) {
  trackMetaEvent('AddToCart', {
    content_name: item.name,
    content_ids: [item.id],
    content_type: 'product',
    value: item.price * item.quantity,
    currency: 'CAD',
    num_items: item.quantity,
  });
}

/**
 * Track InitiateCheckout when customer opens cart / proceeds to order
 */
export function trackInitiateCheckout(
  items: Array<{ dishId: string; name: string; unitPrice: number; quantity: number }>,
  totalValue: number
) {
  trackMetaEvent('InitiateCheckout', {
    content_ids: items.map((i) => i.dishId),
    content_type: 'product',
    value: totalValue,
    currency: 'CAD',
    num_items: items.reduce((sum, i) => sum + i.quantity, 0),
  });
}

/**
 * Track Purchase when customer submits an order
 */
export function trackPurchase(order: {
  orderId?: string;
  items: Array<{ dishId?: string; name: string; unitPrice?: number; quantity: number }>;
  totalValue: number;
  currency?: string;
}) {
  trackMetaEvent('Purchase', {
    content_ids: order.items.map((i) => i.dishId || i.name),
    content_type: 'product',
    value: order.totalValue,
    currency: order.currency || 'CAD',
    num_items: order.items.reduce((sum, i) => sum + i.quantity, 0),
  });
}

/**
 * Track Lead when customer submits catering inquiry or high-intent lead form
 */
export function trackLead(leadType: string, details?: Record<string, any>) {
  trackMetaEvent('Lead', {
    content_category: leadType,
    ...details,
  });
}
