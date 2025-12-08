import { PART_MANUFACTURER_GROUP } from 'src/sections/settings/settings-constants';
import { GenericOptionSettings } from 'src/sections/settings/generic/generic-option-settings';

export function PartManufacturerSettings() {
  return (
    <GenericOptionSettings
      title="Part Manufacturers"
      group={PART_MANUFACTURER_GROUP}
      addButtonLabel="Add Part Manufacturer"
      usageFor="part"
      usageField="manufacturer"
    />
  );
}
