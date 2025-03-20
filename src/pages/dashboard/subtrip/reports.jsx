import { Helmet } from 'react-helmet-async';

import { SubtripReportsView } from 'src/sections/subtrip/views';

// ----------------------------------------------------------------------

export default function SubtripReportsPage() {
  return (
    <>
      <Helmet>
        <title> Subtrip: Reports</title>
      </Helmet>

      <SubtripReportsView />
    </>
  );
}
