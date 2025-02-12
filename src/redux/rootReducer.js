import { combineReducers } from 'redux';

// slices
import pumpReducer from './slices/pump';
import bankReducer from './slices/bank';
import tripReducer from './slices/trip';
import loanReducer from './slices/loan';
import routeReducer from './slices/route';
import driverReducer from './slices/driver';
import vehicleReducer from './slices/vehicle';
import subtripReducer from './slices/subtrip';
import expenseReducer from './slices/expense';
import invoiceReducer from './slices/invoice';
import customerReducer from './slices/customer';
import transporterReducer from './slices/transporter';
import dieselPriceReducer from './slices/diesel-price';
import driverPayrollReducer from './slices/driver-payroll';
import transporterPaymentReducer from './slices/transporter-payment';

// ----------------------------------------------------------------------

const rootReducer = combineReducers({
  vehicle: vehicleReducer,
  transporter: transporterReducer,
  customer: customerReducer,
  driver: driverReducer,
  pump: pumpReducer,
  dieselPrice: dieselPriceReducer,
  bank: bankReducer,
  route: routeReducer,
  trip: tripReducer,
  subtrip: subtripReducer,
  expense: expenseReducer,
  invoice: invoiceReducer,
  driverPayroll: driverPayrollReducer,
  loan: loanReducer,
  transporterPayment: transporterPaymentReducer,
});

export default rootReducer;
