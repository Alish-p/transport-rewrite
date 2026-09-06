import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';

import { fCurrency } from 'src/utils/format-number';
import { copyToClipboard } from 'src/utils/copy-to-clipboard';
import { fDate, fToNow, fDateTime } from 'src/utils/format-time';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  useTenantPayments,
  useCreateTenantUser,
  useUpdateTenantById,
  useRecordTenantPayment,
} from 'src/query/use-tenant-admin';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { HeroHeader } from 'src/components/hero-header-card';
import { TableNoData, TablePaginationCustom } from 'src/components/table';

import { DashboardTotalWidget } from 'src/sections/overview/app/app-total-widget';

import TenantLogoCardAdmin from './tenant-logo-card-admin';
import { PaymentFormDialog } from './tenant-admin-payments';
import { TenantUserFormDialog } from './tenant-admin-users';
import { TenantSubscriptionWidget } from './tenant-subscription-widget';
import { TenantSubscriptionDialog } from './tenant-subscription-dialog';
import { TenantRecordPaymentDialog } from './tenant-record-payment-dialog';

const PAYMENT_METHOD_ICONS = {
  UPI: 'solar:smartphone-bold',
  BankTransfer: 'solar:banknote-2-bold',
  Card: 'solar:card-2-bold',
  Cash: 'solar:wallet-money-bold',
};

const getPaymentStatusColor = (status) => {
  const s = String(status || '').toUpperCase();
  if (s === 'COMPLETED' || s === 'SUCCESS') return 'success';
  if (s === 'PENDING') return 'warning';
  if (s === 'FAILED') return 'error';
  return 'default';
};

const getLastLoginLabel = (date) => {
  if (!date) {
    return { text: 'Never', color: 'default' };
  }
  const dateObj = new Date(date);
  if (Number.isNaN(dateObj.getTime())) {
    return { text: 'Never', color: 'default' };
  }

  const diffHours = (Date.now() - dateObj.getTime()) / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  let color = 'success';
  if (diffDays > 30) {
    color = 'error';
  } else if (diffDays > 7) {
    color = 'warning';
  } else if (diffDays > 1) {
    color = 'info';
  } else {
    color = 'success';
  }

  const relative = fToNow(dateObj);
  const text = relative ? `${relative} ago` : 'Recently';

  return { text, color };
};

