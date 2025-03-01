import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

export function UserTableFiltersResult({ filters, onResetPage, totalResults, sx }) {
  const handleRemoveName = useCallback(() => {
    onResetPage();
    filters.setState({ name: '' });
  }, [filters, onResetPage]);

  const handleRemoveDesignation = useCallback(() => {
    onResetPage();
    filters.setState({ designation: '' });
  }, [filters, onResetPage]);

  const handleReset = useCallback(() => {
    onResetPage();
    filters.onResetState();
  }, [filters, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Name:" isShow={!!filters.state.name}>
        <Chip {...chipProps} label={filters.state.name} onDelete={handleRemoveName} />
      </FiltersBlock>

      <FiltersBlock label="Designation:" isShow={!!filters.state.designation}>
        <Chip {...chipProps} label={filters.state.designation} onDelete={handleRemoveDesignation} />
      </FiltersBlock>
    </FiltersResult>
  );
}
