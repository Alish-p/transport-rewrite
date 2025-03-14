import { Tooltip } from '@mui/material';

import { Iconify } from '../../../components/iconify';
import { SimpleStepper } from './subtrip-completion-stepper';

export function SubtripStatusStepper({ status }) {
  const statusToStepIndex = {
    'in-queue': 0,
    loaded: 1,
    error: 2,
    received: 3,
    closed: 4,
    'billed-pending': 5,
    'billed-overdue': 6,
    'billed-paid': 7,
  };

  const statusDescriptions = {
    'in-queue':
      'Initial state: Consignment is created and assigned to a vehicle, waiting to be loaded',
    loaded: 'Vehicle is fully loaded with goods and has departed for delivery',
    error:
      'Issues detected: Problems with documentation or other complications that need resolution',
    received: 'Goods have been successfully delivered and received at the destination',
    closed: 'All trip details verified and documentation completed',
    'billed-pending': 'Invoice generated and sent, awaiting payment within due date',
    'billed-overdue': 'Payment deadline has passed, invoice amount still pending',
    'billed-paid': 'Payment received in full, transaction completed',
  };

  const currentStep = statusToStepIndex[status] ?? 0;

  const steps = [
    'In-Queue',
    'Loaded',
    'Error',
    'Received',
    'Closed',
    'Billed Pending',
    'Billed Overdue',
    'Billed Paid',
  ];

  const icons = [
    <Tooltip title={statusDescriptions['in-queue']} arrow>
      <span>
        <Iconify icon="solar:sort-by-time-bold-duotone" width={24} />
      </span>
    </Tooltip>,
    <Tooltip title={statusDescriptions.loaded} arrow>
      <span>
        <Iconify icon="mdi:truck" width={24} />
      </span>
    </Tooltip>,
    <Tooltip title={statusDescriptions.error} arrow>
      <span>
        <Iconify icon="material-symbols:error-outline" width={24} />
      </span>
    </Tooltip>,
    <Tooltip title={statusDescriptions.received} arrow>
      <span>
        <Iconify icon="material-symbols:call-received" width={24} />
      </span>
    </Tooltip>,
    <Tooltip title={statusDescriptions.closed} arrow>
      <span>
        <Iconify icon="zondicons:lock-closed" width={24} />
      </span>
    </Tooltip>,
    <Tooltip title={statusDescriptions['billed-pending']} arrow>
      <span>
        <Iconify icon="mdi:file-document-alert" width={24} />
      </span>
    </Tooltip>,
    <Tooltip title={statusDescriptions['billed-overdue']} arrow>
      <span>
        <Iconify icon="mdi:file-document-alert-outline" width={24} />
      </span>
    </Tooltip>,
    <Tooltip title={statusDescriptions['billed-paid']} arrow>
      <span>
        <Iconify icon="mdi:file-document-check" width={24} />
      </span>
    </Tooltip>,
  ];

  return (
    <SimpleStepper
      steps={steps.map((step, index) => (
        <Tooltip key={step} title={statusDescriptions[Object.keys(statusToStepIndex)[index]]} arrow>
          <span>{step}</span>
        </Tooltip>
      ))}
      icons={icons}
      currentStep={currentStep}
    />
  );
}
