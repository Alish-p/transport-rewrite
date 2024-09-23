import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { paramCase } from 'src/utils/change-case';

import { CONFIG } from 'src/config-global';

import { DriverDetailView } from 'src/sections/driver/views';

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
