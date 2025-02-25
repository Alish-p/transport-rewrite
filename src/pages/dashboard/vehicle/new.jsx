import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { VehicleCreateView } from 'src/sections/vehicle/views';

import { EmptyContent } from '../../../components/empty-content';
import { useTransporters } from '../../../query/use-transporter';
import { LoadingScreen } from '../../../components/loading-screen';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new invoice | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { data: transporters, isLoading, isError } = useTransporters();

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

      <VehicleCreateView transporters={transporters} />
    </>
  );
}
