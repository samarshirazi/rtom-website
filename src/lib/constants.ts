export const BUSINESS_PHONE_DISPLAY = '(825) 250-8534';
export const BUSINESS_PHONE_RAW = '18252508534';
export const BUSINESS_TEL = 'tel:18252508534';
export const BUSINESS_WHATSAPP = 'https://wa.me/18252508534';

export const GOOGLE_MAPS_DEFAULT_KEY = 'AIzaSyDEGz9diqH7nTTkWWpuIhlQGrkqyCYGSb8';

export const RTOM_APP_URL = 'https://app.rtombbq.ca';

export function getAppDishUrl(dishId?: string): string {
  if (!dishId) return RTOM_APP_URL;
  return `${RTOM_APP_URL}/?dish=${encodeURIComponent(dishId)}`;
}
