import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import TextField from '@mui/material/TextField';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { TablePaginationCustom } from 'src/components/table';

import { usePaginatedTenants, useDeleteTenant } from 'src/query/use-tenant-admin';

export default function TenantAdminListView() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const params = useMemo(
    () => ({ search: search || undefined, page: page + 1, limit: rowsPerPage }),
    [search, page, rowsPerPage]
  );

  const { data, isLoading } = usePaginatedTenants(params);
  const { deleteTenant } = useDeleteTenant();

  const tenants = data?.tenants || [];
  const total = data?.total || 0;

  const [confirm, setConfirm] = useState({ open: false, id: null });
  const handleDelete = (id) => setConfirm({ open: true, id });
  const closeConfirm = () => setConfirm({ open: false, id: null });
  const confirmDelete = async () => {
    await deleteTenant(confirm.id);
    closeConfirm();
  };

  // Reset to first page when search changes
  useEffect(() => {
    setPage(0);
  }, [search]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Tenants"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Tenants' }]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => navigate(paths.dashboard.tenants.new)}
          >
            New Tenant
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ p: 1 }}>
          <TextField
            fullWidth
            label="Search tenants"
            placeholder="Name, slug, address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Stack>

        <TableContainer>
          <Table size="medium" sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tenants.map((t) => (
                <TableRow key={t._id} hover>
                  <TableCell
                    sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => navigate(paths.dashboard.tenants.details(t._id))}
                  >
                    {t.name}
                  </TableCell>
                  <TableCell>{t.slug}</TableCell>
                  <TableCell>{t?.address?.city || '-'}</TableCell>
                  <TableCell>{t?.contactDetails?.phone || '-'}</TableCell>
                  <TableCell>{t?.contactDetails?.email || '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton color="default" onClick={() => navigate(paths.dashboard.tenants.details(t._id))}>
                      <Iconify icon="solar:eye-bold" />
                    </IconButton>
                    <IconButton color="primary" onClick={() => navigate(paths.dashboard.tenants.edit(t._id))}>
                      <Iconify icon="solar:pen-bold" />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(t._id)}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && tenants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No tenants found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePaginationCustom
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          sx={{ mt: 1 }}
        />
      </Card>

      <ConfirmDialog
        open={confirm.open}
        onClose={closeConfirm}
        title="Delete Tenant?"
        content="This will remove the tenant. This action does not cascade to related records."
        action={
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Delete
          </Button>
        }
      />
    </DashboardContent>
  );
}
