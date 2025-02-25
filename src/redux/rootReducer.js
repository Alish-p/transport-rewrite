import { combineReducers } from 'redux';

// slices
import dashboardReducer from './slices/dashboard';

// ----------------------------------------------------------------------

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
});

export default rootReducer;
