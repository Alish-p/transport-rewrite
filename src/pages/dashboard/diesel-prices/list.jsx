import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DieselPriceListView } from 'src/sections/diesel-price/views';

import { useDispatch } from '../../../redux/store';
import { fetchPumps } from '../../../redux/slices/pump';
// ----------------------------------------------------------------------

const metadata = { title: `Diesel Price List | Dashboard - ${CONFIG.site.name}` };

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

      <DieselPriceListView pumpsList={pumps} />
    </>
  );
}
