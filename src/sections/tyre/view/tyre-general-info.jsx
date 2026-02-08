import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

export default function TyreGeneralInfo({ tyre, ...other }) {
    const renderItem = (icon, label, value) => (
        <Stack direction="row" alignItems="center" spacing={2}>
            <Iconify icon={icon} width={24} sx={{ color: 'text.secondary' }} />
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    {label}
                </Typography>
                <Typography variant="subtitle1" noWrap>
                    {value || '-'}
                </Typography>
            </Box>
        </Stack>
    );

    return (
        <Card {...other}>
            <CardHeader title="General Information" />

            <Stack spacing={3} sx={{ p: 3 }}>
                <Box
                    columnGap={2}
                    rowGap={3}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                    }}
                >
                    {renderItem('solar:bookmark-circle-bold', 'Brand', tyre.brand)}
                    {renderItem('solar:tag-bold', 'Model', tyre.model)}
                    {renderItem('solar:ruler-angular-bold', 'Size', tyre.size)}
                    {renderItem('solar:code-file-bold', 'Serial Number', tyre.serialNumber)}
                    {renderItem('solar:dollar-minimalistic-bold', 'Cost', tyre.cost)}
                    {renderItem('solar:file-text-bold', 'PO Number', tyre.purchaseOrderNumber)}
                    {renderItem('solar:calendar-bold', 'Purchase Date', tyre.purchaseDate ? new Date(tyre.purchaseDate).toLocaleDateString() : '-')}
                    {renderItem('mdi:tire', 'Type', tyre.type)}
                </Box>

                {tyre.metadata && (
                    <Box sx={{ pt: 2, borderTop: (theme) => `dashed 1px ${theme.palette.divider}` }}>
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>Metadata</Typography>
                        <Box
                            columnGap={2}
                            rowGap={3}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(2, 1fr)',
                            }}
                        >
                            {renderItem('mdi:refresh', 'Remold Count', tyre.metadata.remoldCount)}
                            {renderItem('mdi:check-circle-outline', 'Remoldable', tyre.metadata.isRemoldable ? 'Yes' : 'No')}
                        </Box>
                    </Box>
                )}
            </Stack>
        </Card>
    );
}
