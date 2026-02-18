import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';

import { useGetTyreLayouts } from 'src/query/use-vehicle';

// ----------------------------------------------------------------------

export default function MiniTyreLayout({ layoutId, currentPosition }) {
    const theme = useTheme();
    const { data: layoutsData } = useGetTyreLayouts();
    const layouts = layoutsData?.data || [];

    // Find the layout definition
    const layout = layouts.find((l) => l.id === layoutId);

    if (!layout) {
        return <Box sx={{ width: 40, height: 60, bgcolor: 'action.hover', borderRadius: 1 }} />;
    }

    const positions = layout.tyres || [];

    // Group positions by axle/row
    const getRow = (pos) => {
        if (pos.includes('Axle-1')) return 0;
        if (pos.includes('Axle-2')) return 1;
        if (pos.includes('Axle-3')) return 2;
        if (pos.includes('Axle-4')) return 3;
        if (pos.includes('Axle-5')) return 4;
        return 10; // Other (Stepney)
    };

    // Filter out Stepney for main chassis diagram
    const chassisPositions = positions.filter((p) => !p.includes('Stepney'));

    // Group by row index
    const rows = {};
    chassisPositions.forEach((p) => {
        const r = getRow(p);
        if (!rows[r]) rows[r] = [];
        rows[r].push(p);
    });

    const sortedRowKeys = Object.keys(rows).sort((a, b) => Number(a) - Number(b));

    const renderTyre = (pos) => {
        const isPresent = !!pos;

        if (!isPresent) {
            return <Box sx={{ width: 6, height: 10 }} />;
        }

        const isSelected = currentPosition === pos;

        return (
            <Tooltip title={pos} arrow>
                <Box
                    sx={{
                        width: 8,
                        height: 12,
                        borderRadius: 0.5,
                        bgcolor: isSelected ? 'primary.main' : 'text.disabled',
                        border: isSelected ? `1px solid ${theme.palette.primary.dark}` : 'none',
                        ...(isSelected && {
                            boxShadow: '0 0 0 1px white',
                            zIndex: 1,
                            transform: 'scale(1.2)'
                        })
                    }}
                />
            </Tooltip>
        );
    };

    const renderRow = (rowIndex) => {
        const rowPositions = rows[rowIndex] || [];

        const leftOuter = rowPositions.find((p) => p.includes('Left') && p.includes('Outer'));
        const leftInner = rowPositions.find((p) => p.includes('Left') && p.includes('Inner'));
        const rightInner = rowPositions.find((p) => p.includes('Right') && p.includes('Inner'));
        const rightOuter = rowPositions.find((p) => p.includes('Right') && p.includes('Outer'));

        return (
            <Stack direction="row" spacing={0.5} key={rowIndex} justifyContent="center">
                <Stack direction="row" spacing={0.25}>
                    {renderTyre(leftOuter)}
                    {renderTyre(leftInner)}
                </Stack>
                {/* Spacer represents chassis width */}
                <Box sx={{ width: 12 }} />
                <Stack direction="row" spacing={0.25}>
                    {renderTyre(rightInner)}
                    {renderTyre(rightOuter)}
                </Stack>
            </Stack>
        );
    };

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 0.5,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                bgcolor: 'background.neutral',
            }}
        >
            {/* Simple chassis line */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 2,
                    bottom: 2,
                    left: '50%',
                    width: 20,
                    transform: 'translateX(-50%)',
                    border: `1px dashed ${theme.palette.divider}`,
                    borderRadius: 0.5,
                    zIndex: 0,
                }}
            />

            <Stack spacing={0.5} sx={{ zIndex: 1 }}>
                {sortedRowKeys.map((k) => renderRow(Number(k)))}
            </Stack>
        </Box>
    );
}

