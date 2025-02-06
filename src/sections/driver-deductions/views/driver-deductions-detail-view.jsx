import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { fetchDriverDeduction } from 'src/redux/slices/driver-deductions';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import DriverDeductionsToolbar from '../driver-deductions-toolbar';
import DriverDeductionsPreview from '../driver-deductions-preview';

export function DriverDeductionsDetailView() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { driverDeduction, isLoading } = useSelector((state) => state.driverDeduction);

  useEffect(() => {
    dispatch(fetchDriverDeduction(id));
  }, [dispatch, id]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Driver Deductions Detail"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Driver Deductions', href: paths.dashboard.driverDeductions.root },
          { name: id },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {driverDeduction && <DriverDeductionsToolbar driverDeduction={driverDeduction} />}

      {driverDeduction && !isLoading && (
        <DriverDeductionsPreview driverDeduction={driverDeduction} />
      )}
    </DashboardContent>
  );
}
