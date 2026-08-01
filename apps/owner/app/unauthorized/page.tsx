export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-sm">
        <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-xl font-semibold mb-2">Akses Ditolak</h2>
        <p className="text-gray-600">Anda tidak memiliki izin (role owner) untuk mengakses dashboard ini.</p>
      </div>
    </div>
  );
}
