import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import InvoiceForm from './invoice-form';
import InvoicePreview from './invoice-preview';
import { useInvoice } from './context/InvoiceContext';

// Submit button component
function SubmitButton() {
  const { createInvoice, isValid } = useInvoice();

  return (
    <LoadingButton size="large" variant="contained" onClick={createInvoice} disabled={!isValid}>
      Create Invoice
    </LoadingButton>
  );
}

export default function InvoiceFormAndPreview() {
  return (
    <>
      <InvoiceForm />
      <InvoicePreview />
      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <SubmitButton />
      </Stack>
    </>
  );
}
