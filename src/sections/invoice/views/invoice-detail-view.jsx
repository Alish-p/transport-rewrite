import { useState, useEffect, useCallback } from 'react';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { DashboardContent } from 'src/layouts/dashboard';
import { useUpdateInvoiceStatus } from 'src/query/use-invoice';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import InvoiceView from '../invoice-view';
import InvoiceToolbar from '../invoice-toolbar';
import InvoicePaymentTimeline from '../invoice-payment-timeline';

// Main component to display invoice details and allow status update
export function InvoiceDetailView({ invoice }) {
  const { invoiceStatus = '', invoiceNo } = invoice;

  const [statusValue, setStatusValue] = useState(invoiceStatus);

  useEffect(() => {
    setStatusValue(invoiceStatus);
  }, [invoiceStatus]);

  return (
    <DashboardContent>
      {/* Breadcrumb navigation */}
      <CustomBreadcrumbs
        heading={invoiceNo}
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Invoice', href: '/dashboard/invoice' },
          { name: invoiceNo },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {/* Toolbar for status update and action buttons */}
      <InvoiceToolbar invoice={invoice} currentStatus={statusValue} />

      {/* Invoice display content */}
      <InvoiceView invoice={invoice} />
      <InvoicePaymentTimeline payments={invoice?.payments} />
    </DashboardContent>
  );
}
