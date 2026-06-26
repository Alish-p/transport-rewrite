import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useBoolean } from 'src/hooks/use-boolean';

import { useGetFieldConfig, useDeleteCustomerOverride } from 'src/query/use-field-config';

import { Iconify } from 'src/components/iconify';

import SubtripCustomerOverrideDialog from './subtrip-customer-override-dialog';

// ----------------------------------------------------------------------

export default function SubtripCustomerOverridesList() {
  const { data, isLoading } = useGetFieldConfig('subtrip');
  const { deleteOverride } = useDeleteCustomerOverride();

  const dialogOpen = useBoolean();
  const [selectedOverride, setSelectedOverride] = useState(null);

  const handleDelete = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer override?')) {
      await deleteOverride({ entity: 'subtrip', customerId });
    }
  };

  const handleEdit = (override) => {
    setSelectedOverride(override);
    dialogOpen.onTrue();
  };

  const handleAdd = () => {
    setSelectedOverride(null);
    dialogOpen.onTrue();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const overrides = data?.customerOverrides || [];

  return (
    <Stack spacing={3}>
      <Card sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h6">Customer Overrides</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Create customer-specific field rules that override the global default settings.
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleAdd}
          >
            Add Override
          </Button>
        </Stack>

        {overrides.length === 0 ? (
          <Box
            sx={{
              py: 8,
              textAlign: 'center',
              border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
              borderRadius: 1.5,
              bgcolor: 'background.neutral',
            }}
          >
            <Iconify icon="mdi:account-off-outline" width={48} sx={{ mb: 1, color: 'text.disabled' }} />
            <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
              No Customer Overrides
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              All customers are currently using the global default settings.
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Customized Fields</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {overrides.map((override) => {
                  const customer = override.customerId;
                  const customerId = customer?._id || customer;
                  const customerName = customer?.customerName || 'Unknown Customer';

                  // Count customized fields
                  const customizedFieldsCount = override.fields
                    ? Object.keys(override.fields).length
                    : 0;

                  return (
                    <TableRow key={customerId} hover>
                      <TableCell>
                        <Typography variant="subtitle2">{customerName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                          {customizedFieldsCount === 0 ? (
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              No field rules customized
                            </Typography>
                          ) : (
                            Object.entries(override.fields).map(([fieldKey, fieldConfig]) => (
                              <Chip
                                key={fieldKey}
                                size="small"
                                variant="soft"
                                label={`${fieldKey}: ${fieldConfig.visibility}`}
                                color={
                                  fieldConfig.visibility === 'required'
                                    ? 'error'
                                    : fieldConfig.visibility === 'hidden'
                                      ? 'default'
                                      : 'info'
                                }
                              />
                            ))
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleEdit(override)}>
                          <Iconify icon="solar:pen-bold" />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(customerId)}>
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {dialogOpen.value && (
        <SubtripCustomerOverrideDialog
          open={dialogOpen.value}
          onClose={dialogOpen.onFalse}
          override={selectedOverride}
          existingCustomerIds={overrides.map((o) => o.customerId?._id || o.customerId)}
        />
      )}
    </Stack>
  );
}
