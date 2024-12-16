import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { paramCase } from 'src/utils/change-case';

import { CONFIG } from 'src/config-global';
import { useDispatch } from 'src/redux/store';
import { fetchBanks } from 'src/redux/slices/bank';

import { DriverEditView } from 'src/sections/driver/views';

// ----------------------------------------------------------------------

const metadata = { title: `Driver edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const currentDriver = useSelector((state) =>
    state.driver.drivers.find((driver) => paramCase(driver._id) === id)
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBanks());
  }, [dispatch]);

  const { banks } = useSelector((state) => state.bank);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DriverEditView driver={currentDriver} bankList={banks || []} />
    </>
  );
}
