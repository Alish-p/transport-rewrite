import { Helmet } from 'react-helmet-async';

import { SubtripReportsView } from 'src/sections/subtrip/views';

// ----------------------------------------------------------------------

export default function SubtripBilledPaidPage() {
  return (
    <>
      <Helmet>
        <title> Subtrip: Billed Paid List</title>
      </Helmet>

      <SubtripReportsView />
    </>
  );
}
