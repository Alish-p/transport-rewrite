import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import TenantForm from '../tenant-form';
import { PartCategorySettings } from '../part-category';
import { WorkOrderIssueSettings } from '../work-order-issue';
import { PartManufacturerSettings } from '../part-manufacturer';

// ----------------------------------------------------------------------

const SETTINGS_ITEMS = [
  {
    id: 'tenant',
    label: 'Tenant Setting',
    icon: <Iconify icon="solar:user-id-bold" />,
  },
  {
    id: 'vehicle',
    label: 'Vehicle Configuration',
    icon: <Iconify icon="mdi:truck" />,
  },
  {
    id: 'driver',
    label: 'Driver Configuration',
    icon: <Iconify icon="mdi:account-tie-hat" />,
  },
  {
    id: 'transporter',
    label: 'Transporter Configuration',
    icon: <Iconify icon="mdi:truck-fast" />,
  },
  {
    id: 'customer',
    label: 'Customer Configuration',
    icon: <Iconify icon="mdi:account-group" />,
  },
  {
    id: 'invoice',
    label: 'Invoice Configuration',
    icon: <Iconify icon="mdi:file-document-outline" />,
  },
  {
    id: 'maintenance',
    label: 'Vehicle Maintenance and Inventory Management',
    icon: <Iconify icon="mdi:tools" />,
    children: [
      { id: 'part-manufacturer', label: 'Part Manufacturer' },
      { id: 'part-category', label: 'Part Category' },
      { id: 'work-order-issues', label: 'Work Order Issues' },
    ],
  },
];

// ----------------------------------------------------------------------

export function SettingsView({ tenant }) {
  const theme = useTheme();

  const [selectedItem, setSelectedItem] = useState('tenant');

  const handleSelectedItemsChange = useCallback((event, itemId) => {
    if (itemId) {
      setSelectedItem(itemId);
    }
  }, []);

  const renderContent = () => {
    switch (selectedItem) {
      case 'tenant':
        return <TenantForm currentTenant={tenant} />;
      case 'vehicle':
        return <Box>Sample Text: Vehicle Configuration</Box>;
      case 'driver':
        return <Box>Sample Text: Driver Configuration</Box>;
      case 'transporter':
        return <Box>Sample Text: Transporter Configuration</Box>;
      case 'customer':
        return <Box>Sample Text: Customer Configuration</Box>;
      case 'invoice':
        return <Box>Sample Text: Invoice Configuration</Box>;
      case 'maintenance':
        return <Box>Sample Text: Vehicle Maintenance and Inventory Management</Box>;
      case 'part-manufacturer':
        return <PartManufacturerSettings />;
      case 'part-category':
        return <PartCategorySettings />;
      case 'work-order-issues':
        return <WorkOrderIssueSettings />;
      default:
        return null;
    }
  };

  const renderTreeItems = (items) =>
    items.map((item) => (
      <TreeItem
        key={item.id}
        itemId={item.id}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
            {item.icon && <Box component="span" sx={{ display: 'flex' }}>{item.icon}</Box>}
            <Box component="span" sx={{ typography: 'body2' }}>{item.label}</Box>
          </Box>
        }
      >
        {item.children && renderTreeItems(item.children)}
      </TreeItem>
    ));

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Company Settings"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Company Settings' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card
        sx={{
          mb: 3,
          minHeight: 600,
          display: { md: 'flex' },
        }}
      >
        <Box
          sx={{
            p: 2,
            width: { xs: 1, md: 280 },
            flexShrink: 0,
            borderRight: { md: `solid 1px ${theme.vars.palette.divider}` },
            borderBottom: { xs: `solid 1px ${theme.vars.palette.divider}`, md: 'none' },
          }}
        >
          <SimpleTreeView
            onSelectedItemsChange={handleSelectedItemsChange}
            selectedItems={selectedItem}
          >
            {renderTreeItems(SETTINGS_ITEMS)}
          </SimpleTreeView>
        </Box>

        <Box
          sx={{
            p: 3,
            width: 1,
            overflow: 'auto',
          }}
        >
          {renderContent()}
        </Box>
      </Card>
    </DashboardContent>
  );
}
