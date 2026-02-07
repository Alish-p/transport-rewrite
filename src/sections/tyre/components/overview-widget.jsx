import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function OverviewWidget({ title, total, icon, color = 'primary', unit, sx, ...other }) {
    const theme = useTheme();

    return (
        <Card
            sx={{
                display: 'flex',
                alignItems: 'center',
                p: 3,
                ...sx,
            }}
            {...other}
        >
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>{title}</Typography>

                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h3">{total}</Typography>
                    {unit && <Typography variant="subtitle2" sx={{ color: 'text.secondary', alignSelf: 'flex-end', mb: 1 }}>{unit}</Typography>}
                </Stack>
            </Box>

            <Box
                sx={{
                    width: 120,
                    height: 120,
                    lineHeight: 0,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette[color].main, 0.08),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Iconify icon={icon} width={64} sx={{ color: theme.palette[color].main }} />
            </Box>
        </Card>
    );
}

OverviewWidget.propTypes = {
    color: PropTypes.string,
    icon: PropTypes.string,
    sx: PropTypes.object,
    title: PropTypes.string,
    total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    unit: PropTypes.string,
};
