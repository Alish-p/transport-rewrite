import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { paramCase } from 'src/utils/change-case';

import { CONFIG } from 'src/config-global';

import { PumpEditView } from 'src/sections/pump/views';

import { useDispatch } from '../../../redux/store';
import { fetchBanks } from '../../../redux/slices/bank';

// ----------------------------------------------------------------------

const metadata = { title: `Pump edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const currentPump = useSelector((state) =>
    state.pump.pumps.find((pump) => paramCase(pump._id) === id)
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

      <PumpEditView pump={currentPump} bankList={banks || []} />
    </>
  );
}
