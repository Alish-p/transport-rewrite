import { combineReducers } from 'redux';

// slices
import tripReducer from './slices/trip';
import loanReducer from './slices/loan';
import routeReducer from './slices/route';
import subtripReducer from './slices/subtrip';
import expenseReducer from './slices/expense';
import invoiceReducer from './slices/invoice';
import dashboardReducer from './slices/dashboard';
import dieselPriceReducer from './slices/diesel-price';
import driverPayrollReducer from './slices/driver-payroll';
import transporterPaymentReducer from './slices/transporter-payment';

// ----------------------------------------------------------------------

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  dieselPrice: dieselPriceReducer,
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
