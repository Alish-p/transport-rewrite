import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'src/routes/hooks';

import { paramCase } from 'src/utils/change-case';

import { CONFIG } from 'src/config-global';
import { fetchSubtrips } from 'src/redux/slices/subtrip';
import { fetchVehicles } from 'src/redux/slices/vehicle';

import { SubtripEditView } from 'src/sections/subtrip/views';

// ----------------------------------------------------------------------

const metadata = { title: `Subtrip edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();

  const { id = '' } = useParams();

  const currentSubtrip = useSelector((state) =>
    state.subtrip.subtrips.find((subtrip) => paramCase(subtrip._id) === id)
  );

  useEffect(() => {
    dispatch(fetchSubtrips());
    dispatch(fetchVehicles());
  }, [dispatch]);

  const { subtrips } = useSelector((state) => state.subtrip);
  const { vehicles } = useSelector((state) => state.vehicle);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SubtripEditView subtrip={currentSubtrip} subtrips={subtrips} vehicles={vehicles} />
    </>
  );
}
