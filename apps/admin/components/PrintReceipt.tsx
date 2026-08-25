import { Fragment } from 'react';
import { AdminOrder, useAdminStore } from '../store/adminStore';
import { formatRupiah, formatDate } from '../utils/format';

interface PrintReceiptProps {
  order: AdminOrder;
}

export default function PrintReceipt({ order }: PrintReceiptProps) {
  const { storeName, branding } = useAdminStore();

  const receiptTitle = branding?.receiptHeader || branding?.businessName || storeName || 'STRUK PEMBELIAN';
  const storeAddress = branding?.storeAddress || '';
  const whatsappNumber = branding?.whatsappNumber || '';
  const receiptFooter = branding?.receiptFooter || '-- Terima kasih & Selamat Menikmati! --';

  const paymentLabel =
    order.deliveryType === 'pickup'
      ? (order.paymentMethod === 'cod'
        ? 'TUNAI'
        : `QRIS${order.paymentStatus === 'paid' ? ' - LUNAS' : ' - MENUNGGU VERIFIKASI'}`)
      : (order.paymentMethod === 'cod'
        ? 'TUNAI COD'
        : `QRIS${order.paymentStatus === 'paid' ? ' - LUNAS' : ' - MENUNGGU VERIFIKASI'}`);

  return (
    <div className="print-receipt-container hidden">
      <div className="header">
        <h2>{receiptTitle.toUpperCase()}</h2>
        <p>{storeAddress}</p>
        <p>WA: {whatsappNumber}</p>
        <div className="divider">===============================</div>
      </div>
      <div className="meta">
        <p>
          KODE: <strong>{order.orderCode}</strong>
        </p>
        <p>Tanggal: {formatDate(order.createdAt)}</p>
        <p>
          Pemesan: {order.customerName} ({order.customerPhone})
        </p>
        <p>
          Layanan:{' '}
          {order.deliveryType === 'dine_in'
            ? 'DINE-IN (Makan di Tempat)'
            : order.deliveryType === 'takeaway'
            ? 'TAKEAWAY (Bungkus)'
            : order.deliveryType === 'delivery'
            ? 'DELIVERY (Pesan Antar)'
            : 'PICKUP (Kasir Direct)'}
        </p>
        {order.deliveryAddress && <p>Alamat: {order.deliveryAddress}</p>}
        <div className="divider">-------------------------------</div>
      </div>
      <table className="items-table" style={{ width: '100%' }}>
        <tbody>
          {order.items.map((item) => (
            <Fragment key={item.id}>
              <tr>
                <td colSpan={2}>
                  {item.quantity}x {item.name}
                </td>
                <td className="text-right">{formatRupiah(item.price * item.quantity)}</td>
              </tr>
              {(item.variant || item.topping) && (
                <tr className="variants">
                  <td colSpan={3}>
                    *{item.variant ? ` Variant: ${item.variant}` : ''}
                    {item.topping ? `, Topping: ${item.topping}` : ''}
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
      <div className="divider">-------------------------------</div>
      <div className="totals">
        <p>
          Subtotal: <span className="float-right">{formatRupiah(order.subtotal)}</span>
        </p>
        {order.deliveryFee > 0 && (
          <p>
            Ongkir ({order.deliveryDistance ?? 0} Km):{' '}
            <span className="float-right">{formatRupiah(order.deliveryFee)}</span>
          </p>
        )}
        {order.discount > 0 && (
          <p>
            Diskon{order.couponCode ? ` (Kupon: ${order.couponCode})` : ''}:{' '}
            <span className="float-right">-{formatRupiah(order.discount)}</span>
          </p>
        )}
        <p className="grand-total">
          TOTAL: <span className="float-right">{formatRupiah(order.totalPrice)}</span>
        </p>
      </div>
      <div className="divider">===============================</div>
      <div className="footer">
        <p>Pembayaran: {paymentLabel}</p>
        {order.notes && <p>Catatan: {order.notes}</p>}
        <p className="thanks">{receiptFooter}</p>
      </div>
    </div>
  );
}
