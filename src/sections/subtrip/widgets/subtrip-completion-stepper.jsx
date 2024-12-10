import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';
import { styled } from '@mui/material/styles';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

// ----------------------------------------------------------------------

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: { borderColor: theme.vars.palette.primary.main },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: { borderColor: theme.vars.palette.primary.main },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderRadius: 1,
    borderTopWidth: 3,
    borderColor: theme.vars.palette.divider,
  },
}));

const CustomStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  zIndex: 1,
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.vars.palette.text.disabled,
  backgroundColor: theme.vars.palette.grey[300],
  ...(ownerState.active && {
    backgroundColor: theme.vars.palette.primary.main,
    color: theme.vars.palette.common.white,
    boxShadow: '0 4px 10px 0 rgba(0,0,0,0.25)',
  }),
  ...(ownerState.completed && {
    backgroundColor: theme.vars.palette.primary.main,
    color: theme.vars.palette.common.white,
  }),
}));

function CustomStepIcon(props) {
  const { active, completed, className, icon } = props;

  return (
    <CustomStepIconRoot ownerState={{ active, completed }} className={className}>
      {icon}
    </CustomStepIconRoot>
  );
}

// ----------------------------------------------------------------------

export function SimpleStepper({ steps, icons, currentStep }) {
  return (
    <Box>
      <Stepper alternativeLabel activeStep={currentStep} connector={<CustomConnector />}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel
              StepIconComponent={(props) => <CustomStepIcon {...props} icon={icons[index]} />}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
