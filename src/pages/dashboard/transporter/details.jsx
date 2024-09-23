import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { paramCase } from 'src/utils/change-case';

import { CONFIG } from 'src/config-global';

import { TransporterDetailView } from 'src/sections/transporter/views';

// ----------------------------------------------------------------------

const metadata = { title: `Transporter details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const currentTransporter = useSelector((state) =>
    state.transporter.transporters.find((transporter) => paramCase(transporter._id) === id)
  );

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TransporterDetailView transporter={currentTransporter} />
    </>
  );
}
