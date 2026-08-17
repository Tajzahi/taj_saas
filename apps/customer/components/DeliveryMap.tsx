'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, AlertCircle, CheckCircle2, XCircle, Search, Navigation } from 'lucide-react';

// Default outlet coordinates (A6 Nyuss - Jl. Demak 253, Surabaya)
const DEFAULT_OUTLET_LAT = -7.2432537;
const DEFAULT_OUTLET_LNG = 112.7206275;

// Max delivery radius in meters
const MAX_RADIUS_M = 10000;

// Delivery zones by radius (in km)
const ZONES = [
  { maxKm: 3,  fee: 8000,  name: 'Zona 1 (0-3 km)',  color: '#22c55e' },
  { maxKm: 6,  fee: 13000, name: 'Zona 2 (3-6 km)',  color: '#f59e0b' },
  { maxKm: 10, fee: 18000, name: 'Zona 3 (6-10 km)', color: '#ef4444' },
];

// Haversine distance formula (returns meters)
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getZoneByDistance(distanceM: number) {
  const km = distanceM / 1000;
  return ZONES.find((z) => km <= z.maxKm) ?? null;
}

// ── Nominatim (OpenStreetMap) helpers ──────────────────────────────
// Reverse geocoding: (lat, lng) → human-readable address string
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=id`,
      { headers: { 'Accept-Language': 'id' } }
    );
    const data = await res.json();
    if (data?.address) {
      const a = data.address;
      const parts = [
        a.road || a.pedestrian || a.footway || '',
        a.house_number ? `No. ${a.house_number}` : '',
        a.suburb || a.neighbourhood || a.village || '',
        a.city_district || a.subdistrict || '',
        a.city || a.town || '',
      ].filter(Boolean);
      return parts.join(', ');
    }
    return data?.display_name ?? '';
  } catch {
    return '';
  }
}

// Forward geocoding: address string → first matching {lat, lng} with progressive fallback
async function forwardGeocode(query: string): Promise<{ lat: number; lng: number } | null> {
  const fetchCoords = async (q: string) => {
    try {
      const encoded = encodeURIComponent(`${q}, Surabaya, Indonesia`);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1&countrycodes=id`,
        { headers: { 'Accept-Language': 'id' } }
      );
      const data = await res.json();
      if (data?.[0]) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
    } catch {}
    return null;
  };

  // 1. Try the full query exactly as typed
  let coords = await fetchCoords(query);
  if (coords) return coords;

  // 2. Try removing specific details like house number, RT/RW, block, etc.
  // Common terms in Indonesian addresses:
  // - No. / No / Nomor followed by digits
  // - Blok / Blk / Block followed by alphanumeric
  // - RT / RW / Gang / Gg followed by digits/letters
  let cleaned = query
    .replace(/no\s*\.?\s*\d+/gi, '')
    .replace(/rt\s*\d+\s*(\/?\s*rw\s*\d+)?/gi, '')
    .replace(/rw\s*\d+/gi, '')
    .replace(/blok\s*[a-z0-9\-]+/gi, '')
    .replace(/blk\s*[a-z0-9\-]+/gi, '')
    .replace(/gg\s*\.?\s*[a-z0-9\-]+/gi, '')
    .replace(/gang\s*[a-z0-9\-]+/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleaned && cleaned !== query && cleaned.length > 5) {
    coords = await fetchCoords(cleaned);
    if (coords) return coords;
  }

  // 3. Try splitting by comma or slash and searching the first part (usually street name/neighborhood)
  const segments = query.split(/[,/]/);
  if (segments.length > 1) {
    const firstSegment = segments[0].trim();
    if (firstSegment.length > 5) {
      coords = await fetchCoords(firstSegment);
      if (coords) return coords;
    }
  }

  return null;
}

// ───────────────────────────────────────────────────────────────────

export interface DeliveryMapResult {
  lat: number;
  lng: number;
  distanceKm: number;
  zoneName: string;
  fee: number;
  isOutOfRange: boolean;
}

interface DeliveryMapProps {
  /** Called when user picks a location (click or GPS) */
  onLocationSelect: (result: DeliveryMapResult | null) => void;
  /** Called with the reverse-geocoded address after user clicks map / uses GPS */
  onAddressResolved?: (address: string) => void;
  /** When parent updates the address field, forward-geocode it and move the map */
  searchAddress?: string;
  /** Custom outlet latitude (fallback to default) */
  outletLat?: number;
  /** Custom outlet longitude (fallback to default) */
  outletLng?: number;
}

