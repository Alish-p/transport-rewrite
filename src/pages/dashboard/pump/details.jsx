import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { paramCase } from '../../../utils/change-case';
import { PumpDetailView } from '../../../sections/pump/views';

// ----------------------------------------------------------------------

const metadata = { title: `Pump details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const currentPump = useSelector((state) =>
    state.pump.pumps.find((pump) => paramCase(pump._id) === id)
  );

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PumpDetailView pump={currentPump} />
    </>
  );
}
