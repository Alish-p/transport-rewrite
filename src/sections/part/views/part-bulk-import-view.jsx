import { z as zod } from 'zod';

import { paths } from 'src/routes/paths';

import { useCreateBulkParts } from 'src/query/use-part';
import { DashboardContent } from 'src/layouts/dashboard';

import { BulkImportView } from 'src/components/bulk-import';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PartSchema } from '../part-form';

// Extend the schema if needed for bulk import specific fields
// e.g. allowing string for numbers that will be coerced
const BulkPartSchema = PartSchema.extend({
    unitCost: zod.coerce.number().min(0),
    quantity: zod.coerce.number().min(0).optional(),
});

const IMPORT_COLUMNS = [
    { label: 'Part Number', key: 'partNumber', required: true },
    { label: 'Name', key: 'name', required: true },
    { label: 'Category', key: 'category' },
    { label: 'Manufacturer', key: 'manufacturer' },
    { label: 'Unit Cost', key: 'unitCost', type: 'number', required: true },
    { label: 'Measurement Unit', key: 'measurementUnit', required: true },
    { label: 'Description', key: 'description' },
    // Add inventory fields if needed, but keep it simple for V1
];

export const PART_BULK_IMPORT_SCHEMA = BulkPartSchema;

export const PART_BULK_IMPORT_COLUMNS = IMPORT_COLUMNS;

export function PartBulkImportView() {
    const createBulkParts = useCreateBulkParts();

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Import Parts"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Vehicle Maintenance', href: paths.dashboard.part.root },
                    { name: 'Parts', href: paths.dashboard.part.root },
                    { name: 'Import' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <BulkImportView
                entityName="Part"
                schema={BulkPartSchema}
                columns={IMPORT_COLUMNS}
                onImport={(data) => createBulkParts({ parts: data })}
            />
        </DashboardContent>
    );
}
