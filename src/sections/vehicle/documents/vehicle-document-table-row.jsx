import React from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

import { paths } from 'src/routes/paths';

import { useSyncVehicleDocuments } from 'src/query/use-documents';

import { GenericTableRow } from 'src/components/table';

import { getExpiryStatus } from 'src/sections/vehicle/utils/document-utils';

import { TABLE_COLUMNS } from './vehicle-document-table-config';

export default function VehicleDocumentTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  visibleColumns,
  disabledColumns,
  columnOrder,
}) {
  const navigate = useNavigate();
  const { syncDocuments } = useSyncVehicleDocuments();

  const handleView = (r) => {
    navigate(paths.dashboard.vehicle.documentDetails(r._id));
  };

  const handleEdit = (r) => {
    navigate(paths.dashboard.vehicle.editDocument(r._id));
  };

  const handleDelete = (r) => {
    onDeleteRow?.(r);
  };

  const status = getExpiryStatus(row?.expiryDate);
  const isExpiringOrExpired = status === 'Expired' || status === 'Expiring';

  const customActions = [];
  if (isExpiringOrExpired) {
    customActions.push({
      label: 'Fetch from Portal',
      icon: 'solar:import-bold',
      onClick: async (r) => {
        const vehicleNo = r?.vehicle?.vehicleNo || r?.vehicleNo;
        if (vehicleNo && r?.docType) {
          await syncDocuments({ vehicleNo, docType: r.docType });
        } else {
          toast.error('Vehicle number or document type missing');
        }
      },
    });
  }

  return (
    <GenericTableRow
      row={row}
      columns={TABLE_COLUMNS}
      selected={selected}
      onSelectRow={onSelectRow}
      onViewRow={handleView}
      onEditRow={handleEdit}
      onDeleteRow={handleDelete}
      customActions={customActions}
      visibleColumns={visibleColumns}
      disabledColumns={disabledColumns}
      columnOrder={columnOrder}
    />
  );
}
