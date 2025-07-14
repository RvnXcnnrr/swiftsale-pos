import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button, Card, Title } from 'react-native-paper';
import { logError, LOG_CATEGORIES } from '../utils/debugLogger';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const errorId = Date.now() + Math.random();
    
    // Log the error with detailed information
    logError(LOG_CATEGORIES.UI, 'react_error_boundary_caught', {
      errorId,
      errorMessage: error.message,
      errorStack: error.stack,
      componentStack: errorInfo.componentStack,
      props: this.props
    }, error);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
      errorId
    });

    // You could also log the error to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    logError(LOG_CATEGORIES.UI, 'error_boundary_retry_attempted', {
      errorId: this.state.errorId
    });
    
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
          <Card style={{ padding: 20 }}>
            <Title style={{ color: '#d32f2f', marginBottom: 16 }}>
              Oops! Something went wrong
            </Title>
            
            <Text style={{ marginBottom: 16, fontSize: 16 }}>
              The app encountered an unexpected error. This has been logged for debugging.
            </Text>

            <Text style={{ marginBottom: 8, fontWeight: 'bold' }}>
              Error ID: {this.state.errorId}
            </Text>

            <Text style={{ marginBottom: 16, color: '#666' }}>
              {this.state.error?.message || 'Unknown error'}
            </Text>

            <Button 
              mode="contained" 
              onPress={this.handleRetry}
              style={{ marginBottom: 16 }}
            >
              Try Again
            </Button>

            {__DEV__ && (
              <ScrollView style={{ maxHeight: 200, backgroundColor: '#f5f5f5', padding: 10 }}>
                <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>
                  {this.state.error?.stack}
                </Text>
                <Text style={{ fontSize: 12, fontFamily: 'monospace', marginTop: 10 }}>
                  Component Stack:
                  {this.state.errorInfo?.componentStack}
                </Text>
              </ScrollView>
            )}
          </Card>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
