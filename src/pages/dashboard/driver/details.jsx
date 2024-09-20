import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { paramCase } from '../../../utils/change-case';
import { DriverDetailView } from '../../../sections/driver/views';

// ----------------------------------------------------------------------

const metadata = { title: `Driver details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const currentDriver = useSelector((state) =>
    state.driver.drivers.find((driver) => paramCase(driver._id) === id)
  );

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DriverDetailView driver={currentDriver} />
    </>
  );
}
