import { useMemo } from 'react';

import { Label } from 'src/components/label';
import { DetailCard } from 'src/components/detail-card';

// ----------------------------------------------------------------------

export function CustomerAdditionalWidget({ customer }) {
  const {
    transporterCode,
    invoicePrefix,
    invoiceSuffix,
    currentInvoiceSerialNumber,
    invoiceDueInDays,
  } = customer || {};

  const nextInvoiceNumber = `${invoicePrefix || ''}${
    typeof currentInvoiceSerialNumber === 'number' ? currentInvoiceSerialNumber + 1 : ''
  }${invoiceSuffix || ''}`;

  const fields = useMemo(
    () => [
      { label: 'Transporter Code', value: transporterCode },
      { label: 'Invoice Prefix', value: invoicePrefix },
      { label: 'Invoice Suffix', value: invoiceSuffix },
      { label: 'Current Serial No', value: currentInvoiceSerialNumber },
      {
        label: 'Next Invoice No',
        value: nextInvoiceNumber ? <Label color="primary">{nextInvoiceNumber}</Label> : '-',
        rawValue: nextInvoiceNumber,
      },
      { label: 'Invoice Due (days)', value: invoiceDueInDays },
    ],
    [
      currentInvoiceSerialNumber,
      invoiceDueInDays,
      invoicePrefix,
      invoiceSuffix,
      nextInvoiceNumber,
      transporterCode,
    ]
  );

  return (
    <DetailCard
      title="Additional Details"
      icon="solar:settings-bold"
      fields={fields}
    />
  );
}

export default CustomerAdditionalWidget;
