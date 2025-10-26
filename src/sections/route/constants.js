export const VEHICLE_TYPE_TYRE_COLORS = {
  'body-16': 'success',
  'body-14': 'info',
  'bulker-12': 'warning',
  'bulker-14': 'error',
  'body-12': 'secondary',
  'canter-6': 'success',
  'canter-12': 'secondary',
  'canter-14': 'info',
  'canter-16': 'warning',
};

export const getVehicleTypeTyreColor = (vehicleType, noOfTyres) =>
  VEHICLE_TYPE_TYRE_COLORS[`${vehicleType?.toLowerCase?.()}-${noOfTyres}`] || 'default';

export default VEHICLE_TYPE_TYRE_COLORS;
