import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function PurchaseOrderLearn({ open, onClose }) {
    const theme = useTheme();

    const renderOverview = (
        <Card
            sx={{
                p: 3,
                mb: 2,
                background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.08)} 0%, ${alpha(
                    theme.palette.info.main,
                    0.02
                )} 100%)`,
                border: `1px solid ${alpha(theme.palette.info.main, 0.12)}`,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar
                    sx={{
                        bgcolor: alpha(theme.palette.info.main, 0.16),
                        color: 'info.main',
                        width: 40,
                        height: 40,
                    }}
                >
                    <Iconify icon="solar:cart-large-2-bold" width={24} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                        What is a Purchase Order?
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        A Purchase Order (PO) is a formal request document used to order spare parts or
                        inventory items from a Vendor. It tracks the entire procurement lifecycle — from
                        requesting approval, making payment, to physically receiving items into your warehouse.
                        <br />
                        <br />
                        <strong>How are PO Numbers generated?</strong>
                        <br />
                        The system automatically assigns a unique, sequential PO number when you create a new
                        purchase order.
                    </Typography>
                </Box>
            </Box>
        </Card>
    );

    const renderStatusGuide = (
        <Card
            sx={{
                p: 3,
                mb: 2,
                background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.08)} 0%, ${alpha(
                    theme.palette.warning.main,
                    0.02
                )} 100%)`,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.12)}`,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                <Avatar
                    sx={{
                        bgcolor: alpha(theme.palette.warning.main, 0.16),
                        color: 'warning.main',
                        width: 40,
                        height: 40,
                    }}
                >
                    <Iconify icon="solar:info-circle-bold" width={24} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                        Purchase Order Statuses
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        A PO progresses through these stages in order:
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Iconify icon="solar:clock-circle-bold" color={theme.palette.warning.main} width={20} mt={0.3} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: 'warning.main' }}>
                            Pending Approval
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            The PO has just been created and is awaiting review. It cannot proceed until someone
                            with the <code>purchaseOrder &gt; update</code> permission approves or rejects it.
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Iconify icon="solar:shield-check-bold" color={theme.palette.info.main} width={20} mt={0.3} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: 'info.main' }}>
                            Approved
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            A reviewer has given the green light. You can now mark the PO as &quot;Purchased&quot;
                            (paid) or directly start receiving items against it.
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Iconify icon="solar:card-bold" color={theme.palette.primary.main} width={20} mt={0.3} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                            Purchased
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            Payment has been made or confirmed with the vendor. The PO is now waiting for goods to
                            arrive and be received.
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Iconify icon="solar:pie-chart-2-bold" color={theme.palette.warning.main} width={20} mt={0.3} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: 'warning.main' }}>
                            Partially Received
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            Some line items have been received into inventory, but not all ordered quantities have
                            arrived yet. You can continue receiving remaining items.
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Iconify icon="solar:check-circle-bold" color={theme.palette.success.main} width={20} mt={0.3} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
                            Received
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            All ordered quantities have been fully received into your inventory. The PO is now
                            complete and locked.
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Iconify icon="solar:close-circle-bold" color={theme.palette.error.main} width={20} mt={0.3} />
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: 'error.main' }}>
                            Rejected
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
                            A reviewer has denied this purchase request. Rejected POs cannot be edited or received.
                            A rejection reason may be provided.
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Card>
    );

    const renderFAQs = (
        <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Avatar
                    sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.16),
                        color: 'primary.main',
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
                        <Iconify icon="solar:user-check-bold" width={20} color={theme.palette.info.main} />
                        <Typography variant="subtitle2">Who can approve or reject a PO?</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        Any user who has the <code>purchaseOrder &gt; update</code> permission can approve or
                        reject a purchase order. The system records who approved/rejected it and when.
                        <br />
                        <br />
                        <b>Important:</b> Only POs in <b>Pending Approval</b> status can be approved or
                        rejected. Once a PO moves past this stage, the approval decision is locked.
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
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    sx={{
                        bgcolor: alpha(theme.palette.grey[500], 0.04),
                        '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.08) },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Iconify icon="solar:box-bold" width={20} color={theme.palette.success.main} />
                        <Typography variant="subtitle2">What happens when I receive items?</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        Receiving items triggers several important actions:
                        <br />
                        <br />
                        1. The <b>Quantity Received</b> on each PO line is incremented by the amount you enter.
                        <br />
                        2. The physical <b>Part Stock</b> at the designated warehouse location is increased.
                        <br />
                        3. An <b>Inventory Transaction</b> (audit trail) is recorded for compliance.
                        <br />
                        4. The <b>Average Unit Cost</b> (Moving Average Price) for that part is automatically
                        recalculated using a weighted average formula:
                        <br />
                        <code>
                            New Avg Cost = (Current Stock × Old Avg Cost + New Qty × New Unit Cost) ÷ Total Qty
                        </code>
                        <br />
                        <br />
                        If all lines are fully received, the PO moves to <b>Received</b>. If only some lines are
                        done, it moves to <b>Partially Received</b>.
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
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    sx={{
                        bgcolor: alpha(theme.palette.grey[500], 0.04),
                        '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.08) },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Iconify icon="solar:calculator-bold" width={20} color={theme.palette.secondary.main} />
                        <Typography variant="subtitle2">How is the PO total calculated?</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        The total is built up from the line items:
                        <br />
                        <br />
                        1. <b>Subtotal</b> = Sum of (Quantity Ordered × Unit Cost) for each line.
                        <br />
                        2. <b>Discount</b> is subtracted (can be a fixed amount or a percentage of subtotal).
                        <br />
                        3. <b>Tax</b> is added (can be a fixed amount or a percentage of the discounted amount).
                        <br />
                        4. <b>Shipping</b> cost is added.
                        <br />
                        <br />
                        <code>Total = Subtotal - Discount + Tax + Shipping</code>
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
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    sx={{
                        bgcolor: alpha(theme.palette.grey[500], 0.04),
                        '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.08) },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Iconify icon="solar:pen-bold" width={20} color={theme.palette.warning.main} />
                        <Typography variant="subtitle2">Can I edit a PO after items are received?</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        <b>No.</b> Once any line item on a PO has received even a partial quantity, the entire PO
                        becomes locked for editing. This protects the integrity of your inventory records and
                        cost calculations.
                        <br />
                        <br />
                        You also cannot edit a PO that is in <b>Received</b> or <b>Rejected</b> status.
                        <br />
                        <br />
                        If you need to make changes, you must create a new purchase order with the corrected
                        details.
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
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    sx={{
                        bgcolor: alpha(theme.palette.grey[500], 0.04),
                        '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.08) },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Iconify
                            icon="solar:trash-bin-trash-bold"
                            width={20}
                            color={theme.palette.error.main}
                        />
                        <Typography variant="subtitle2">Can I delete a Purchase Order?</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        You can only delete a PO if it has <b>not</b> been purchased, partially received, or
                        fully received. Once any stock movement has been made against a PO, it cannot be deleted
                        to maintain inventory audit integrity.
                        <br />
                        <br />
                        POs in <b>Pending Approval</b> or <b>Approved</b> status can be safely deleted. A user
                        with <code>purchaseOrder &gt; delete</code> permission is required.
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
                    {renderStatusGuide}
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
