import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Accordion from '@mui/material/Accordion';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { ICONS } from 'src/assets/data/icons';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function TyreLearn({ open, onClose }) {
    const theme = useTheme();

    const renderOverview = (
        <Card
            sx={{
                p: 3,
                mb: 2,
                background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.08)} 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`,
                border: `1px solid ${alpha(theme.palette.info.main, 0.12)}`,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                <Avatar
                    sx={{
                        bgcolor: alpha(theme.palette.info.main, 0.16),
                        color: 'info.main',
                        width: 40,
                        height: 40,
                    }}
                >
                    <Iconify icon={ICONS.tyre.tyre} width={24} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                        Tyre Management Overview
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        Comprehensive tracking of your fleet&apos;s tyres from purchase to scrap. Manage lifecycle events like mounting, unmounting, and remolding to optimize cost and performance.
                    </Typography>
                </Box>
            </Box>
        </Card>
    );

    const renderKeyConcepts = (
        <Card sx={{ p: 3, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Avatar
                    sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.16),
                        color: 'primary.main',
                        width: 40,
                        height: 40,
                    }}
                >
                    <Iconify icon={ICONS.common.book} width={24} />
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Lifecycle & Terminology
                </Typography>
            </Box>

            <Table
                size="small"
                sx={{
                    '& .MuiTableCell-root': {
                        borderBottom: `dashed 1px ${theme.palette.divider}`,
                        px: 1.5,
                        py: 1.5,
                        verticalAlign: 'top',
                    },
                    '& .MuiTableHead-root .MuiTableCell-root': {
                        fontWeight: 700,
                        color: 'text.primary',
                        bgcolor: alpha(theme.palette.grey[500], 0.04),
                        borderBottom: `solid 2px ${theme.palette.divider}`,
                    },
                }}
            >
                <TableHead>
                    <TableRow>
                        <TableCell width="30%">Term / Action</TableCell>
                        <TableCell>Description & Impact</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Iconify icon={ICONS.common.boxMinimal} width={18} color={theme.palette.text.secondary} />
                                Mount / Unmount
                            </Box>
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '13px', lineHeight: 1.6 }}>
                            <strong>Mount:</strong> Assigning a tyre to a specific position on a vehicle. Requires current odometer readings.<br />
                            <strong>Unmount:</strong> Removing a tyre to Stock. The system calculates distance covered based on odometer difference.
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Iconify icon={ICONS.tyre.remold} width={18} color={theme.palette.text.secondary} />
                                Remold / Retread
                            </Box>
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '13px', lineHeight: 1.6 }}>
                            The process of adding new tread to a worn tyre.
                            <br />
                            <Box component="span" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic' }}>
                                • Updates status to <strong>Remolded</strong><br />
                                • Resets/Increases <strong>Thread Depth</strong><br />
                                • Extends usable life
                            </Box>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Iconify icon={ICONS.common.bus} width={18} color={theme.palette.text.secondary} />
                                Vehicle Layout
                            </Box>
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '13px', lineHeight: 1.6 }}>
                            The configuration of wheels (e.g., 12 Tyre, 10 Tyre).
                            Selected in Vehicle settings. Determining where tyres can be mounted.
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Card>
    );

    const renderFAQs = (
        <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Avatar
                    sx={{
                        bgcolor: alpha(theme.palette.warning.main, 0.16),
                        color: 'warning.main',
                        width: 40,
                        height: 40,
                    }}
                >
                    <Iconify icon={ICONS.common.chat} width={24} />
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Common Questions
                </Typography>
            </Box>

            <Accordion
                variant="outlined"
                sx={{
                    mb: 1,
                    '&:before': { display: 'none' },
                    borderRadius: 1.5,
                    overflow: 'hidden',
                }}
            >
                <AccordionSummary
                    expandIcon={<Iconify icon={ICONS.common.arrowDown} />}
                    sx={{
                        bgcolor: alpha(theme.palette.grey[500], 0.04),
                        '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.08) },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Iconify icon={ICONS.common.question} width={20} color={theme.palette.info.main} />
                        <Typography variant="subtitle2">Does Current KM mean actual total distance?</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        <strong>Yes.</strong> Current KM represents the total actual accumulated mileage of the tyre over its entire lifespan.
                        It includes the initial &quot;Opening KM&quot; (for used tyres) plus all distance covered while mounted on vehicles.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion
                variant="outlined"
                sx={{
                    mb: 1,
                    '&:before': { display: 'none' },
                    borderRadius: 1.5,
                    overflow: 'hidden',
                }}
            >
                <AccordionSummary
                    expandIcon={<Iconify icon={ICONS.common.arrowDown} />}
                    sx={{
                        bgcolor: alpha(theme.palette.grey[500], 0.04),
                        '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.08) },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Iconify icon={ICONS.common.settings} width={20} color={theme.palette.secondary.main} />
                        <Typography variant="subtitle2">What if a tyre is on Stepney (Spare)?</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        Tyres mounted in the <strong>Stepney</strong> position generally <strong>do not accumulate mileage</strong>.
                        When unmounted from a Stepney position, the system records 0 km covered for that duration, regardless of the vehicle&apos;s odometer change.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion
                variant="outlined"
                sx={{
                    mb: 1,
                    '&:before': { display: 'none' },
                    borderRadius: 1.5,
                    overflow: 'hidden',
                }}
            >
                <AccordionSummary
                    expandIcon={<Iconify icon={ICONS.common.arrowDown} />}
                    sx={{
                        bgcolor: alpha(theme.palette.grey[500], 0.04),
                        '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.08) },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Iconify icon={ICONS.common.shield} width={20} color={theme.palette.success.main} />
                        <Typography variant="subtitle2">Who has access to update tyres?</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        Access is restricted to authorized users with <strong>Tyre Management</strong> permissions.
                        This typically includes Fleet Managers and Admins. Standard drivers or restricted users cannot modify tyre data.
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Card>
    );

    return (
        <Drawer
            open={open}
            onClose={onClose}
            anchor="bottom"
            PaperProps={{
                sx: {
                    maxHeight: '85vh',
                    borderRadius: '16px 16px 0 0',
                    boxShadow: theme.shadows[24],
                },
            }}
        >
            <Scrollbar sx={{ maxHeight: 'calc(85vh - 80px)' }}>
                <Box sx={{ p: 3 }}>
                    {renderOverview}
                    {renderKeyConcepts}
                    {renderFAQs}

                </Box>
            </Scrollbar>
        </Drawer>
    );
}
