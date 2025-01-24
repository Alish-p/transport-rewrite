import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

// redux
import { dispatch } from 'src/redux/store';
import { addBank, updateBank } from 'src/redux/slices/bank';

// components
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewBankSchema = zod.object({
  name: zod.string().min(1, { message: 'Bank Name is required' }),
  branch: zod.string().min(1, { message: 'Branch is required' }),
  place: zod.string().min(1, { message: 'Place is required' }),
  ifsc: zod.string().min(1, { message: 'IFSC  is required' }),
});

export default function BankForm({ currentBank }) {
  const navigate = useNavigate();

  const defaultValues = useMemo(
    () => ({
      name: currentBank?.name || '',
      branch: currentBank?.branch || '',
      place: currentBank?.place || '',
      ifsc: currentBank?.ifsc || '',
    }),
    [currentBank]
  );

  const methods = useForm({
    resolver: zodResolver(NewBankSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    console.log({ bankData: data });
    try {
      if (!currentBank) {
        await dispatch(addBank(data));
      } else {
        await dispatch(updateBank(currentBank._id, data));
      }
      reset();
      toast.success(!currentBank ? 'Bank added successfully!' : 'Bank edited successfully!');
      navigate(paths.dashboard.bank.list);
    } catch (error) {
      console.error(error);
    }
  };

  const renderBankDetails = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Bank Details
      </Typography>
      <Card sx={{ p: 3, mb: 3 }}>
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <Field.Text name="name" label="Bank Name" />
          <Field.Text name="branch" label="Branch" />
          <Field.Text name="place" label="Place" />
          <Field.Text name="ifsc" label="IFSC" />
        </Box>
      </Card>
    </>
  );

  const renderActions = () => (
    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
        {!currentBank ? 'Create Bank' : 'Save Changes'}
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {renderBankDetails()}
          {renderActions()}
        </Grid>
      </Grid>
    </Form>
  );
}
