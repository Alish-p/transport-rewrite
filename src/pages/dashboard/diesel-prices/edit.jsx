import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { paramCase } from 'src/utils/change-case';

import { CONFIG } from 'src/config-global';
import { useDispatch } from 'src/redux/store';
import { fetchDieselPrices } from 'src/redux/slices/diesel-price';

import { DieselPriceEditView } from 'src/sections/diesel-price/views';

// ----------------------------------------------------------------------

const metadata = { title: `Diesel Price edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const currentDieselPrice = useSelector((state) =>
    state.dieselPrice.dieselPrices.find((price) => paramCase(price._id) === id)
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDieselPrices());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DieselPriceEditView dieselPrice={currentDieselPrice} />
    </>
  );
}
