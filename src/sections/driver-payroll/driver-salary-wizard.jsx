import React, { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import {
  Card,
  Step,
  Stack,
  Button,
  Stepper,
  StepLabel,
  StepContent,
  Alert,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import DriverSalaryForm from './driver-salary-form';
import DriverSalaryPreview from './driver-salary-preview';

export default function DriverSalaryWizard({ formMethods, driverList, onSubmit }) {
  const [activeStep, setActiveStep] = useState(0);

  const {
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
  } = formMethods;

  const steps = [
    { label: 'Fill Details' },
    { label: 'Preview & Submit' },
  ];

  const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          {errors.root && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.root.message}
            </Alert>
          )}
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent TransitionProps={{ unmountOnExit: false }}>
                  {index === 0 && <DriverSalaryForm driverList={driverList} />}
                  {index === 1 && <DriverSalaryPreview driverList={driverList} />}
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button disabled={index === 0} onClick={handleBack}>
                      Back
                    </Button>
                    {index < steps.length - 1 ? (
                      <Button variant="contained" onClick={handleNext} disabled={!isValid}>
                        Continue
                      </Button>
                    ) : (
                      <LoadingButton type="submit" variant="contained" loading={isSubmitting} disabled={!isValid}>
                        Create Salary
                      </LoadingButton>
                    )}
                  </Stack>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Card>
      </form>
    </FormProvider>
  );
}
