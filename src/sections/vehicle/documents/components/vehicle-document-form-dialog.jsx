import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingButton } from '@mui/lab';
import {
  Stack,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axios from 'src/utils/axios';

import { useVehicle } from 'src/query/use-vehicle';
import {
  getPresignedUploadUrl,
  useCreateVehicleDocument,
  useUpdateVehicleDocument,
} from 'src/query/use-documents';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { DialogSelectButton } from 'src/components/dialog-select-button';

import { KanbanVehicleDialog } from 'src/sections/kanban/components/kanban-vehicle-dialog';

import { DOC_TYPES } from '../config/constants';

async function uploadViaPresigned({ vehicleId, docType, file }) {
  const contentType = file?.type || 'application/octet-stream';
  const extension = (file?.name ?? '')
    .split('.')
    .pop()
    ?.toLowerCase() || (contentType.split('/')[1] || '').toLowerCase();
  const { key, uploadUrl } = await getPresignedUploadUrl({
    vehicleId,
    docType,
    contentType,
    extension,
  });
  await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': contentType }, body: file });
  return key;
}

const AddDocSchema = zod
  .object({
    docType: zod.preprocess((v) => (v == null ? '' : v), zod.string().min(1, 'Type is required')),
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
    const isFileObject = typeof file === 'object' && 'type' in file;
    if (!isFileObject) return; // allow prefilled url
    if ((file.size || 0) > 5 * 1024 * 1024) {
      ctx.addIssue({ code: zod.ZodIssueCode.custom, message: 'Max file size is 5 MB', path: ['file'] });
    }
    const isValidType = /^image\//.test(file.type) || file.type === 'application/pdf';
    if (!isValidType) {
      ctx.addIssue({ code: zod.ZodIssueCode.custom, message: 'Only images or PDF are allowed', path: ['file'] });
    }
  });

export default function VehicleDocumentFormDialog({
  open,
  onClose,
  vehicleId: providedVehicleId,
  mode,
  doc,
  initialVehicle = null,
  disableVehicleSelection = false,
}) {
  const isEdit = mode === 'edit';

  const createDocument = useCreateVehicleDocument();
  const updateDocument = useUpdateVehicleDocument();

  // Vehicle selection (used when vehicleId is not provided)
  const [selectedVehicle, setSelectedVehicle] = useState(initialVehicle);
  const vehicleDialog = useBoolean();

  useEffect(() => {
    if (!open) setSelectedVehicle(initialVehicle || null);
  }, [open, initialVehicle]);

  const effectiveVehicleId = providedVehicleId || selectedVehicle?._id || null;
  const { data: providedVehicle } = useVehicle(providedVehicleId);

  const defaultValues = useMemo(
    () => ({
      docType: doc?.docType || null,
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
    mode: 'all',
  });

  // Pre-populate existing file for edit by fetching a temporary download URL
  const [loadingFile, setLoadingFile] = useState(false);
  const [initialFileSet, setInitialFileSet] = useState(false);

  useEffect(() => {
    if (open) {
      methods.reset(defaultValues);
      setInitialFileSet(false);
    }
  }, [open, defaultValues, methods]);

  const handlePrefillFile = useCallback(async (signal) => {
    if (!isEdit || !doc?._id || initialFileSet || !effectiveVehicleId) return;
    try {
      setLoadingFile(true);
      const { data } = await axios.get(
        `/api/documents/${effectiveVehicleId}/${doc._id}/download`,
        { signal }
      );
      if (!signal?.aborted && data?.url) {
        methods.setValue('file', data.url, { shouldValidate: false });
      }
    } catch (e) {
      // ignore; file may not be available or request aborted
    } finally {
      if (!signal?.aborted) {
        setInitialFileSet(true);
        setLoadingFile(false);
      }
    }
  }, [isEdit, doc?._id, initialFileSet, effectiveVehicleId, methods]);

  useEffect(() => {
    if (open && isEdit && !initialFileSet && !loadingFile) {
      const controller = new AbortController();
      handlePrefillFile(controller.signal);
      return () => controller.abort();
    }
    return undefined;
  }, [open, isEdit, initialFileSet, loadingFile, handlePrefillFile]);

  const handleClose = () => {
    if (!methods.formState.isSubmitting) onClose();
  };

  const onSubmit = async (values) => {
    try {
      const vehicleId = effectiveVehicleId;
      if (!vehicleId) return; // should be disabled by UI

      let fileKeyChanged;
      let nextFileKey;

      if (isEdit) {
        if (values.file && typeof values.file !== 'string') {
          const { file } = values;
          const key = await uploadViaPresigned({ vehicleId, docType: values.docType, file });
          fileKeyChanged = true;
          nextFileKey = key;
        } else if (!values.file) {
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
        let createFileKey;
        if (values.file && typeof values.file !== 'string') {
          const { file } = values;
          createFileKey = await uploadViaPresigned({ vehicleId, docType: values.docType, file });
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
    }
  };

  const selectedVehicleLabel = selectedVehicle?.vehicleNo || providedVehicle?.vehicleNo || '';
  const canSubmit = methods.formState.isValid && !!effectiveVehicleId;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Vehicle Document' : 'Add Vehicle Document'}</DialogTitle>
      <DialogContent dividers>
        <DialogSelectButton
          onClick={vehicleDialog.onTrue}
          placeholder="Choose vehicle"
          selected={selectedVehicleLabel}
          iconName="mdi:truck"
          disabled={isEdit || disableVehicleSelection}
        />

        <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ py: 1 }}>
            <Field.Autocomplete
              name="docType"
              label="Type"
              options={DOC_TYPES}
              getOptionLabel={(o) => o || ''}
              isOptionEqualToValue={(o, v) => o === v}
              placeholder="Select type"
              disableClearable={false}
              autoHighlight
              fullWidth
              disabled={isEdit || !effectiveVehicleId}
            />

            <Field.Text name="docNumber" label="Document Number" disabled={!effectiveVehicleId} />

            <Field.Text
              name="issuer"
              label="Issuer"
              placeholder="ICICI, RTO Karnataka, Govt. of India"
              disabled={!effectiveVehicleId}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Field.DatePicker name="issueDate" label="Issue Date" disabled={!effectiveVehicleId} />
              <Field.DatePicker name="expiryDate" label="Expiry Date" disabled={!effectiveVehicleId} />
            </Stack>

            {isEdit && <Field.Switch name="isActive" label="Mark as active" disabled={!effectiveVehicleId} />}

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
              disabled={!effectiveVehicleId}
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
          disabled={methods.formState.isSubmitting || !canSubmit}
          startIcon={!methods.formState.isSubmitting ? <Iconify icon="eva:checkmark-circle-2-outline" /> : null}
        >
          Save
        </LoadingButton>
      </DialogActions>

      {
        !disableVehicleSelection && !isEdit && (
          <KanbanVehicleDialog
            open={vehicleDialog.value}
            onClose={vehicleDialog.onFalse}
            selectedVehicle={selectedVehicle}
            onVehicleChange={setSelectedVehicle}
            onlyOwn
          />
        )
      }
    </Dialog >
  );
}
