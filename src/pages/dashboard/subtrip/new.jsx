import { Helmet } from 'react-helmet-async';

import { useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { SubtripCreateView } from 'src/sections/subtrip/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Subtrip | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const searchParams = useSearchParams();
  const currentTrip = searchParams.get('id');

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SubtripCreateView currentTrip={currentTrip} />
    </>
  );
}
