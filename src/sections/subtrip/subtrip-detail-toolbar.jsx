/* eslint-disable react/prop-types */
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { Box, Dialog, Tooltip, MenuList, DialogActions } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import LRPDF from './pdfs/lorry-reciept-pdf';
import { SUBTRIP_STATUS } from './constants';
import IndentPdf from './pdfs/petrol-indent-pdf';
import EntryPassPdf from './pdfs/entry-pass-pdf';
import DriverPaymentPdf from './pdfs/driver-payment-pdf';
import TransporterPayment from './pdfs/transporter-payment-pdf';

// ----------------------------------------------------------------------

export default function SubtripToolbar({
  status,
  backLink,
  subtrip,
  onAddMaterialInfo,
  onRecieve,
  onSubtripClose,
  onEdit,
  onResolve,
}) {
  const actionPopover = usePopover();
  const viewPopover = usePopover();
  const downloadPopover = usePopover();

  const viewLR = useBoolean();
  const viewIntent = useBoolean();
  const viewEntryPass = useBoolean();
  const viewDriverPayment = useBoolean();
  const viewTransporterPayment = useBoolean();

  return (
    <>
      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <Stack spacing={1} direction="row" alignItems="flex-start">
          <Stack spacing={0.5}>
            <Stack spacing={1} direction="row" alignItems="center">
              <Typography variant="h4">Subtrip #{subtrip._id} </Typography>
              <Label
                variant="soft"
                s
                color={
                  (status === SUBTRIP_STATUS.IN_QUEUE && 'warning') ||
                  (status === SUBTRIP_STATUS.LOADED && 'info') ||
                  (status === SUBTRIP_STATUS.RECEIVED && 'secondary') ||
                  (status === SUBTRIP_STATUS.CLOSED && 'success') ||
                  (status === SUBTRIP_STATUS.ERROR && 'error') ||
                  'default'
                }
              >
                {status}
              </Label>
            </Stack>
          </Stack>
        </Stack>

        <Stack
          flexGrow={1}
          spacing={1.5}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Button
            color="primary"
            variant="outlined"
            endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            onClick={actionPopover.onOpen}
            sx={{ textTransform: 'capitalize' }}
          >
            Actions
          </Button>

          <Button
            color="primary"
            variant="outlined"
            startIcon={<Iconify icon="solar:eye-bold" />}
            endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            onClick={viewPopover.onOpen}
            sx={{ textTransform: 'capitalize' }}
          >
            View
          </Button>
          <Button
            color="primary"
            variant="outlined"
            startIcon={<Iconify icon="material-symbols:download" />}
            endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            onClick={downloadPopover.onOpen}
            sx={{ textTransform: 'capitalize' }}
          >
            Download
          </Button>

          <Button
            color="primary"
            variant="outlined"
            startIcon={<Iconify icon="solar:pen-bold" />}
            onClick={onEdit}
          >
            Edit
          </Button>
        </Stack>
      </Stack>

      {/* Actions Popover */}
      <CustomPopover
        open={actionPopover.open}
        onClose={actionPopover.onClose}
        anchorEl={actionPopover.anchorEl}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              actionPopover.onClose();
              onAddMaterialInfo();
            }}
            disabled={!(subtrip.subtripStatus === SUBTRIP_STATUS.IN_QUEUE)}
          >
            Add Material
          </MenuItem>
          <MenuItem
            onClick={() => {
              actionPopover.onClose();
              onRecieve();
            }}
            disabled={!(subtrip.subtripStatus === 'loaded')}
          >
            Recieve Trip
          </MenuItem>
          <MenuItem
            onClick={() => {
              actionPopover.onClose();
              onResolve();
            }}
            disabled={!(subtrip.subtripStatus === 'error')}
          >
            Resolve
          </MenuItem>
          <MenuItem
            onClick={() => {
              actionPopover.onClose();
              onSubtripClose();
            }}
            disabled={!(subtrip.subtripStatus === 'received')}
          >
            Close Trip
          </MenuItem>
        </MenuList>
      </CustomPopover>

      {/* View Popover */}
      <CustomPopover
        open={viewPopover.open}
        onClose={viewPopover.onClose}
        anchorEl={viewPopover.anchorEl}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              viewPopover.onClose();
              viewLR.onTrue();
            }}
            disabled={subtrip.subtripStatus === SUBTRIP_STATUS.IN_QUEUE}
          >
            Lorry Receipt (LR)
          </MenuItem>
          <MenuItem
            onClick={() => {
              viewPopover.onClose();
              viewIntent.onTrue();
            }}
            disabled={subtrip.subtripStatus === SUBTRIP_STATUS.IN_QUEUE}
          >
            Petrol Pump Intent
          </MenuItem>
          <MenuItem
            onClick={() => {
              viewPopover.onClose();
              viewEntryPass.onTrue();
            }}
            disabled={subtrip.subtripStatus === SUBTRIP_STATUS.IN_QUEUE}
          >
            Entry Pass
          </MenuItem>
          <MenuItem
            onClick={() => {
              viewPopover.onClose();
              viewDriverPayment.onTrue();
            }}
            disabled={subtrip.subtripStatus === SUBTRIP_STATUS.IN_QUEUE}
          >
            Driver Payment
          </MenuItem>
          {!subtrip?.tripId?.vehicleId?.isOwn && (
            <MenuItem
              onClick={() => {
                viewPopover.onClose();
                viewTransporterPayment.onTrue();
              }}
              disabled={subtrip.subtripStatus === SUBTRIP_STATUS.IN_QUEUE}
            >
              Transporter Payment
            </MenuItem>
          )}
        </MenuList>
      </CustomPopover>

      {/* Download Popover */}
      <CustomPopover
        open={downloadPopover.open}
        onClose={downloadPopover.onClose}
        anchorEl={downloadPopover.anchorEl}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <PDFDownloadLink
            document={<LRPDF subtrip={subtrip} />}
            fileName={subtrip._id}
            style={{ textDecoration: 'none', color: 'green' }}
            onClick={() => {
              downloadPopover.onClose();
            }}
          >
            {({ loading }) => (
              <Tooltip title="Download">
                <Button
                  startIcon={
                    loading ? (
                      <Iconify icon="line-md:loading-loop" />
                    ) : (
                      <Iconify icon="eva:download-fill" />
                    )
                  }
                >
                  LR
                </Button>
              </Tooltip>
            )}
          </PDFDownloadLink>

          <PDFDownloadLink
            document={<IndentPdf subtrip={subtrip} />}
            fileName={`${subtrip._id}_indent`}
            style={{ textDecoration: 'none', color: 'green' }}
            onClick={() => {
              downloadPopover.onClose();
            }}
          >
            {({ loading }) => (
              <Tooltip title="Download">
                <Button
                  startIcon={
                    loading ? (
                      <Iconify icon="line-md:loading-loop" />
                    ) : (
                      <Iconify icon="eva:download-fill" />
                    )
                  }
                >
                  Petrol Pump Indent
                </Button>
              </Tooltip>
            )}
          </PDFDownloadLink>
        </MenuList>
      </CustomPopover>

      {/* View LR Dialog */}
      <Dialog fullScreen open={viewLR.value}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              p: 1.5,
            }}
          >
            <Button color="primary" variant="outlined" onClick={viewLR.onFalse}>
              Close
            </Button>
          </DialogActions>

          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <LRPDF subtrip={subtrip} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>

      {/* View Intent Dialog */}
      <Dialog fullScreen open={viewIntent.value}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              p: 1.5,
            }}
          >
            <Button color="primary" variant="outlined" onClick={viewIntent.onFalse}>
              Close
            </Button>
          </DialogActions>

          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <IndentPdf subtrip={subtrip} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>

      {/* View EntryPass Dialog */}
      <Dialog fullScreen open={viewEntryPass.value}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              p: 1.5,
            }}
          >
            <Button color="primary" variant="outlined" onClick={viewEntryPass.onFalse}>
              Close
            </Button>
          </DialogActions>

          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <EntryPassPdf subtrip={subtrip} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>

      {/* View Driver Payment Dialog */}
      <Dialog fullScreen open={viewDriverPayment.value}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              p: 1.5,
            }}
          >
            <Button color="primary" variant="outlined" onClick={viewDriverPayment.onFalse}>
              Close
            </Button>
          </DialogActions>

          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <DriverPaymentPdf subtrip={subtrip} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
      {/* View Transporter Payment Dialog */}
      <Dialog fullScreen open={viewTransporterPayment.value}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              p: 1.5,
            }}
          >
            <Button color="primary" variant="outlined" onClick={viewTransporterPayment.onFalse}>
              Close
            </Button>
          </DialogActions>

          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <TransporterPayment subtrip={subtrip} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
