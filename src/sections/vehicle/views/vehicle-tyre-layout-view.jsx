import { CurrentTyreLayoutView } from './current-tyre-layout-view';
import { VehicleTyreLayoutSelect } from './vehicle-tyre-layout-select';

// ----------------------------------------------------------------------

export function VehicleTyreLayoutView({ vehicle }) {
    if (vehicle?.tyreLayoutId) {
        return <CurrentTyreLayoutView vehicle={vehicle} />;
    }

    return <VehicleTyreLayoutSelect vehicle={vehicle} />;
}
