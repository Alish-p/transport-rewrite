import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

export function PartLocationOverviewTab({ partLocation }) {
    const { name, address } = partLocation || {};

    return (
        <Card>
            <CardHeader title="Part Location Details" />
            <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
                <DetailRow label="Location Name" value={name} />
                <DetailRow label="Address" value={address} multiline />
            </Stack>
        </Card>
    );
}

function DetailRow({ label, value, multiline }) {
    return (
        <Stack direction="row" alignItems={multiline ? 'flex-start' : 'center'} spacing={1.5}>
            <Box
                component="span"
                sx={{ color: 'text.secondary', width: 180, flexShrink: 0, typography: 'subtitle2' }}
            >
                {label}
            </Box>
            <Typography sx={{ flexGrow: 1 }}>{value || '-'}</Typography>
        </Stack>
    );
}