export default function TenantAdminDetailView({ tenant, users, stats }) {
  const navigate = useNavigate();
  const { addPayment, updatePayment, deletePayment } = useTenantPayments();
  const { createTenantUser } = useCreateTenantUser();
  const { updateTenantById } = useUpdateTenantById();
  const { recordTenantPayment } = useRecordTenantPayment();

  const [localTenant, setLocalTenant] = useState(tenant);
  const [localUsers, setLocalUsers] = useState(users || []);
  const [formOpen, setFormOpen] = useState(false);
  const [editPayment, setEditPayment] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, payment: null });
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [subFormOpen, setSubFormOpen] = useState(false);
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);

  // Pagination for Payments
  const [paymentPage, setPaymentPage] = useState(0);
  const [paymentRowsPerPage, setPaymentRowsPerPage] = useState(5);

  // Search & Pagination for Users
  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(0);
  const [userRowsPerPage, setUserRowsPerPage] = useState(5);

  const sortedPayments = useMemo(() => {
    const list = [...(localTenant?.paymentHistory || [])];
    return list.sort((a, b) => new Date(b.paymentDate || 0) - new Date(a.paymentDate || 0));
  }, [localTenant?.paymentHistory]);

  const paginatedPayments = useMemo(() => {
    const start = paymentPage * paymentRowsPerPage;
    return sortedPayments.slice(start, start + paymentRowsPerPage);
  }, [sortedPayments, paymentPage, paymentRowsPerPage]);

  const filteredUsers = useMemo(() => {
    if (!userSearch) return localUsers;
    const q = userSearch.toLowerCase();
    return localUsers.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.designation?.toLowerCase().includes(q) ||
        u.mobile?.includes(q)
    );
  }, [localUsers, userSearch]);

  const paginatedUsers = useMemo(() => {
    const start = userPage * userRowsPerPage;
    return filteredUsers.slice(start, start + userRowsPerPage);
  }, [filteredUsers, userPage, userRowsPerPage]);

  useEffect(() => {
    if (tenant) {
      setLocalTenant(tenant);
    }
  }, [tenant]);

  useEffect(() => {
    if (users) {
      setLocalUsers(users);
    }
  }, [users]);

  const addr = localTenant?.address || {};
  const contact = localTenant?.contactDetails || {};
  const legal = localTenant?.legalInfo || {};
  const bank = localTenant?.bankDetails || {};

  const sub = localTenant?.subscription || stats?.subscription;

  const meta = [
    contact?.phone
      ? { icon: 'mdi:phone', label: contact.phone, href: `tel:${contact.phone}` }
      : null,
    contact?.email
      ? { icon: 'mdi:email', label: contact.email, href: `mailto:${contact.email}` }
      : null,
    addr?.city || addr?.state || addr?.pincode
      ? {
          icon: 'mdi:map-marker',
          label: [addr.city, addr.state, addr.pincode].filter(Boolean).join(', '),
        }
      : null,
  ].filter(Boolean);

  const ICONS = useMemo(() => {
    const icon = (name) => (
      <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />
    );
    return {
      vehicle: icon('ic_vehicle'),
      driver: icon('ic-user'),
      customer: icon('ic_customer'),
      transporter: icon('ic_transporter'),
      subtrip: icon('ic_subtrip'),
      invoice: icon('ic-invoice'),
      users: icon('ic-user'),
    };
  }, []);

  const counts = stats?.counts || {};
  const totals = stats?.totals || {};

  return (
    <DashboardContent>
      <HeroHeader
        offsetTop={70}
        title={localTenant?.name || 'Tenant'}
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
          {/* Row 1: Identity, Subscription & Basic Details */}
          <Grid xs={12} md={4}>
            <TenantLogoCardAdmin
              tenant={localTenant}
              onUpdated={(updated) => setLocalTenant(updated)}
              sx={{ height: 1 }}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <TenantSubscriptionWidget
              subscription={sub}
              sx={{ height: 1 }}
              onRenew={() => setRecordPaymentOpen(true)}
              action={
                <IconButton onClick={() => setSubFormOpen(true)} size="small">
                  <Iconify icon="solar:pen-bold" />
                </IconButton>
              }
            />
          </Grid>

          <Grid xs={12} md={4}>
            <Card sx={{ p: 2.5, height: 1 }}>
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                Basic Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <InfoRow label="Name" value={localTenant?.name} copyable />
              <InfoRow label="Tagline" value={localTenant?.tagline} />
              <InfoRow label="Theme" value={localTenant?.theme} />
            </Card>
          </Grid>

          {/* Row 2: Address & Contact, Legal & Bank Details */}
          <Grid xs={12} md={6}>
            <Card sx={{ p: 2.5, height: 1 }}>
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                Address & Contact
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <InfoRow label="Address" value={addr?.line1} />
              <InfoRow label="City" value={addr?.city} />
              <InfoRow label="State" value={addr?.state} />
              <InfoRow label="Pincode" value={addr?.pincode} />
              <InfoRow label="Email" value={contact?.email} isEmail copyable />
              <InfoRow label="Phone" value={contact?.phone} isPhone copyable />
              <InfoRow label="Website" value={contact?.website} isLink />
            </Card>
          </Grid>

          <Grid xs={12} md={6}>
            <Card sx={{ p: 2.5, height: 1 }}>
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                Legal & Bank
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <InfoRow label="PAN" value={legal?.panNumber} copyable />
              <InfoRow label="GSTIN" value={legal?.gstNumber} copyable />
              <InfoRow label="Registered State" value={legal?.registeredState} />
              <Divider sx={{ my: 1.5 }} />
              <InfoRow label="Bank Name" value={bank?.bankName || bank?.name} />
              <InfoRow label="IFSC" value={bank?.ifscCode || bank?.ifsc} copyable />
              <InfoRow label="Account No" value={bank?.accountNumber || bank?.accNo} copyable />
            </Card>
          </Grid>

          {/* Totals Widgets */}
          <Grid xs={6} sm={4} md={2}>
            <DashboardTotalWidget
              title="Drivers"
              total={counts?.drivers ?? 0}
              color="primary"
              icon={ICONS.driver}
            />
          </Grid>
          <Grid xs={6} sm={4} md={2}>
            <DashboardTotalWidget
              title="Customers"
              total={counts?.customers ?? 0}
              color="secondary"
              icon={ICONS.customer}
            />
          </Grid>
          <Grid xs={6} sm={4} md={2}>
            <DashboardTotalWidget
              title="Jobs / Trips"
              total={counts?.subtrips ?? 0}
              color="warning"
              icon={ICONS.subtrip}
            />
          </Grid>
          <Grid xs={6} sm={4} md={2}>
            <DashboardTotalWidget
              title="Transporters"
              total={counts?.transporters ?? 0}
              color="info"
              icon={ICONS.transporter}
            />
          </Grid>
          <Grid xs={6} sm={4} md={2}>
            <DashboardTotalWidget
              title="Transporter Payments"
              total={counts?.transporterPayments ?? 0}
              color="error"
              icon={<Iconify icon="solar:card-send-bold" width={32} />}
            />
          </Grid>
          <Grid xs={6} sm={4} md={2}>
            <DashboardTotalWidget
              title="Invoiced Revenue"
              total={totals?.invoiceGenerated ?? 0}
              prefix="₹"
              color="success"
              icon={<Iconify icon="solar:bill-check-bold" width={32} />}
            />
          </Grid>

          {/* Payment History Table */}
          <Grid xs={12}>
            <Card sx={{ p: 2.5 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2 }}
              >
                <Typography variant="h6">Payment History</Typography>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<Iconify icon="solar:card-send-bold" />}
                  onClick={() => setRecordPaymentOpen(true)}
                >
                  Record Payment
                </Button>
              </Stack>
              <Divider sx={{ mb: 2 }} />
              <TableContainer component={Paper} sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
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
                    {paginatedPayments.map((p, idx) => (
                      <TableRow key={p._id || idx} hover>
                        <TableCell>{paymentPage * paymentRowsPerPage + idx + 1}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{fCurrency(p.amount)}</TableCell>
                        <TableCell>{fDate(p.paymentDate)}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.75} alignItems="center">
                            {PAYMENT_METHOD_ICONS[p.paymentMethod] && (
                              <Iconify
                                icon={PAYMENT_METHOD_ICONS[p.paymentMethod]}
                                width={16}
                                sx={{ color: 'text.secondary' }}
                              />
                            )}
                            <span>{p.paymentMethod || '—'}</span>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Label color={getPaymentStatusColor(p.status)} variant="soft">
                            {p.status || 'Completed'}
                          </Label>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 220, color: 'text.secondary' }}>
                          <Typography variant="body2" noWrap title={p.notes || ''}>
                            {p.notes || '—'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit Payment">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => {
                                setEditPayment(p);
                                setFormOpen(true);
                              }}
                            >
                              <Iconify icon="solar:pen-bold" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Payment">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => setConfirm({ open: true, payment: p })}
                            >
                              <Iconify icon="solar:trash-bin-trash-bold" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableNoData notFound={sortedPayments.length === 0} />
                  </TableBody>
                </Table>
              </TableContainer>

              {sortedPayments.length > 0 && (
                <TablePaginationCustom
                  count={sortedPayments.length}
                  page={paymentPage}
                  rowsPerPage={paymentRowsPerPage}
                  onPageChange={(e, newPage) => setPaymentPage(newPage)}
                  onRowsPerPageChange={(e) => {
                    setPaymentRowsPerPage(parseInt(e.target.value, 10));
                    setPaymentPage(0);
                  }}
                  rowsPerPageOptions={[5, 10, 25]}
                />
              )}
            </Card>
          </Grid>

          {/* Users List */}
          <Grid xs={12}>
            <Card sx={{ p: 2.5 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: 2 }}
              >
                <Typography variant="h6">Users ({filteredUsers.length})</Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ width: { xs: 1, sm: 'auto' } }}
                >
                  <TextField
                    size="small"
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setUserPage(0);
                    }}
                    placeholder="Search users..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ width: { xs: 1, sm: 240 } }}
                  />
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<Iconify icon="mdi:account-plus" />}
                    onClick={() => setUserFormOpen(true)}
                    sx={{ flexShrink: 0 }}
                  >
                    Add User
                  </Button>
                </Stack>
              </Stack>
              <Divider sx={{ mb: 2 }} />
              <TableContainer component={Paper} sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Mobile</TableCell>
                      <TableCell>Designation</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Last Login</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedUsers.map((u, idx) => (
                      <TableRow key={u._id || idx} hover>
                        <TableCell>{userPage * userRowsPerPage + idx + 1}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                fontSize: 13,
                                fontWeight: 700,
                                bgcolor: 'primary.lighter',
                                color: 'primary.main',
                              }}
                            >
                              {(u.name?.trim()?.[0] || 'U').toUpperCase()}
                            </Avatar>
                            <Typography variant="subtitle2">{u.name}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Link
                              href={`mailto:${u.email}`}
                              variant="body2"
                              sx={{
                                color: 'text.primary',
                                fontWeight: 500,
                                '&:hover': { color: 'primary.main' },
                              }}
                            >
                              {u.email}
                            </Link>
                            <Tooltip title="Copy email">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  copyToClipboard(u.email);
                                  toast.success('Email copied to clipboard');
                                }}
                                sx={{ p: 0.5, color: 'text.disabled' }}
                              >
                                <Iconify icon="solar:copy-bold" width={14} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          {u.mobile ? (
                            <Link
                              href={`tel:${u.mobile}`}
                              variant="body2"
                              sx={{
                                color: 'text.primary',
                                fontWeight: 500,
                                '&:hover': { color: 'primary.main' },
                              }}
                            >
                              {u.mobile}
                            </Link>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell>{u.designation || '—'}</TableCell>
                        <TableCell>
                          <Label color={u.role === 'admin' ? 'primary' : 'default'} variant="soft">
                            {(u.role || 'Member').toUpperCase()}
                          </Label>
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {(() => {
                            const lastLoginDate = u.lastSeen || u.lastLogin || u.lastLoginAt;
                            const labelInfo = getLastLoginLabel(lastLoginDate);
                            return lastLoginDate ? (
                              <Tooltip title={fDateTime(lastLoginDate)} placement="top" arrow>
                                <Label variant="soft" color={labelInfo.color}>
                                  {labelInfo.text}
                                </Label>
                              </Tooltip>
                            ) : (
                              <Label variant="soft" color={labelInfo.color}>
                                {labelInfo.text}
                              </Label>
                            );
                          })()}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableNoData notFound={filteredUsers.length === 0} />
                  </TableBody>
                </Table>
              </TableContainer>

              {filteredUsers.length > 0 && (
                <TablePaginationCustom
                  count={filteredUsers.length}
                  page={userPage}
                  rowsPerPage={userRowsPerPage}
                  onPageChange={(e, newPage) => setUserPage(newPage)}
                  onRowsPerPageChange={(e) => {
                    setUserRowsPerPage(parseInt(e.target.value, 10));
                    setUserPage(0);
                  }}
                  rowsPerPageOptions={[5, 10, 25]}
                />
              )}
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
            const updated = await updatePayment({
              tenantId: localTenant._id,
              paymentId: editPayment._id,
              patch: values,
            });
            setLocalTenant(updated);
          } else {
            const updated = await addPayment({ tenantId: localTenant._id, payment: values });
            setLocalTenant(updated);
          }
          setFormOpen(false);
        }}
      />

      {/* Create Tenant User Dialog */}
      <TenantUserFormDialog
        open={userFormOpen}
        onClose={() => setUserFormOpen(false)}
        onSubmit={async (values) => {
          const created = await createTenantUser({ tenantId: localTenant._id, user: values });
          if (created) setLocalUsers((prev) => [...(prev || []), created]);
          setUserFormOpen(false);
        }}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, payment: null })}
        title="Delete Payment Record?"
        content={
          confirm.payment
            ? `Are you sure you want to delete payment of ${fCurrency(confirm.payment.amount)} dated ${fDate(confirm.payment.paymentDate)}? This action cannot be undone.`
            : 'This will remove the payment record.'
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              const updated = await deletePayment({
                tenantId: localTenant._id,
                paymentId: confirm.payment._id,
              });
              setLocalTenant(updated);
              setConfirm({ open: false, payment: null });
            }}
          >
            Delete
          </Button>
        }
      />
      {/* Subscription Edit Dialog */}
      <TenantSubscriptionDialog
        open={subFormOpen}
        onClose={() => setSubFormOpen(false)}
        initial={localTenant?.subscription}
        onSubmit={async (values) => {
          const updated = await updateTenantById({
            id: localTenant._id,
            data: { subscription: values },
          });
          setLocalTenant(updated);
          setSubFormOpen(false);
        }}
      />

      {/* Record Payment & Plan Extension Dialog */}
      <TenantRecordPaymentDialog
        open={recordPaymentOpen}
        onClose={() => setRecordPaymentOpen(false)}
        tenant={localTenant}
        onSubmit={async (values) => {
          const updated = await recordTenantPayment({
            tenantId: localTenant._id,
            payload: values,
          });
          if (updated) setLocalTenant(updated);
          setRecordPaymentOpen(false);
        }}
      />
    </DashboardContent>
  );
}

