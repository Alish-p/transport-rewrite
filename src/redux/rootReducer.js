import { combineReducers } from 'redux';

// slices
import pumpReducer from './slices/pump';
import bankReducer from './slices/bank';
import tripReducer from './slices/trip';
import routeReducer from './slices/route';
import driverReducer from './slices/driver';
import vehicleReducer from './slices/vehicle';
import subtripReducer from './slices/subtrip';
import expenseReducer from './slices/expense';
import invoiceReducer from './slices/invoice';
import customerReducer from './slices/customer';
import transporterReducer from './slices/transporter';

// ----------------------------------------------------------------------

const rootReducer = combineReducers({
  vehicle: vehicleReducer,
  transporter: transporterReducer,
  customer: customerReducer,
  driver: driverReducer,
  pump: pumpReducer,
  bank: bankReducer,
  route: routeReducer,
  trip: tripReducer,
  subtrip: subtripReducer,
  expense: expenseReducer,
  invoice: invoiceReducer,
});

export default rootReducer;
