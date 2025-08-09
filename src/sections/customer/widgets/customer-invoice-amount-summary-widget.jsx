import { useCustomerInvoiceAmountSummary } from 'src/query/use-customer';

import { AppInvoiceAmountSummary } from 'src/sections/overview/app/app-invoice-amount-summary';

export function CustomerInvoiceAmountSummaryWidget({ customer }) {
  const { _id: customerId } = customer || {};
  const { data: summary } = useCustomerInvoiceAmountSummary(customerId);

  return (
    <AppInvoiceAmountSummary
      summary={summary}
      sx={{ borderTop: (t) => `4px solid ${t.palette.primary.main}`, height: 1 }}
    />
  );
}

export default CustomerInvoiceAmountSummaryWidget;
