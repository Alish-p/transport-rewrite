import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { fetchPumps } from 'src/redux/slices/pump';
import { useDispatch, useSelector } from 'src/redux/store';

import { DieselPriceCreateView } from 'src/sections/diesel-price/views';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Diesel Price | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPumps());
  }, [dispatch]);

  const { pumps } = useSelector((state) => state.pump);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DieselPriceCreateView pumpsList={pumps || []} />
    </>
  );
}
