import { Iconify } from '../../../components/iconify';
import { SimpleStepper } from './subtrip-completion-stepper';

export function SubtripStatusStepper({ status }) {
  const statusToStepIndex = {
    'in-Queue': 0,
    loaded: 1,
    error: 2,
    received: 3,
    closed: 4,
    billed: 5,
  };

  const currentStep = statusToStepIndex[status] ?? 0;

  return (
    <SimpleStepper
      steps={['In-Queue', 'Loaded', 'Error', 'Recieved', 'Closed', 'Billed']}
      icons={[
        <Iconify icon="solar:sort-by-time-bold-duotone" width={24} />,
        <Iconify icon="mdi:truck" width={24} />,
        <Iconify icon="material-symbols:error-outline" width={24} />,
        <Iconify icon="material-symbols:call-received" width={24} />,
        <Iconify icon="zondicons:lock-closed" width={24} />,
        <Iconify icon="mdi:progress-tick" width={24} />,
      ]}
      currentStep={currentStep}
    />
  );
}
