import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { paramCase } from 'src/utils/change-case';

import { CONFIG } from 'src/config-global';

import { VehicleDetailView } from 'src/sections/vehicle/views';

// ----------------------------------------------------------------------

const metadata = { title: `Vehicle details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const currentVehicle = useSelector((state) =>
    state.vehicle.vehicles.find((vehicle) => paramCase(vehicle._id) === id)
  );

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <VehicleDetailView vehicle={currentVehicle} />
    </>
  );
}
