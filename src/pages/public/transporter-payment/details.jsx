import { useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useTransporterPayment } from 'src/query/use-transporter-payment';

import TransporterPaymentPdf from 'src/pdfs/transporter-payment-pdf';

export default function PublicTransporterPaymentDetailsPage() {
  const { id } = useParams();

  const { data: transporterPayment } = useTransporterPayment(id);

  useEffect(() => {
    const run = async () => {
      if (!transporterPayment) return;
      try {
        const doc = (
          <TransporterPaymentPdf transporterPayment={transporterPayment} tenant={CONFIG.company} />
        );
        const blob = await pdf(doc).toBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const fileBase = transporterPayment?.paymentId || id || 'transporter_payment';
        a.download = `${fileBase}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (e) {
        // silently fail
        // eslint-disable-next-line no-console
        console.error('Failed to download transporter payment PDF', e);
      }
    };
    run();
  }, [id, transporterPayment]);

  return null;
}
