import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { dispatch } from 'src/redux/store';
import { fetchSubtrip } from 'src/redux/slices/subtrip';

import { SubtripDetailView } from 'src/sections/subtrip/views';

// ----------------------------------------------------------------------

const metadata = { title: `Subtrip details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchSubtrip(id));
  }, [id]);

  const { subtrip: subtripData, isLoading } = useSelector((state) => state.subtrip);

  console.log(subtripData);

  if (isLoading) return <div>Loading...</div>;
  if (!subtripData) return <div>Fetching...</div>;

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SubtripDetailView subtrip={subtripData} loading={isLoading} />
    </>
  );
}
