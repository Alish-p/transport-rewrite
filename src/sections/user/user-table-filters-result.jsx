import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

export function UserTableFiltersResult({ filters, onFilters, onResetFilters, totalResults, sx }) {
  const handleRemoveName = useCallback(() => {
    onFilters('name', '');
  }, [onFilters]);

  const handleRemoveDesignation = useCallback(() => {
    onFilters('designation', '');
  }, [onFilters]);

  const handleRemovePermission = useCallback(() => {
    onFilters('permission', '');
  }, [onFilters]);

  return (
    <FiltersResult totalResults={totalResults} onReset={onResetFilters} sx={sx}>
      <FiltersBlock label="Name:" isShow={!!filters.name}>
        <Chip {...chipProps} label={filters.name} onDelete={handleRemoveName} />
      </FiltersBlock>

      <FiltersBlock label="Designation:" isShow={!!filters.designation}>
        <Chip {...chipProps} label={filters.designation} onDelete={handleRemoveDesignation} />
      </FiltersBlock>

      <FiltersBlock label="Permission:" isShow={!!filters.permission}>
        <Chip {...chipProps} label={filters.permission} onDelete={handleRemovePermission} />
      </FiltersBlock>
    </FiltersResult>
  );
}
