"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: { fontFamily: 'var(--font-poppins), sans-serif', fontSize: '14px' },
      }}
    />
  );
}
