export const TABLE_COLUMNS = [
  { id: 'vehicleNo', label: 'Vehicle No', defaultVisible: true, disabled: true },
  { id: 'isOwn', label: 'Ownership', defaultVisible: true, disabled: false },
  {
    id: 'transporter',
    label: 'Transport Company',
    defaultVisible: true,
    disabled: false,
    align: 'center',
  },
  { id: 'noOfTyres', label: 'No Of Tyres', defaultVisible: true, disabled: false },
  {
    id: 'manufacturingYear',
    label: 'Manufacturing Year',
    defaultVisible: true,
    disabled: false,
  },
  {
    id: 'loadingCapacity',
    label: 'Loading Capacity',
    defaultVisible: true,
    disabled: false,
  },
  {
    id: 'fuelTankCapacity',
    label: 'Fuel Tank Capacity',
    defaultVisible: true,
    disabled: false,
  },
  {
    id: 'vehicleCompany',
    label: 'Vehicle Company',
    defaultVisible: false,
    disabled: false,
  },
  { id: 'modelType', label: 'Vehicle Model', defaultVisible: false, disabled: false },
  { id: 'chasisNo', label: 'Chasis No', defaultVisible: false, disabled: false },
  { id: 'engineNo', label: 'Engine No', defaultVisible: false, disabled: false },
  { id: 'engineType', label: 'Engine Type', defaultVisible: false, disabled: false },
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
