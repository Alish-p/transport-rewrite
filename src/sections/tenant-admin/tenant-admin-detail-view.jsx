import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { HeroHeader } from 'src/components/hero-header-card';
import { useTenantPayments } from 'src/query/use-tenant-admin';
import { PaymentFormDialog } from './tenant-admin-payments';

export default function TenantAdminDetailView({ tenant }) {
  const navigate = useNavigate();
  const { addPayment, updatePayment, deletePayment } = useTenantPayments();

  const [localTenant, setLocalTenant] = useState(tenant);
  const [formOpen, setFormOpen] = useState(false);
  const [editPayment, setEditPayment] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, payment: null });

  const addr = localTenant?.address || {};
  const contact = localTenant?.contactDetails || {};
  const legal = localTenant?.legalInfo || {};
  const bank = localTenant?.bankDetails || {};

  const meta = [
    localTenant?.slug ? { icon: 'mdi:label', label: localTenant.slug } : null,
    contact?.phone ? { icon: 'mdi:phone', label: contact.phone } : null,
    contact?.email ? { icon: 'mdi:email', label: contact.email } : null,
    addr?.city || addr?.state || addr?.pincode
      ? {
        icon: 'mdi:map-marker',
        label: [addr.city, addr.state, addr.pincode].filter(Boolean).join(', '),
      }
      : null,
  ].filter(Boolean);

  return (
    <DashboardContent>
      <HeroHeader
        offsetTop={70}
        title={localTenant?.name || 'Tenant'}
        status={localTenant?.subscription?.plan ? localTenant.subscription.plan : 'Active'}
        icon="solar:buildings-2-bold"
        meta={meta}
        actions={[
          {
            label: 'Edit',
            icon: 'solar:pen-bold',
            onClick: () => navigate(paths.dashboard.tenants.edit(localTenant._id)),
          },
        ]}
      />

      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <Card sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                Basic Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <InfoRow label="Name" value={localTenant?.name} />
              <InfoRow label="Slug" value={localTenant?.slug} />
              {localTenant?.tagline && <InfoRow label="Tagline" value={localTenant.tagline} />}
              {localTenant?.theme && <InfoRow label="Theme" value={localTenant.theme} />}
            </Card>
          </Grid>

          <Grid xs={12} md={4}>
            <Card sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                Address & Contact
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <InfoRow label="Address" value={addr?.line1} />
              <InfoRow label="City" value={addr?.city} />
              <InfoRow label="State" value={addr?.state} />
              <InfoRow label="Pincode" value={addr?.pincode} />
              <InfoRow label="Email" value={contact?.email} />
              <InfoRow label="Phone" value={contact?.phone} />
              {contact?.website && <InfoRow label="Website" value={contact.website} />}
            </Card>
          </Grid>

          <Grid xs={12} md={4}>
            <Card sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                Legal & Bank
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <InfoRow label="PAN" value={legal?.panNumber} />
              <InfoRow label="GSTIN" value={legal?.gstNumber} />
              <InfoRow label="Registered State" value={legal?.registeredState} />
              <Divider sx={{ my: 1.5 }} />
              <InfoRow label="Bank Name" value={bank?.name} />
              <InfoRow label="Branch" value={bank?.branch} />
              <InfoRow label="IFSC" value={bank?.ifsc} />
              <InfoRow label="Place" value={bank?.place} />
              <InfoRow label="Account No" value={bank?.accNo} />
            </Card>
          </Grid>

          <Grid xs={12} >
            <Card sx={{ p: 2.5 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                <Typography variant="h6">Payment History</Typography>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  onClick={() => {
                    setEditPayment(null);
                    setFormOpen(true);
                  }}
                >
                  Add Payment
                </Button>
              </Stack>
              <Divider sx={{ mb: 2 }} />
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Notes</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(localTenant?.paymentHistory || []).map((p, idx) => (
                      <TableRow key={p._id || idx}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{fCurrency(p.amount)}</TableCell>
                        <TableCell>{fDate(p.paymentDate)}</TableCell>
                        <TableCell>{p.paymentMethod}</TableCell>
                        <TableCell>{p.status || '-'}</TableCell>
                        <TableCell>{p.notes || '-'}</TableCell>
                        <TableCell align="right">
                          <IconButton color="primary" onClick={() => { setEditPayment(p); setFormOpen(true); }}>
                            <Iconify icon="solar:pen-bold" />
                          </IconButton>
                          <IconButton color="error" onClick={() => setConfirm({ open: true, payment: p })}>
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!localTenant?.paymentHistory || localTenant.paymentHistory.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No payments yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Add/Edit Payment Dialog */}
      <PaymentFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initial={editPayment}
        onSubmit={async (values) => {
          if (editPayment?._id) {
            const updated = await updatePayment({ tenantId: localTenant._id, paymentId: editPayment._id, patch: values });
            setLocalTenant(updated);
          } else {
            const updated = await addPayment({ tenantId: localTenant._id, payment: values });
            setLocalTenant(updated);
          }
          setFormOpen(false);
        }}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, payment: null })}
        title="Delete Payment?"
        content="This will remove the payment record."
        action={
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              const updated = await deletePayment({ tenantId: localTenant._id, paymentId: confirm.payment._id });
              setLocalTenant(updated);
              setConfirm({ open: false, payment: null });
            }}
          >
            Delete
          </Button>
        }
      />
    </DashboardContent>
  );
}

function InfoRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <Stack direction="row" spacing={1} sx={{ py: 0.5 }}>
      <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 140 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {String(value)}
      </Typography>
    </Stack>
  );
}
