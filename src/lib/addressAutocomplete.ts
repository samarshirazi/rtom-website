import { useEffect, useRef, useState, type RefObject } from 'react';
import { GOOGLE_MAPS_DEFAULT_KEY } from './constants';

export type AddressAutocompleteSelection = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  formattedAddress: string;
  latitude?: number | null;
  longitude?: number | null;
};

type AddressAutocompleteStatus = 'idle' | 'ready' | 'manual' | 'error';

const GOOGLE_MAPS_SCRIPT_ID = 'rtom-google-maps-places';
const GOOGLE_MAPS_CALLBACK = '__rtomGoogleMapsPlacesInit';
const AUTOCOMPLETE_COUNTRY = 'ca';

let googleMapsPromise: Promise<any> | null = null;

function getGoogleMapsApiKey(): string {
  return (
    String(import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim() ||
    GOOGLE_MAPS_DEFAULT_KEY
  );
}

export function loadGoogleMapsPlacesApi(): Promise<any> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.reject(new Error('Google Maps Places can only load in the browser.'));
  }

  const googleMaps = (window as any).google?.maps;
  if (googleMaps?.places) return Promise.resolve(googleMaps);

  if (googleMapsPromise) return googleMapsPromise;

  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    return Promise.reject(new Error('Missing Google Maps API Key.'));
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID) as HTMLScriptElement | null;
    const cleanupGlobal = () => {
      try {
        delete (window as any)[GOOGLE_MAPS_CALLBACK];
      } catch {
        (window as any)[GOOGLE_MAPS_CALLBACK] = undefined;
      }
    };

    (window as any)[GOOGLE_MAPS_CALLBACK] = () => {
      cleanupGlobal();
      const maps = (window as any).google?.maps;
      if (maps?.places) {
        resolve(maps);
        return;
      }
      googleMapsPromise = null;
      reject(new Error('Google Maps Places loaded without the Places library.'));
    };

    const handleError = () => {
      cleanupGlobal();
      googleMapsPromise = null;
      reject(new Error('Could not load Google Maps Places.'));
    };

    if (existingScript) {
      existingScript.addEventListener('error', handleError, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.onerror = handleError;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey
    )}&libraries=places&loading=async&callback=${GOOGLE_MAPS_CALLBACK}`;
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

function getAddressComponent(components: any[], type: string) {
  return components.find((component) => Array.isArray(component?.types) && component.types.includes(type)) || null;
}

function getAddressComponentLong(components: any[], type: string) {
  return String(getAddressComponent(components, type)?.long_name || '').trim();
}

function getAddressComponentShort(components: any[], type: string) {
  return String(getAddressComponent(components, type)?.short_name || '').trim();
}

function formatPostalCode(value: string) {
  const compact = String(value || '').replace(/\s+/g, '').toUpperCase();
  if (/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(compact)) {
    return `${compact.slice(0, 3)} ${compact.slice(3)}`;
  }
  return compact;
}

function buildAddressSelection(place: any): AddressAutocompleteSelection | null {
  const components = Array.isArray(place?.address_components) ? place.address_components : [];
  const streetNumber = getAddressComponentLong(components, 'street_number');
  const route = getAddressComponentLong(components, 'route');
  const subpremise = getAddressComponentLong(components, 'subpremise');
  const premise = getAddressComponentLong(components, 'premise');
  const locality =
    getAddressComponentLong(components, 'locality') ||
    getAddressComponentLong(components, 'postal_town') ||
    getAddressComponentLong(components, 'sublocality') ||
    getAddressComponentLong(components, 'administrative_area_level_3') ||
    'Edmonton';
  const province = getAddressComponentShort(components, 'administrative_area_level_1') || 'AB';
  const postalCode = formatPostalCode(getAddressComponentLong(components, 'postal_code'));
  const line1 = [streetNumber, route].filter(Boolean).join(' ').trim() || String(place?.name || '').trim();
  const line2 = [subpremise, premise].filter(Boolean).join(', ');

  const location = place?.geometry?.location;
  const latitude = typeof location?.lat === 'function' ? location.lat() : Number(location?.lat) || null;
  const longitude = typeof location?.lng === 'function' ? location.lng() : Number(location?.lng) || null;

  if (!line1 && !place?.formatted_address) return null;

  const parts = [line1, line2, locality, province, postalCode].filter(Boolean);
  const formattedAddress = place?.formatted_address || parts.join(', ');

  return {
    line1: line1 || formattedAddress,
    line2,
    city: locality,
    state: province,
    postal_code: postalCode,
    formattedAddress,
    latitude,
    longitude,
  };
}

export function useGoogleAddressAutocomplete({
  inputRef,
  enabled = true,
  onAddressSelected,
}: {
  inputRef: RefObject<HTMLInputElement | null>;
  enabled?: boolean;
  onAddressSelected: (selection: AddressAutocompleteSelection) => void;
}): AddressAutocompleteStatus {
  const [status, setStatus] = useState<AddressAutocompleteStatus>('idle');
  const onAddressSelectedRef = useRef(onAddressSelected);

  useEffect(() => {
    onAddressSelectedRef.current = onAddressSelected;
  }, [onAddressSelected]);

  useEffect(() => {
    if (!enabled) return;

    let active = true;
    let listener: { remove?: () => void } | null = null;

    loadGoogleMapsPlacesApi()
      .then((maps) => {
        if (!active) return;
        const input = inputRef.current;
        if (!input) return;

        const autocomplete = new maps.places.Autocomplete(input, {
          componentRestrictions: { country: AUTOCOMPLETE_COUNTRY },
          fields: ['address_components', 'geometry', 'formatted_address', 'name'],
          types: ['address'],
        });

        // Focus bias towards Edmonton metro coordinates
        const edmontonBounds = new maps.LatLngBounds(
          new maps.LatLng(53.3957, -113.7137), // Southwest
          new maps.LatLng(53.6842, -113.3289)  // Northeast
        );
        autocomplete.setBounds(edmontonBounds);

        listener = autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          const selection = buildAddressSelection(place);
          if (selection) {
            onAddressSelectedRef.current(selection);
          }
        });

        setStatus('ready');
      })
      .catch((err) => {
        console.warn('[AddressAutocomplete] Google Maps Places init skipped, using manual fallback:', err);
        if (active) setStatus('manual');
      });

    return () => {
      active = false;
      listener?.remove?.();
    };
  }, [enabled, inputRef]);

  return status;
}
