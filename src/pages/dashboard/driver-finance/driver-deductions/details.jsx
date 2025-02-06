import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DriverDeductionsDetailView } from 'src/sections/driver-deductions/views';

// ----------------------------------------------------------------------

const metadata = { title: `Driver Deductions details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DriverDeductionsDetailView />
    </>
  );
}
