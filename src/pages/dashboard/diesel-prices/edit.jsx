import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useDispatch } from 'src/redux/store';
import { fetchDieselPrice } from 'src/redux/slices/diesel-price';

import { DieselPriceEditView } from 'src/sections/diesel-price/views';

import { fetchPumps } from '../../../redux/slices/pump';

// ----------------------------------------------------------------------

const metadata = { title: `Diesel Price edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const { dieselPrice, isLoading: dieselLoading } = useSelector((state) => state.dieselPrice);
  const { pumps, isLoading: pumpLoading } = useSelector((state) => state.pump);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDieselPrice(id));
    dispatch(fetchPumps());
  }, [dispatch, id]);

  if (dieselLoading || pumpLoading || !dieselPrice || !pumps) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DieselPriceEditView dieselPrice={dieselPrice} pumpsList={pumps} />
    </>
  );
}
