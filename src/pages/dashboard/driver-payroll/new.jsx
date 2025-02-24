import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useDrivers } from 'src/query/use-driver';

import { EmptyContent } from 'src/components/empty-content';
import { LoadingScreen } from 'src/components/loading-screen';

import { DriverPayrollCreateView } from 'src/sections/driver-payroll/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Driver Payroll | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: drivers, isLoading, isError } = useDrivers();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <EmptyContent />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DriverPayrollCreateView driverList={drivers} />
    </>
  );
}
