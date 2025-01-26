import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DriverPayrollDetailView } from 'src/sections/driver-payroll/views';

// ----------------------------------------------------------------------

const metadata = { title: `Driver Payroll details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DriverPayrollDetailView />
    </>
  );
}
