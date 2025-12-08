import Typography from '@mui/material/Typography';

export const GENERIC_OPTION_COLUMNS = [
    {
        id: 'label',
        label: 'Name',
        defaultVisible: true,
        disabled: true,
        getter: (row) => row.label || row.value || '',
        render: (row) => {
            const value = row.label || row.value || '';
            return (
                <Typography variant="body2" noWrap>
                    {value}
                </Typography>
            );
        },
    },
    {
        id: 'usage',
        label: 'Usage',
        defaultVisible: true,
        disabled: false,
        getter: (row) => row.usageLabel || row.usageCount || '',
        render: (row) => {
            const value =
                row.usageLabel ||
                (typeof row.usageCount === 'number'
                    ? `${row.usageCount} ${row.usageFor || 'usage'}${row.usageCount === 1 ? '' : 's'}`
                    : '');
            return (
                <Typography variant="body2" color={value ? 'success.main' : 'text.disabled'} noWrap>
                    {value || '—'}
                </Typography>
            );
        },
    },
];
