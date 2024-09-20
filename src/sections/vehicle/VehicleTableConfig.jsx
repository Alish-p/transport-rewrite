export const vehicleTypes = [
  { key: 'body', value: 'Body' },
  { key: 'trailer', value: 'Trailer' },
  { key: 'bulker', value: 'Bulker' },
  { key: 'localBulker', value: 'Local Bulker' },
  { key: 'tanker', value: 'Tanker' },
  { key: 'pickup', value: 'Pickup' },
  { key: 'crane', value: 'Crane' },
];

export const modelType = [
  { key: '3118', value: '3118' },
  { key: '3718', value: '3718' },
  { key: '4018', value: '4018' },
  { key: '4220', value: '4220' },
  { key: '4223', value: '4223' },
  { key: '4825', value: '4825' },
  { key: '1109', value: '1109' },
  { key: '1512', value: '1512' },
];

export const engineType = [
  { key: 'bs3', value: 'BS-3' },
  { key: 'bs4', value: 'BS-4' },
  { key: 'bs5', value: 'BS-5' },
  { key: 'bs6', value: 'BS-6' },
];

export const vehicleCompany = [
  { key: 'bharatBenz', value: 'Bharat Benz' },
  { key: 'ashokLeyland', value: 'Ashok Leyland' },
  { key: 'tata', value: 'Tata' },
  { key: 'ace', value: 'Ace' },
];
export const transportCompany = [
  { key: 'shreeEnterprice', value: 'Shree Enterprice' },
  { key: 'Laxmi', value: 'Laxmi Enterprice' },
  { key: 'GTP', value: 'Gautam Tukaram Paikrao' },
];

export const vehicleConfig = [
  { id: 'vehicleNo', name: 'vehicleNo', label: 'Vehicle No', type: 'text' },
  {
    id: 'vehicleType',
    name: 'vehicleType',
    label: 'Vehicle Type',
    type: 'select',
    options: vehicleTypes,
  },
  { id: 'modelType', name: 'modelType', label: 'Model Type', type: 'select', options: modelType },
  {
    id: 'vehicleCompany',
    name: 'vehicleCompany',
    label: 'Vehicle Company',
    type: 'select',
    options: vehicleCompany,
  },
  { id: 'noOfTyres', name: 'noOfTyres', label: 'No Of Tyres', type: 'number' },
  // { id: 'chasisNo', name: 'chasisNo', label: 'Chasis No', type: 'text' },
  // { id: 'engineNo', name: 'engineNo', label: 'Engine No', type: 'text' },
  // {
  //   id: 'manufacturingYear',
  //   name: 'manufacturingYear',
  //   label: 'Manufacturing Year',
  //   type: 'number',
  // },
  { id: 'loadingCapacity', name: 'loadingCapacity', label: 'Loading Capacity', type: 'number' },
  {
    id: 'engineType',
    name: 'engineType',
    label: 'Engine Type',
    type: 'select',
    options: engineType,
  },
  { id: 'fuelTankCapacity', name: 'fuelTankCapacity', label: 'Fuel Tank Capacity', type: 'number' },
  { id: 'fromDate', name: 'fromDate', label: 'From Date', type: 'date' },
  { id: 'toDate', name: 'toDate', label: 'To Date', type: 'date' },
  {
    id: 'transporter',
    name: 'transporter',
    label: 'Transport Company',
    type: 'select',
    options: transportCompany,
  },
];
