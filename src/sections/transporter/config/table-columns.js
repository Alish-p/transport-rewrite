export const TABLE_COLUMNS = [
  { id: 'transportName', label: 'Transport Name', defaultVisible: true, disabled: true },
  { id: 'address', label: 'Address', defaultVisible: true, disabled: false },
  { id: 'cellNo', label: 'Phone Number', defaultVisible: true, disabled: false },
  { id: 'ownerName', label: 'Owner Name', defaultVisible: true, disabled: false },
  { id: 'emailId', label: 'Email ID', defaultVisible: true, disabled: false },
];

export const getDefaultVisibleColumns = () =>
  TABLE_COLUMNS.reduce((acc, column) => {
    acc[column.id] = column.defaultVisible;
    return acc;
  }, {});

export const getDisabledColumns = () =>
  TABLE_COLUMNS.reduce((acc, column) => {
    acc[column.id] = column.disabled;
    return acc;
  }, {});
