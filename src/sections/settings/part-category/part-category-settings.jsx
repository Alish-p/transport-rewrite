import { PART_CATEGORY_GROUP } from 'src/sections/settings/settings-constants';
import { GenericOptionSettings } from 'src/sections/settings/generic/generic-option-settings';

export function PartCategorySettings() {
  return (
    <GenericOptionSettings
      title="Part Categories"
      group={PART_CATEGORY_GROUP}
      addButtonLabel="Add Part Category"
      usageFor="part"
      usageField="category"
    />
  );
}

