import { Helmet } from 'react-helmet-async';

import { SubtripBilledPaidView } from 'src/sections/subtrip/views/subtrip-billed-paid-view';

// ----------------------------------------------------------------------

export default function SubtripBilledPaidPage() {
  return (
    <>
      <Helmet>
        <title> Subtrip: Billed Paid List</title>
      </Helmet>

      <SubtripBilledPaidView />
    </>
  );
}
