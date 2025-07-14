import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/constants/theme';
import { dataInitService } from './src/services/dataInitService';
import { logInfo, logError, LOG_CATEGORIES } from './src/utils/debugLogger';
import ErrorBoundary from './src/components/ErrorBoundary';

export default function App() {
  useEffect(() => {
    // Initialize database with sample data
    try {
      logInfo(LOG_CATEGORIES.INIT, 'app_startup', { timestamp: new Date().toISOString() });

      dataInitService.initializeData()
        .then(() => {
          logInfo(LOG_CATEGORIES.INIT, 'data_initialization_complete', {});
        })
        .catch((error) => {
          logError(LOG_CATEGORIES.INIT, 'data_initialization_failed', {}, error);
          console.error('Data initialization failed:', error);
        });
    } catch (error) {
      console.error('App startup error:', error);
      logError(LOG_CATEGORIES.INIT, 'app_startup_error', {}, error);
    }
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </PaperProvider>
      </Provider>
    </ErrorBoundary>
  );
}
