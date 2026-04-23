import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
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

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function VehicleLearn({ open, onClose }) {
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
                    <Iconify icon="solar:question-circle-bold" width={24} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                        What is a Vehicle?
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        A Vehicle represents a truck or transport unit in your fleet. Vehicles are linked to trips,
                        jobs, expenses, work orders, and tyre assignments. They can be either company-owned
                        (&quot;Own&quot;) or belong to an external transporter (&quot;Market&quot;).
                    </Typography>
                </Box>
            </Box>
        </Card>
    );

    const renderRequiredFields = (
        <Card sx={{ p: 3, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Avatar
                    sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.16),
                        color: 'success.main',
                        width: 40,
                        height: 40,
                    }}
                >
                    <Iconify icon="solar:checklist-bold" width={24} />
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Key Fields Reference
                </Typography>
            </Box>

            <Table
                size="small"
                sx={{
                    '& .MuiTableCell-root': {
                        borderBottom: `dashed 1px ${theme.palette.divider}`,
                        px: 1.5,
                        py: 1.5,
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
                        <TableCell>Field Name</TableCell>
                        <TableCell align="center">Required?</TableCell>
                        <TableCell>Description</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Iconify icon="mdi:truck" width={18} color={theme.palette.text.secondary} />
                                Vehicle No
                            </Box>
                        </TableCell>
                        <TableCell align="center">
                            <Chip label="Required" color="error" size="small" sx={{ fontWeight: 600 }} />
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            Unique registration / plate number
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Iconify icon="mdi:shape" width={18} color={theme.palette.text.secondary} />
                                Vehicle Type
                            </Box>
                        </TableCell>
                        <TableCell align="center">
                            <Chip label="Required" color="error" size="small" sx={{ fontWeight: 600 }} />
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            Category of vehicle (e.g. Trailer, Tanker, Tipper)
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Iconify icon="mdi:circle-outline" width={18} color={theme.palette.text.secondary} />
                                No of Tyres
                            </Box>
                        </TableCell>
                        <TableCell align="center">
                            <Chip label="Required" color="error" size="small" sx={{ fontWeight: 600 }} />
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            Total tyre count — used for tyre layout mapping
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Iconify icon="mdi:account-tie" width={18} color={theme.palette.text.secondary} />
                                Own / Market
                            </Box>
                        </TableCell>
                        <TableCell align="center">
                            <Chip label="Required" color="error" size="small" sx={{ fontWeight: 600 }} />
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            Own = company vehicle. Market = external transporter&apos;s vehicle
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Iconify icon="mdi:engine" width={18} color={theme.palette.text.secondary} />
                                Chasis / Engine No
                            </Box>
                        </TableCell>
                        <TableCell align="center">
                            <Chip label="Optional" size="small" variant="outlined" />
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            Identification numbers for the vehicle
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Iconify icon="mdi:speedometer" width={18} color={theme.palette.text.secondary} />
                                Tyre Layout
                            </Box>
                        </TableCell>
                        <TableCell align="center">
                            <Chip label="Optional" size="small" variant="outlined" />
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            Axle layout for tyre position mapping (used in tyre management)
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
                    <Iconify icon="solar:chat-round-dots-bold" width={24} />
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Frequently Asked Questions
                </Typography>
            </Box>

            {/* FAQ 1 — Inactive */}
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
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    sx={{
                        bgcolor: alpha(theme.palette.grey[500], 0.04),
                        '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.08) },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Iconify icon="solar:pause-circle-bold" width={20} color={theme.palette.warning.main} />
                        <Typography variant="subtitle2">What happens when I mark a vehicle as Inactive?</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                        An inactive vehicle is <strong>hidden from all creation forms</strong> — you cannot create
                        new Jobs, Trips, Expenses, Work Orders, or mount new Tyres on it. However, the vehicle and
                        all its historical data (past trips, expenses, reports) remain fully accessible for viewing
                        and filtering in list views. Think of it as &quot;retired but not deleted&quot;.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            {/* FAQ 2 — Existing tyres */}
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
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    sx={{
                        bgcolor: alpha(theme.palette.grey[500], 0.04),
                        '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.08) },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Iconify icon="mdi:circle-outline" width={20} color={theme.palette.info.main} />
                        <Typography variant="subtitle2">What about tyres already mounted on an inactive vehicle?</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                        Existing tyres stay mounted — they are <strong>not</strong> automatically unmounted.
                        No new tyres can be assigned, but the current assignment is preserved for data accuracy.
                        To reuse those tyres, reactivate the vehicle first, unmount the tyres, then deactivate again.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            {/* FAQ 3 — Own vs Market */}
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
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    sx={{
                        bgcolor: alpha(theme.palette.grey[500], 0.04),
                        '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.08) },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Iconify icon="mdi:swap-horizontal" width={20} color={theme.palette.success.main} />
                        <Typography variant="subtitle2">What is the difference between Own and Market vehicles?</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                        <strong>Own</strong> vehicles belong to your company — trips create driver advances,
                        diesel tracking, expenses, and salary entries. <strong>Market</strong> vehicles belong
                        to an external transporter — trips create transporter payments instead. Expenses, work orders,
                        and tyre management are available only for own vehicles.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            {/* FAQ 4 — Reactivating */}
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
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    sx={{
                        bgcolor: alpha(theme.palette.grey[500], 0.04),
                        '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.08) },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Iconify icon="solar:restart-bold" width={20} color={theme.palette.primary.main} />
                        <Typography variant="subtitle2">Can I reactivate an inactive vehicle?</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                        Yes. Go to the vehicle&apos;s detail page and toggle the Active status back on.
                        Once reactivated, the vehicle will immediately appear in all creation forms again.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            {/* FAQ 5 — Delete vs Inactive */}
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
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    sx={{
                        bgcolor: alpha(theme.palette.grey[500], 0.04),
                        '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.08) },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Iconify icon="solar:trash-bin-trash-bold" width={20} color={theme.palette.error.main} />
                        <Typography variant="subtitle2">Should I delete or deactivate a vehicle?</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                        <strong>Always prefer deactivating</strong> over deleting. Deactivating keeps all historical
                        records (trips, P&amp;L, expenses) intact and searchable. Deleting permanently removes the
                        vehicle and may orphan linked records. Only delete vehicles that were created by mistake
                        and have no associated data.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            {/* FAQ 6 — Filtering in list views */}
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
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    sx={{
                        bgcolor: alpha(theme.palette.grey[500], 0.04),
                        '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.08) },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Iconify icon="solar:filter-bold" width={20} color={theme.palette.text.secondary} />
                        <Typography variant="subtitle2">Can I still filter by inactive vehicles in reports?</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                        Yes. Inactive vehicles still appear in list view filter dropdowns (trips, expenses,
                        work orders, etc.) so you can view and export their historical data. They are only hidden
                        from creation forms where you select a vehicle to create a new record.
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
                    {renderRequiredFields}
                    {renderFAQs}

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            color="inherit"
                            size="large"
                            onClick={onClose}
                            startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
                            sx={{
                                minWidth: 200,
                                fontWeight: 700,
                            }}
                        >
                            Got it!
                        </Button>
                    </Box>
                </Box>
            </Scrollbar>
        </Drawer>
    );
}
