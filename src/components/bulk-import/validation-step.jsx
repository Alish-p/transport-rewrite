
import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

export function ValidationStep({ data, columns, schema, onBack, onImport }) {
    const theme = useTheme();
    const [rows, setRows] = useState([]);
    const [rowErrors, setRowErrors] = useState({});

    // Initialize rows with IDs and validate
    useEffect(() => {
        const initialRows = data.map((row, index) => ({
            id: `row-${index}`,
            ...row,
        }));
        setRows(initialRows);
        validateRows(initialRows);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const validateRows = (currentRows) => {
        const newErrors = {};

        currentRows.forEach((row) => {
            try {
                // Prepare object for validation (remove internal id)
                const { id: _id, ...values } = row;

                // Convert types based on columns definition if needed
                // (e.g. string "100" to number 100 if schema expects number)
                const typedValues = { ...values };
                columns.forEach(col => {
                    if (col.type === 'number' && typeof typedValues[col.key] === 'string') {
                        const num = Number(typedValues[col.key]);
                        if (!Number.isNaN(num)) typedValues[col.key] = num;
                    }
                });

                schema.parse(typedValues);
            } catch (error) {
                if (error.errors) {
                    newErrors[row.id] = error.errors.reduce((acc, curr) => {
                        const field = curr.path[0];
                        acc[field] = curr.message;
                        return acc;
                    }, {});
                }
            }
        });

        setRowErrors(newErrors);
    };

    const processRowUpdate = (newRow) => {
        const updatedRows = rows.map((row) => (row.id === newRow.id ? newRow : row));
        setRows(updatedRows);
        validateRows(updatedRows);
        return newRow;
    };

    const gridColumns = useMemo(() => columns.map((col) => ({
        field: col.key,
        headerName: col.label,
        flex: 1,
        editable: true,
        type: col.type === 'number' ? 'number' : 'string',
        renderCell: (params) => {
            const error = rowErrors[params.id]?.[col.key];
            return (
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        ...(error && {
                            bgcolor: (t) => alpha(t.palette.error.main, 0.08),
                            border: `1px solid ${theme.palette.error.main}`,
                            px: 1,
                        }),
                    }}
                >
                    {params.value}
                    {error && (
                        <Tooltip title={error}>
                            <Iconify
                                icon="eva:alert-circle-fill"
                                color={theme.palette.error.main}
                                sx={{ ml: 'auto', width: 16, height: 16 }}
                            />
                        </Tooltip>
                    )}
                </Box>
            );
        },
    })), [columns, rowErrors, theme]);

    const hasErrors = Object.keys(rowErrors).length > 0;
    const validCount = rows.length - Object.keys(rowErrors).length;

    const handleImport = () => {
        // Return only valid data without IDs
        const validRows = rows.map(({ id: _id, ...rest }) => {
            // Ensure types are correct before submitting
            const typedValues = { ...rest };
            columns.forEach(col => {
                if (col.type === 'number' && typeof typedValues[col.key] === 'string') {
                    const num = Number(typedValues[col.key]);
                    if (!Number.isNaN(num)) typedValues[col.key] = num;
                }
            });
            return typedValues;
        });
        onImport(validRows);
    };

    return (
        <Stack spacing={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                    <Typography variant="h6">Review & Validate</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {rows.length} rows found. {Object.keys(rowErrors).length} rows have errors.
                    </Typography>
                </Box>

                <Stack direction="row" spacing={2}>
                    <Button onClick={onBack}>Back</Button>
                    <Button
                        variant="contained"
                        onClick={handleImport}
                        disabled={hasErrors}
                        color={hasErrors ? 'error' : 'primary'}
                    >
                        {hasErrors ? 'Fix Errors to Import' : `Import ${validCount} Items`}
                    </Button>
                </Stack>
            </Stack>

            <Card sx={{ height: 500 }}>
                <DataGrid
                    rows={rows}
                    columns={gridColumns}
                    processRowUpdate={processRowUpdate}
                    disableRowSelectionOnClick
                />
            </Card>
        </Stack>
    );
}


