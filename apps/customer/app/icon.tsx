import { ImageResponse } from 'next/og';
import { getStoreSettings } from '@/lib/db/menuService';

export const dynamic = 'force-dynamic';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default async function Icon() {
  let initial = '🏪';
  try {
    const settings = await getStoreSettings();
    if (settings?.store_name) {
      initial = settings.store_name.charAt(0).toUpperCase();
    }
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: 'linear-gradient(135deg, #8E0E0E, #E05009)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 900,
          borderRadius: 8,
        }}
      >
        {initial}
      </div>
    ),
    {
      ...size,
    }
  );
}
