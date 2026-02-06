import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function TyreLayoutDiagram({ positions = [], selectedPosition, onSelect, sx }) {
    const theme = useTheme();

    // Group positions by axle/row
    const getRow = (pos) => {
        if (pos.includes('Front')) return 0;
        if (pos.includes('Rear First')) return 1;
        if (pos.includes('Rear Second')) return 2;
        if (pos.includes('Rear Third')) return 3;
        if (pos.includes('Rear Fourth')) return 4;
        return 10; // Other (Stepney)
    };

    // Filter out Stepney for main chassis diagram, show distinct for Stepney
    const chassisPositions = positions.filter(p => !p.includes('Stepney'));
    const stepneyPositions = positions.filter(p => p.includes('Stepney'));

    // Group by row index
    const rows = {};
    chassisPositions.forEach(p => {
        const r = getRow(p);
        if (!rows[r]) rows[r] = [];
        rows[r].push(p);
    });

    const sortedRowKeys = Object.keys(rows).sort((a, b) => Number(a) - Number(b));

    const renderTyre = (pos) => {
        const isPresent = !!pos;
        const isSelected = isPresent && selectedPosition === pos;

        return (
            <Box
                onClick={() => isPresent && onSelect && onSelect(pos)}
                sx={{
                    width: 24,
                    height: 48,
                    borderRadius: 1,
                    border: `2px solid ${theme.palette.text.secondary}`,
                    bgcolor: isPresent ? theme.palette.text.secondary : 'transparent',
                    opacity: isPresent ? 1 : 0.2,
                    ...(isSelected && {
                        bgcolor: 'primary.main',
                        borderColor: 'primary.main',
                        boxShadow: `0 0 0 4px ${theme.palette.primary.lighter}`,
                    }),
                    ...(isPresent && onSelect && {
                        cursor: 'pointer',
                        '&:hover': {
                            opacity: 0.8,
                        },
                    }),
                }}
            />
        );
    };

    const renderRow = (rowIndex) => {
        const rowPositions = rows[rowIndex] || [];

        // Check presence of specific slots in this row
        // Layout: OuterLeft InnerLeft -- Chassis -- InnerRight OuterRight

        // Front Axle (usually single tyre per side)
        if (rowIndex === 0) {
            const leftPos = rowPositions.find(p => p.includes('Left') && !p.includes('Inner')); // Usually just "Left" or "Outer Left" if not specified, but specific to dataset
            // If dataset purely says "Front Axle - Left", then standard find is fine.
            // But let's be robust: Front usually has "Left" and "Right".
            // Let's try to match simplistic "Left" vs "Right" if no Inner/Outer specified
            const left = rowPositions.find(p => p.includes('Left'));
            const right = rowPositions.find(p => p.includes('Right'));

            return (
                <Stack direction="row" spacing={8} justifyContent="center" alignItems="center" key={rowIndex}>
                    {renderTyre(left)}
                    {/* Chassis width filler */}
                    <Box sx={{ width: 80 }} />
                    {renderTyre(right)}
                </Stack>
            );
        }

        // Rear Axles (potentially dual)
        const leftOuter = rowPositions.find(p => p.includes('Left') && p.includes('Outer'));
        const leftInner = rowPositions.find(p => p.includes('Left') && p.includes('Inner'));
        const rightInner = rowPositions.find(p => p.includes('Right') && p.includes('Inner'));
        const rightOuter = rowPositions.find(p => p.includes('Right') && p.includes('Outer'));

        return (
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" key={rowIndex}>
                <Stack direction="row" spacing={0.5}>
                    {renderTyre(leftOuter)}
                    {renderTyre(leftInner)}
                </Stack>

                <Box sx={{ width: 40 }} /> {/* Axle/Chassis width */}

                <Stack direction="row" spacing={0.5}>
                    {renderTyre(rightInner)}
                    {renderTyre(rightOuter)}
                </Stack>
            </Stack>
        );
    };

    return (
        <Stack spacing={4} alignItems="center" sx={{ py: 3, border: `1px dashed ${theme.palette.divider}`, borderRadius: 2, ...sx }}>
            {/* Front of truck indicator */}
            <Box sx={{ width: 120, height: 12, borderRadius: 1, bgcolor: theme.palette.text.disabled }} />

            <Stack spacing={2}>
                {sortedRowKeys.map(k => renderRow(Number(k)))}
            </Stack>

            {stepneyPositions.length > 0 && (
                <Stack direction="row" spacing={2} mt={3}>
                    <Typography variant="caption">Stepney:</Typography>
                    {stepneyPositions.map(p => {
                        const isSelected = selectedPosition === p;
                        return (
                            <Box
                                key={p}
                                onClick={() => onSelect && onSelect(p)}
                                sx={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    border: `2px solid ${theme.palette.text.secondary}`,
                                    bgcolor: isSelected ? 'primary.main' : 'transparent',
                                    borderColor: isSelected ? 'primary.main' : theme.palette.text.secondary,
                                    ...(onSelect && {
                                        cursor: 'pointer',
                                        '&:hover': {
                                            opacity: 0.8,
                                        },
                                    }),
                                }}
                            />
                        );
                    })}
                </Stack>
            )}
        </Stack>
    );
}

