import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { paramCase } from 'src/utils/change-case';

import { CONFIG } from 'src/config-global';

import { RouteEditView } from 'src/sections/route/views';

// ----------------------------------------------------------------------

const metadata = { title: `Route edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const currentRoute = useSelector((state) =>
    state.route.routes.find((route) => paramCase(route._id) === id)
  );

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <RouteEditView route={currentRoute} />
    </>
  );
}