function InfoRow({ label, value, copyable, isPhone, isEmail, isLink }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    await copyToClipboard(String(value));
    setCopied(true);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasValue = value != null && value !== '';

  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 0.5 }}>
      <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 140 }}>
        {label}
      </Typography>

      {!hasValue ? (
        <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
          —
        </Typography>
      ) : (
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          sx={{ minWidth: 0, flexWrap: 'wrap' }}
        >
          {isPhone ? (
            <Link
              href={`tel:${value}`}
              variant="body2"
              sx={{ fontWeight: 600, color: 'text.primary', '&:hover': { color: 'primary.main' } }}
            >
              {String(value)}
            </Link>
          ) : isEmail ? (
            <Link
              href={`mailto:${value}`}
              variant="body2"
              sx={{ fontWeight: 600, color: 'text.primary', '&:hover': { color: 'primary.main' } }}
            >
              {String(value)}
            </Link>
          ) : isLink ? (
            <Link
              href={String(value).startsWith('http') ? value : `https://${value}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="body2"
              sx={{ fontWeight: 600, color: 'primary.main' }}
            >
              {String(value)}
            </Link>
          ) : (
            <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>
              {String(value)}
            </Typography>
          )}

          {copyable && hasValue && (
            <Tooltip title={copied ? 'Copied!' : `Copy ${label}`}>
              <IconButton
                size="small"
                onClick={handleCopy}
                sx={{ p: 0.5, color: copied ? 'success.main' : 'text.disabled' }}
              >
                <Iconify icon={copied ? 'solar:check-circle-bold' : 'solar:copy-bold'} width={15} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      )}
    </Stack>
  );
}
