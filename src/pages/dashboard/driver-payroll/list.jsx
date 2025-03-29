import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DriverPayrollListView } from 'src/sections/driver-payroll/views';

import { EmptyContent } from '../../../components/empty-content';
import { LoadingScreen } from '../../../components/loading-screen';
import { useDriverPayrolls } from '../../../query/use-driver-payroll';

// ----------------------------------------------------------------------

const metadata = { title: `DriverPayroll list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: driversPayrolls, isLoading, isError } = useDriverPayrolls();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <EmptyContent
        filled
        title="Error Fetching Driver's Payroll !"
        sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DriverPayrollListView driversPayrolls={driversPayrolls} />
    </>
  );
}
