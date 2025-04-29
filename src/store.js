import { configureStore } from '@reduxjs/toolkit';
import alertsReducer from './AlertsSlice'; // Path to your alerts slice

const store = configureStore({
  reducer: {
    alerts: alertsReducer, // Add your reducers here
  },
});

export default store;