export default function DeliveryMap({
  onLocationSelect,
  onAddressResolved,
  searchAddress,
  outletLat,
  outletLng,
}: DeliveryMapProps) {
  const resolvedOutletLat = outletLat ?? DEFAULT_OUTLET_LAT;
  const resolvedOutletLng = outletLng ?? DEFAULT_OUTLET_LNG;
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const customerMarkerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);

  const [selectedResult, setSelectedResult] = useState<DeliveryMapResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'found' | 'notfound'>('idle');

  // Debounce ref for address search
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track last searched address to avoid redundant calls
  const lastSearchRef = useRef<string>('');
  // Track whether the current address update came FROM the map (to avoid loop)
  const ignoreNextSearchRef = useRef(false);

  // --- Autocomplete search bar states ---
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const autocompleteContainerRef = useRef<HTMLDivElement>(null);

  // Close suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        autocompleteContainerRef.current &&
        !autocompleteContainerRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounce API suggestions call using Photon (for autocomplete)
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingSuggestions(true);
      try {
        const queryWithCity = searchQuery.toLowerCase().includes('surabaya')
          ? searchQuery
          : `${searchQuery}, Surabaya`;
        const encoded = encodeURIComponent(queryWithCity);
        // Query Photon API biased towards outlet coordinates
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encoded}&limit=5&lat=${resolvedOutletLat}&lon=${resolvedOutletLng}`
        );
        const data = await res.json();
        if (data && Array.isArray(data.features)) {
          const formatted = data.features.map((feat: any) => {
            const p = feat.properties;
            const title = p.name || '';
            const details = [
              p.district || p.suburb || p.city_district || '',
              p.city || p.town || '',
            ].filter(Boolean).join(', ');
            
            const displayName = details ? `${title}, ${details}` : title;
            return {
              lat: feat.geometry.coordinates[1],
              lng: feat.geometry.coordinates[0],
              display_name: displayName,
            };
          });
          setSuggestions(formatted);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setSuggestions([]);
      } finally {
        setIsSearchingSuggestions(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, resolvedOutletLat, resolvedOutletLng]);

  const handleSelectSuggestion = (item: any) => {
    const lat = typeof item.lat === 'number' ? item.lat : parseFloat(item.lat);
    const lng = typeof item.lng === 'number' ? item.lng : parseFloat(item.lng);
    
    if (mapRef.current && leafletRef.current) {
      mapRef.current.setView([lat, lng], 16, { animate: true });
      placeMarker(lat, lng, leafletRef.current, true); // true = resolve address back to parent input
    }
    
    setSearchQuery(item.display_name);
    setSuggestions([]);
  };

  // ── Core: place/update customer marker ──────────────────────────
  const placeMarker = useCallback(
    async (lat: number, lng: number, L: any, resolveAddress = true) => {
      const distanceM = haversineDistance(resolvedOutletLat, resolvedOutletLng, lat, lng);
      const distanceKm = distanceM / 1000;
      const zone = getZoneByDistance(distanceM);
      const isOutOfRange = distanceM > MAX_RADIUS_M;

      const result: DeliveryMapResult = {
        lat,
        lng,
        distanceKm,
        zoneName: zone?.name ?? 'Di luar jangkauan',
        fee: zone?.fee ?? 0,
        isOutOfRange,
      };

      // Remove old customer marker
      if (customerMarkerRef.current) customerMarkerRef.current.remove();

      const customerIcon = L.divIcon({
        html: `
          <div style="
            width: 36px; height: 36px; border-radius: 50%;
            background: ${isOutOfRange ? '#ef4444' : zone?.color ?? '#3b82f6'};
            border: 3px solid white;
            box-shadow: 0 2px 12px rgba(0,0,0,0.4);
            display: flex; align-items: center; justify-content: center;
          "><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
        `,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const popup = isOutOfRange
        ? `<div style="font-size:13px;text-align:center"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:4px"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> <b>Di luar jangkauan</b><br/>Jarak: <b>${distanceKm.toFixed(2)} km</b><br/><span style="color:#ef4444">Maks. 10 km</span></div>`
        : `<div style="font-size:13px;text-align:center"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:4px"><polyline points="20 6 9 17 4 12"></polyline></svg> <b>${zone?.name}</b><br/>Jarak: <b>${distanceKm.toFixed(2)} km</b><br/>Ongkir: <b>Rp ${(zone?.fee ?? 0).toLocaleString('id-ID')}</b></div>`;

      const marker = L.marker([lat, lng], { icon: customerIcon })
        .addTo(mapRef.current)
        .bindPopup(popup)
        .openPopup();

      customerMarkerRef.current = marker;
      setSelectedResult(result);
      onLocationSelect(result);

      // Reverse geocode to fill address field (only when triggered by map interaction)
      if (resolveAddress && onAddressResolved) {
        const addr = await reverseGeocode(lat, lng);
        if (addr) {
          ignoreNextSearchRef.current = true; // don't forward-search what we just reverse-geocoded
          onAddressResolved(addr);
        }
      }
    },
    [onLocationSelect, onAddressResolved, resolvedOutletLat, resolvedOutletLng]
  );

  // ── Map initialisation ──────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    let mounted = true;

    import('leaflet').then((L) => {
      if (!mounted || !mapContainerRef.current || mapRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = L.map(mapContainerRef.current!, { 
        center: [resolvedOutletLat, resolvedOutletLng], 
        zoom: 13,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Add a clean attribution control without the Leaflet prefix and flag
      L.control.attribution({ prefix: false })
        .addAttribution('© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>')
        .addTo(map);

      // Zone circles (draw largest first = behind)
      L.circle([resolvedOutletLat, resolvedOutletLng], { radius: 10000, color: '#ef4444', fillColor: '#fef2f2', fillOpacity: 0.18, weight: 2, dashArray: '8 4' }).addTo(map);
      L.circle([resolvedOutletLat, resolvedOutletLng], { radius: 6000,  color: '#f59e0b', fillColor: '#fffbeb', fillOpacity: 0.22, weight: 2, dashArray: '6 4' }).addTo(map);
      L.circle([resolvedOutletLat, resolvedOutletLng], { radius: 3000,  color: '#22c55e', fillColor: '#f0fdf4', fillOpacity: 0.28, weight: 2 }).addTo(map);

      // Outlet marker
      const outletIcon = L.divIcon({
        html: `<div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#8E0E0E,#E05009);border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 17H2"/></svg></div>`,
        className: '',
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });
      L.marker([resolvedOutletLat, resolvedOutletLng], { icon: outletIcon })
        .addTo(map)
        .bindPopup(`<div style="font-size:13px;text-align:center;min-width:180px"><b style="color:#8E0E0E">A6 Nyuss</b><br/>Jl. Demak No. 253, Bubutan<br/><span style="color:#666">Kota Surabaya</span></div>`)
        .openPopup();

      // Zone labels
      const ls = 'background:white;border:none;font-size:11px;font-weight:600;white-space:nowrap;padding:2px 6px;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,0.2);';
      L.marker([resolvedOutletLat + 0.018, resolvedOutletLng], { icon: L.divIcon({ html: `<div style="${ls}color:#16a34a">Zona 1: Rp 8.000</div>`, className: '', iconSize: [120, 24], iconAnchor: [60, 12] }) }).addTo(map);
      L.marker([resolvedOutletLat + 0.042, resolvedOutletLng], { icon: L.divIcon({ html: `<div style="${ls}color:#d97706">Zona 2: Rp 13.000</div>`, className: '', iconSize: [130, 24], iconAnchor: [65, 12] }) }).addTo(map);
      L.marker([resolvedOutletLat + 0.075, resolvedOutletLng], { icon: L.divIcon({ html: `<div style="${ls}color:#dc2626">Zona 3: Rp 18.000</div>`, className: '', iconSize: [135, 24], iconAnchor: [67, 12] }) }).addTo(map);

      map.on('click', (e: any) => {
        mapRef.current?.setView([e.latlng.lat, e.latlng.lng], Math.max(mapRef.current.getZoom(), 15));
        placeMarker(e.latlng.lat, e.latlng.lng, L, true);
      });

      mapRef.current = map;
      leafletRef.current = L;
      setIsLoading(false);
    });

    return () => { mounted = false; };
  }, [placeMarker, resolvedOutletLat, resolvedOutletLng]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  // ── Forward geocoding: when parent address field changes ─────────
  useEffect(() => {
    if (!searchAddress || searchAddress.trim().length < 8) return;

    // If this change was triggered by a reverse-geocode, skip it once
    if (ignoreNextSearchRef.current) {
      ignoreNextSearchRef.current = false;
      return;
    }

    // Avoid re-searching the same text
    if (searchAddress === lastSearchRef.current) return;

    // Debounce: wait 700ms after user stops typing
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    setSearchStatus('searching');

    searchTimerRef.current = setTimeout(async () => {
      lastSearchRef.current = searchAddress;
      const coords = await forwardGeocode(searchAddress);

      if (coords && mapRef.current && leafletRef.current) {
        setSearchStatus('found');
        mapRef.current.setView([coords.lat, coords.lng], 16, { animate: true });
        placeMarker(coords.lat, coords.lng, leafletRef.current, false); // false = don't reverse back
      } else {
        setSearchStatus('notfound');
      }
    }, 700);
  }, [searchAddress, placeMarker]);

  // ── GPS handler ───────────────────────────────────────────────────
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) { alert('Browser Anda tidak mendukung geolokasi'); return; }
    setGeoStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setGeoStatus('success');
        if (mapRef.current) mapRef.current.setView([latitude, longitude], 16);
        if (leafletRef.current) placeMarker(latitude, longitude, leafletRef.current, true);
      },
      () => {
        setGeoStatus('error');
        alert('Gagal mendapatkan lokasi. Pastikan izin lokasi diberikan di browser.');
      }
    );
  };

  return (
    <div className="space-y-3">

      {/* Instruction banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
        <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-blue-700 text-sm">
          <strong>Klik pada peta</strong> atau <strong>ketik alamat</strong> di kolom atas — keduanya saling terhubung otomatis. Ongkir dihitung instan berdasarkan jarak ke outlet.
        </p>
      </div>

      {/* Search status hint */}
      {searchStatus === 'searching' && (
        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <div className="w-3 h-3 border-2 border-amber-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          Mencari lokasi dari alamat yang diketik...
        </div>
      )}
      {searchStatus === 'found' && (
        <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          Lokasi ditemukan dari alamat! Peta sudah dipindahkan.
        </div>
      )}

      {/* Autocomplete Search Input */}
      <div ref={autocompleteContainerRef} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari jalan, perumahan, atau gedung di Surabaya..."
            className="w-full pl-9 pr-10 py-2.5 border-2 border-gray-200 focus:border-[#8E0E0E] rounded-xl text-sm focus:outline-none bg-white text-gray-800 placeholder-gray-400 font-semibold shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSuggestions([]); }}
              className="absolute right-3.5 text-gray-400 hover:text-gray-650 transition-colors p-0.5 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute z-[1000] left-0 right-0 bg-white border-2 border-gray-200 rounded-2xl mt-1.5 shadow-xl max-h-60 overflow-y-auto divide-y divide-gray-100">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className="w-full text-left px-4 py-3 hover:bg-[#8E0E0E]/5 text-xs text-gray-700 font-semibold transition-colors flex items-start gap-2.5"
              >
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#8E0E0E]" />
                <div>
                  <p className="font-bold text-gray-900 line-clamp-1">{item.display_name.split(',')[0]}</p>
                  <p className="text-[10px] text-gray-500 font-medium line-clamp-1 mt-0.5">
                    {item.display_name.split(',').slice(1).join(',').trim()}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
        {isSearchingSuggestions && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center pr-2">
            <div className="w-3.5 h-3.5 border-2 border-[#8E0E0E] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* GPS Button */}
      <button
        type="button"
        onClick={handleUseMyLocation}
        disabled={geoStatus === 'loading'}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-[#8E0E0E] text-[#8E0E0E] rounded-xl text-sm font-semibold hover:bg-[#8E0E0E] hover:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {geoStatus === 'loading' ? (
          <>
            <div className="w-4 h-4 border-2 border-[#8E0E0E] border-t-transparent rounded-full animate-spin" />
            Mendeteksi lokasi GPS...
          </>
        ) : (
          <span className="flex items-center justify-center gap-1.5"><Navigation className="w-4 h-4 rotate-45" /> Gunakan Lokasi GPS Saya Sekarang</span>
        )}
      </button>

      {/* Map */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 shadow-sm" style={{ height: 360 }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-[#8E0E0E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-gray-500">Memuat peta...</p>
            </div>
          </div>
        )}
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Zone Legend */}
      <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
        <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Keterangan Zona Pengiriman</p>
        <div className="grid grid-cols-3 gap-2">
          {ZONES.map((z) => (
            <div key={z.name} className="text-center">
              <div
                className="rounded-lg py-1.5 px-2 text-xs font-bold mb-1"
                style={{ background: z.color + '22', color: z.color, border: `1.5px solid ${z.color}` }}
              >
                {z.maxKm === 3 ? '0-3 km' : z.maxKm === 6 ? '3-6 km' : '6-10 km'}
              </div>
              <p className="text-[11px] font-semibold text-gray-700">
                Rp {z.fee.toLocaleString('id-ID')}
              </p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center">Di luar 10 km: pengiriman tidak tersedia</p>
      </div>

      {/* Result card */}
      {selectedResult && (
        <div className={`rounded-xl p-4 border-2 transition-all ${selectedResult.isOutOfRange ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
          {selectedResult.isOutOfRange ? (
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-500 shrink-0" />
              <div>
                <p className="font-bold text-red-700 text-sm">Lokasi di Luar Jangkauan</p>
                <p className="text-red-600 text-xs">
                  Jarak {selectedResult.distanceKm.toFixed(2)} km — melebihi batas 10 km. Pengiriman tidak tersedia.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                <div>
                  <p className="font-bold text-green-700 text-sm">{selectedResult.zoneName}</p>
                  <p className="text-green-600 text-xs">
                    Jarak dari outlet: <strong>{selectedResult.distanceKm.toFixed(2)} km</strong>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Ongkir</p>
                <p className="font-black text-[#8E0E0E] text-lg">
                  Rp {selectedResult.fee.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
