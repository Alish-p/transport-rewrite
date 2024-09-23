/* eslint-disable react/prop-types */

// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Tooltip, MenuList } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components/router-link';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
// ----------------------------------------------------------------------

export default function TripToolbar({
  status,
  backLink,
  tripData,
  onTripClose,
  onEdit,
  isCloseDisabled,
}) {
  const popover = usePopover();

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
          <IconButton component={RouterLink} href={backLink}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>

          <Stack spacing={0.5}>
            <Stack spacing={1} direction="row" alignItems="center">
              <Typography variant="h4">Trip #{tripData._id} </Typography>
              <Label
                variant="soft"
                color={
                  (status === 'completed' && 'success') ||
                  (status === 'In-queue' && 'warning') ||
                  (status === 'cancelled' && 'error') ||
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
            onClick={popover.onOpen}
            sx={{ textTransform: 'capitalize' }}
          >
            Actions
          </Button>

          <Button
            color="primary"
            variant="outlined"
            startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}
          >
            Print
          </Button>

          {/* <PDFDownloadLink
            document={<LRPDF subtrip={tripData} />}
            fileName={tripData._id}
            style={{ textDecoration: 'none' }}
            color="green"
          >
            {({ loading }) => (
              <Tooltip title="Download">
                <IconButton>
                  {loading ? (
                    <CircularProgress size={24} color="primary" />
                  ) : (
                    <Iconify icon="eva:download-fill" />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </PDFDownloadLink> */}

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

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorEl={popover.anchorEl}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <Tooltip
            title={
              isCloseDisabled
                ? 'All subtrips must be in the "billed" state before you can close this trip.'
                : ''
            }
            disableHoverListener={!isCloseDisabled}
            placement="right"
          >
            <span>
              <MenuItem
                onClick={() => {
                  onTripClose();
                  popover.onClose();
                }}
                disabled={isCloseDisabled}
              >
                Close Trip
              </MenuItem>
            </span>
          </Tooltip>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            Bill Trip
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
