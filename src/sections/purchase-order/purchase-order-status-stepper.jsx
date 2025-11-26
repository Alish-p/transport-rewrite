import { Box, Tooltip } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { SimpleStepper } from 'src/sections/subtrip/widgets/subtrip-completion-stepper';

const STATUS_ORDER = ['pending-approval', 'rejected', 'approved', 'purchased', 'received'];

const STATUS_DESCRIPTIONS = {
  'pending-approval': 'Purchase order has been created and is awaiting approval',
  approved: 'Purchase order has been approved and can be processed',
  purchased: 'Items have been purchased / ordered from the vendor',
  received: 'Ordered items have been received into inventory',
  rejected: 'Purchase order was rejected and will not be processed',
};

export function PurchaseOrderStatusStepper({ status }) {
  const statusToStepIndex = STATUS_ORDER.reduce(
    (acc, key, index) => ({ ...acc, [key]: index }),
    {}
  );

  const currentStep = statusToStepIndex[status] ?? 0;

  const stepLabels = STATUS_ORDER.map((statusKey) => {
    const label =
      statusKey === 'pending-approval'
        ? 'Pending Approval'
        : statusKey.charAt(0).toUpperCase() + statusKey.slice(1);

    return (
      <Tooltip key={statusKey} title={STATUS_DESCRIPTIONS[statusKey]} arrow>
        <span>{label}</span>
      </Tooltip>
    );
  });

  const icons = STATUS_ORDER.map((statusKey) => {
    let iconName = 'mdi:clock-outline';

    if (statusKey === 'approved') iconName = 'eva:checkmark-circle-2-outline';
    if (statusKey === 'purchased') iconName = 'mdi:cart-outline';
    if (statusKey === 'received') iconName = 'material-symbols:inventory-2-outline';
    if (statusKey === 'rejected') iconName = 'eva:close-circle-outline';

    return (
      <Tooltip key={statusKey} title={STATUS_DESCRIPTIONS[statusKey]} arrow>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 24,
            height: 24,
          }}
        >
          <Iconify icon={iconName} width={24} />
        </Box>
      </Tooltip>
    );
  });

  return <SimpleStepper steps={stepLabels} icons={icons} currentStep={currentStep} />;
}

