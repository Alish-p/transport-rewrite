import { toast } from 'sonner';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import {
  Box,
  Tab,
  Card,
  Tabs,
  Stack,
  Table,
  Button,
  Dialog,
  TableRow,
  MenuItem,
  TableHead,
  TableCell,
  TableBody,
  CardHeader,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axios from 'src/utils/axios';
import { fDate } from 'src/utils/format-time';

import {
  getPresignedUploadUrl,
  useCreateVehicleDocument,
  useUpdateVehicleDocument,
  useDeleteVehicleDocument,
  useVehicleActiveDocuments,
  useVehicleDocumentHistory,
  useVehicleMissingDocuments,
} from 'src/query/use-vehicle-document';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { getExpiryStatus, getStatusMeta } from 'src/sections/vehicle/utils/document-utils';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { TableNoData, TableSkeleton } from 'src/components/table';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

const DOC_TYPES = ['Insurance', 'PUC', 'RC', 'Fitness', 'Permit', 'Tax', 'Other'];

const AddDocSchema = zod
  .object({
    docType: zod.string().min(1, 'Type is required'),
    docNumber: zod.string().min(1, 'Document number is required'),
    issuer: zod.string().optional(),
    issueDate: schemaHelper.date().optional(),
    expiryDate: schemaHelper.date().optional(),
    isActive: zod.boolean().optional(),
    file: zod.any().optional().nullable(),
  })
  .superRefine((val, ctx) => {
    const { file } = val;
    if (!file) return; // optional
    // If file is a string (prefilled URL), skip validations
    const isFileObject = typeof file === 'object' && 'type' in file;
    if (!isFileObject) return;
    if ((file.size || 0) > 5 * 1024 * 1024) {
      ctx.addIssue({ code: zod.ZodIssueCode.custom, message: 'Max file size is 5 MB', path: ['file'] });
    }
    const isValidType = /^image\//.test(file.type) || file.type === 'application/pdf';
    if (!isValidType) {
      ctx.addIssue({ code: zod.ZodIssueCode.custom, message: 'Only images or PDF are allowed', path: ['file'] });
    }
  });

export function VehicleDocumentsWidget({ vehicleId }) {
  const addDialog = useBoolean();
  const [tab, setTab] = useState('current');

  const {
    data: activeDocs,
    isLoading: loadingActive,
  } = useVehicleActiveDocuments(vehicleId);
  const {
    data: historyDocs,
    isLoading: loadingHistory,
  } = useVehicleDocumentHistory(vehicleId);

  const loading = loadingActive || loadingHistory;

  // Required vs present summary (simple chips)
  const { data: missingData, isLoading: loadingMissing } = useVehicleMissingDocuments(vehicleId);
  const requiredTypes = missingData?.required && missingData.required.length > 0 ? missingData.required : DOC_TYPES;

  const getDocByType = (type) => (activeDocs || []).find((d) => String(d.docType).toLowerCase() === String(type).toLowerCase());

  return (
    <Card>
      <CardHeader
        title="Documents"
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={addDialog.onTrue}
          >
            Add Document
          </Button>
        }
      />

      <Tabs
        value={tab}
        onChange={(_e, v) => setTab(v)}
        sx={{ px: 3, mt: 1 }}
        variant="scrollable"
        allowScrollButtonsMobile
      >
        <Tab
          value="current"
          label="Current"
          icon={<Iconify icon="mdi:file-check-outline" sx={{ color: 'success.main' }} />}
          iconPosition="start"
        />
        <Tab
          value="history"
          label="History"
          icon={<Iconify icon="mdi:archive-clock-outline" sx={{ color: 'text.secondary' }} />}
          iconPosition="start"
        />
      </Tabs>

      {/* Required documents quick status */}
      <Box sx={{ px: 3, pt: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          {(loading || loadingMissing) && (
            <Typography variant="caption" color="text.secondary">Checking…</Typography>
          )}
        </Stack>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {requiredTypes.map((t) => {
            const doc = getDocByType(t);
            const status = doc ? getExpiryStatus(doc.expiryDate) || 'Valid' : 'Missing';
            const meta = getStatusMeta(status);

            // Tooltip message
            let tip = 'Required document';
            if (!doc) {
              tip = `Missing — add ${t}`;
            } else if (!doc.expiryDate) {
              tip = 'Present — no expiry date';
            } else {
              const now = new Date();
              const exp = new Date(doc.expiryDate);
              const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              if (diffDays < 0) tip = `Expired ${Math.abs(diffDays)} days ago on ${fDate(exp)}`;
              else if (diffDays <= 15) tip = `Expiring in ${diffDays} days on ${fDate(exp)}`;
              else tip = `Valid — expires in ${diffDays} days on ${fDate(exp)}`;
            }

            return (
              <Tooltip key={t} title={tip} arrow placement="top">
                <span>
                  <Label
                    color={meta?.color || 'default'}
                    variant="soft"
                    startIcon={<Iconify icon={meta?.icon || 'mdi:minus-circle-outline'} />}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {t}
                  </Label>
                </span>
              </Tooltip>
            );
          })}
        </Stack>
      </Box>

      {tab === 'current' && (
        <Box sx={{ p: 3, pt: 2, overflowX: { xs: 'auto', md: 'visible' } }}>
          {loading ? (
            <TableSkeleton sx={{ minWidth: 720 }} rowCount={3} headCount={6} />
          ) : (
            <DocumentsTable
              rows={activeDocs || []}
              vehicleId={vehicleId}
              emptyLabel="No active documents"
            />
          )}
        </Box>
      )}

      {tab === 'history' && (
        <Box sx={{ p: 3, pt: 2, overflowX: { xs: 'auto', md: 'visible' } }}>
          {loading ? (
            <TableSkeleton sx={{ minWidth: 720 }} rowCount={3} headCount={7} />
          ) : (
            <DocumentsTable
              rows={historyDocs || []}
              vehicleId={vehicleId}
              showActive
              emptyLabel="No history"
            />
          )}
        </Box>
      )}

      <VehicleDocumentFormDialog
        open={addDialog.value}
        onClose={addDialog.onFalse}
        vehicleId={vehicleId}
        mode="create"
      />
    </Card>
  );
}

function DocumentsTable({ rows, vehicleId, showActive = false, emptyLabel = 'No data' }) {
  const hasRows = Array.isArray(rows) && rows.length > 0;
  const [editing, setEditing] = useState(null);
  const confirmDelete = useBoolean();
  const [selectedDoc, setSelectedDoc] = useState(null);

  const onEdit = (row) => setEditing(row);
  const onDelete = (row) => {
    setSelectedDoc(row);
    confirmDelete.onTrue();
  };
  const handleDownload = async (row) => {
    try {
      const { data } = await axios.get(
        `/api/vehicles/${vehicleId}/documents/${row._id}/download`
      );
      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        toast.error('No download URL received');
      }
    } catch (e) {
      const msg = e?.message || 'Failed to get download link';
      toast.error(msg);
    }
  };
  const renderStatus = (status) => {
    if (!status) return '-';
    const cfg = getStatusMeta(status);
    if (!cfg) return '-';
    return (
      <Label color={cfg.color} startIcon={<Iconify icon={cfg.icon} />}>
        {status}
      </Label>
    );
  };

  return (
    <>
      <Table size="small" sx={{ minWidth: 720 }}>
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Number</TableCell>
            <TableCell>Issue Date</TableCell>
            <TableCell>Expiry Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align='center' >Actions</TableCell>
            {showActive && <TableCell>Active</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {!hasRows && <TableNoData notFound title={emptyLabel} />}
          {rows?.map((d) => (
            <TableRow key={d._id} hover>
              <TableCell sx={{ textTransform: 'capitalize' }}>{d.docType}</TableCell>
              <TableCell>{d.docNumber || '-'}</TableCell>
              <TableCell>{d.issueDate ? fDate(d.issueDate) : '-'}</TableCell>
              <TableCell>{d.expiryDate ? fDate(d.expiryDate) : '-'}</TableCell>
              <TableCell>{renderStatus(getExpiryStatus(d.expiryDate))}</TableCell>
              <TableCell align='center' >

                <Tooltip title="Download">
                  <IconButton size="small" onClick={() => handleDownload(d)}>
                    <Iconify icon="eva:download-outline" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => onEdit(d)}>
                    <Iconify icon="eva:edit-2-outline" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" color="error" onClick={() => onDelete(d)}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>

              </TableCell>
              {showActive && (
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                      bgcolor: d.isActive ? 'success.soft' : 'grey.200',
                      color: d.isActive ? 'success.main' : 'text.secondary',
                      fontSize: 12,
                    }}
                  >
                    {d.isActive ? 'Yes' : 'No'}
                  </Box>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <VehicleDocumentFormDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        vehicleId={vehicleId}
        doc={editing}
        mode="edit"
      />
      <ConfirmDeleteDocument
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        vehicleId={vehicleId}
        doc={selectedDoc}
      />
    </>
  );
}

function VehicleDocumentFormDialog({ open, onClose, vehicleId, mode, doc }) {
  const createDocument = useCreateVehicleDocument();
  const updateDocument = useUpdateVehicleDocument();
  const isEdit = mode === 'edit';

  const defaultValues = useMemo(
    () => ({
      docType: doc?.docType || '',
      docNumber: doc?.docNumber || '',
      issuer: doc?.issuer || '',
      issueDate: doc?.issueDate ? new Date(doc.issueDate) : new Date(),
      expiryDate: doc?.expiryDate
        ? new Date(doc.expiryDate)
        : new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      isActive: !!doc?.isActive,
      file: null,
    }),
    [doc]
  );

  const methods = useForm({
    resolver: zodResolver(AddDocSchema),
    defaultValues,
    values: defaultValues,
    mode: 'all',
  });

  // pre-populate existing file for edit by fetching a temporary download URL
  const [loadingFile, setLoadingFile] = useState(false);
  const [initialFileSet, setInitialFileSet] = useState(false);

  // Reset form state and flags when dialog closes so it opens fresh next time
  useEffect(() => {
    if (!open) {
      methods.reset(defaultValues);
      setInitialFileSet(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handlePrefillFile = async () => {
    if (!isEdit || !doc?._id || initialFileSet) return;
    try {
      setLoadingFile(true);
      const { data } = await axios.get(`/api/vehicles/${vehicleId}/documents/${doc._id}/download`);
      if (data?.url) {
        methods.setValue('file', data.url, { shouldValidate: false });
      }
    } catch (e) {
      // ignore; file may not be available
    } finally {
      setInitialFileSet(true);
      setLoadingFile(false);
    }
  };

  useEffect(() => {
    if (open && isEdit && !initialFileSet && !loadingFile) {
      handlePrefillFile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isEdit, doc?._id]);

  const handleClose = () => {
    if (!methods.formState.isSubmitting) onClose();
  };

  const onSubmit = async (values) => {
    try {

      // compute file change state
      let fileKeyChanged;
      let nextFileKey;

      // Only pre-compute upload/removal for edit flow.
      // For create flow, handle upload inside the create branch below.
      if (isEdit) {
        if (values.file && typeof values.file !== 'string') {
          // user selected a new file
          const { file } = values;
          const contentType = file.type;
          const { key, uploadUrl } = await getPresignedUploadUrl({
            vehicleId,
            docType: values.docType,
            contentType,
          });
          await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': contentType },
            body: file,
          });
          fileKeyChanged = true;
          nextFileKey = key;
        } else if (!values.file) {
          // user removed the file
          fileKeyChanged = true;
          nextFileKey = null;
        }
      }

      if (isEdit) {
        const payload = {
          docType: values.docType,
          docNumber: values.docNumber,
          issuer: values.issuer?.trim() ? values.issuer.trim() : undefined,
          issueDate: values.issueDate || undefined,
          expiryDate: values.expiryDate || undefined,
          isActive: values.isActive,
          ...(fileKeyChanged ? { fileKey: nextFileKey } : {}),
        };
        await updateDocument({ vehicleId, docId: doc?._id, payload });
      } else {
        // create
        let createFileKey;
        if (values.file && typeof values.file !== 'string') {
          const { file } = values;
          const contentType = file.type;
          const { key, uploadUrl } = await getPresignedUploadUrl({
            vehicleId,
            docType: values.docType,
            contentType,
          });
          await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': contentType },
            body: file,
          });
          createFileKey = key;
        }
        await createDocument({
          vehicleId,
          payload: {
            docType: values.docType,
            docNumber: values.docNumber,
            issuer: values.issuer?.trim() ? values.issuer.trim() : undefined,
            issueDate: values.issueDate || undefined,
            expiryDate: values.expiryDate || undefined,
            ...(createFileKey ? { fileKey: createFileKey } : {}),
          },
        });
      }

      onClose();
    } catch (err) {
      // handled by hooks; upload errors logged
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      // react-hook-form manages isSubmitting
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Vehicle Document' : 'Add Vehicle Document'}</DialogTitle>
      <DialogContent dividers>
        <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ py: 1 }}>
            <Field.Select name="docType" label="Type">
              <MenuItem value="">Select type</MenuItem>
              {DOC_TYPES.map((t) => (
                <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize' }}>
                  {t}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Text name="docNumber" label="Document Number" />

            <Field.Text
              name="issuer"
              label="Issuer"
              placeholder="ICICI, RTO Karnataka, Govt. of India"
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Field.DatePicker name="issueDate" label="Issue Date" />
              <Field.DatePicker name="expiryDate" label="Expiry Date" />
            </Stack>

            {isEdit && <Field.Switch name="isActive" label="Mark as active" />}

            <Field.Upload
              name="file"
              multiple={false}
              accept={{ 'image/*': [], 'application/pdf': [] }}
              maxSize={5 * 1024 * 1024}
              helperText={
                <Typography variant="caption" color="text.secondary">
                  File is optional. Accepted: images or PDF. Max size 5MB.
                </Typography>
              }
            />
          </Stack>
        </Form>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={handleClose} disabled={methods.formState.isSubmitting}>
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          onClick={methods.handleSubmit(onSubmit)}
          loading={methods.formState.isSubmitting}
          disabled={methods.formState.isSubmitting || !methods.formState.isValid}
          startIcon={!methods.formState.isSubmitting ? <Iconify icon="eva:checkmark-circle-2-outline" /> : null}
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

function ConfirmDeleteDocument({ open, onClose, vehicleId, doc }) {
  const del = useDeleteVehicleDocument();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await del({ vehicleId, docId: doc?._id });
      onClose();
    } catch (e) {
      // handled by hook toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title="Delete document?"
      content={`This will remove ${doc?.docType || 'document'} record. File on storage is not deleted.`}
      action={
        <Button color="error" variant="contained" onClick={handleDelete} disabled={loading}>
          {loading ? <CircularProgress size={18} /> : 'Delete'}
        </Button>
      }
    />
  );
}
