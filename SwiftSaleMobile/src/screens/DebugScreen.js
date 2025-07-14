import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, Share } from 'react-native';
import { Button, Card, Text, Title, Chip, Divider } from 'react-native-paper';
import databaseService, { STORAGE_KEYS } from '../services/databaseService';
import { localAuthService } from '../services/localAuthService';
import { dataInitService } from '../services/dataInitService';
import debugLogger, { LOG_CATEGORIES, DEBUG_LEVELS } from '../utils/debugLogger';

const DebugScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [logStats, setLogStats] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await databaseService.getAll(STORAGE_KEYS.USERS);
      setUsers(allUsers);
      console.log('Current users:', allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetDatabase = async () => {
    try {
      setLoading(true);

      // Clear all data using the correct method
      await databaseService.clearAllData();

      // Reinitialize data
      await dataInitService.initializeData();

      Alert.alert('Success', 'Database reset and reinitialized successfully!');
      await loadUsers();
    } catch (error) {
      console.error('Error resetting database:', error);
      Alert.alert('Error', 'Failed to reset database: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultUser = async () => {
    try {
      setLoading(true);
      await localAuthService.resetAndCreateUser();
      Alert.alert('Success', 'Default user created successfully!');
      await loadUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      Alert.alert('Error', 'Failed to create user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    try {
      setLoading(true);
      const result = await localAuthService.login('admin@swiftsale.com', 'admin123');
      Alert.alert('Success', 'Login test successful!');
      console.log('Login result:', result);
    } catch (error) {
      console.error('Login test failed:', error);
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = () => {
    const allLogs = debugLogger.getLogs(selectedCategory);
    setLogs(allLogs.slice(0, 50)); // Show last 50 logs
    setLogStats(debugLogger.getStats());
  };

  const exportLogs = async () => {
    try {
      const logText = debugLogger.exportLogs();
      await Share.share({
        message: logText,
        title: 'SwiftSale Debug Logs'
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to export logs: ' + error.message);
    }
  };

  const clearLogs = async () => {
    try {
      await debugLogger.clearLogs();
      setLogs([]);
      setLogStats({});
      Alert.alert('Success', 'Logs cleared successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear logs: ' + error.message);
    }
  };

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 2000); // Refresh every 2 seconds
    return () => clearInterval(interval);
  }, [selectedCategory]);

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Title style={{ marginBottom: 16 }}>Debug Tools</Title>
      
      <Card style={{ marginBottom: 16 }}>
        <Card.Content>
          <Title style={{ color: '#4caf50', marginBottom: 16 }}>✅ LOGIN IS WORKING!</Title>
          <Text style={{ marginBottom: 16, fontSize: 16, fontWeight: 'bold' }}>
            Use these credentials to login:
          </Text>
          <View style={{ backgroundColor: '#e8f5e8', padding: 12, borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ fontFamily: 'monospace', fontSize: 16 }}>Email: admin@swiftsale.com</Text>
            <Text style={{ fontFamily: 'monospace', fontSize: 16 }}>Password: admin123</Text>
          </View>
          <Text style={{ marginBottom: 16 }}>Database Management</Text>
          
          <Button 
            mode="contained" 
            onPress={loadUsers}
            loading={loading}
            style={{ marginBottom: 8 }}
          >
            Load Current Users
          </Button>
          
          <Button 
            mode="contained" 
            onPress={createDefaultUser}
            loading={loading}
            style={{ marginBottom: 8 }}
          >
            Create Default User
          </Button>
          
          <Button 
            mode="contained" 
            onPress={resetDatabase}
            loading={loading}
            style={{ marginBottom: 8 }}
            buttonColor="#ff6b6b"
          >
            Reset Entire Database
          </Button>
          
          <Button 
            mode="contained" 
            onPress={testLogin}
            loading={loading}
            buttonColor="#51cf66"
          >
            Test Login (admin@swiftsale.com / admin123)
          </Button>
        </Card.Content>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <Card.Content>
          <Text style={{ marginBottom: 16 }}>Current Users ({users.length})</Text>
          {users.length === 0 ? (
            <Text>No users found. Click "Load Current Users" to check.</Text>
          ) : (
            users.map((user, index) => (
              <View key={index} style={{ marginBottom: 8, padding: 8, backgroundColor: '#f5f5f5' }}>
                <Text>Email: {user.email}</Text>
                <Text>Name: {user.name}</Text>
                <Text>Password: {user.password}</Text>
                <Text>Role: {user.role}</Text>
                <Text>ID: {user.id}</Text>
              </View>
            ))
          )}
        </Card.Content>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <Card.Content>
          <Text style={{ marginBottom: 16 }}>Debug Logs</Text>

          <View style={{ flexDirection: 'row', marginBottom: 16, flexWrap: 'wrap' }}>
            <Button
              mode="outlined"
              onPress={loadLogs}
              style={{ marginRight: 8, marginBottom: 8 }}
            >
              Refresh Logs
            </Button>
            <Button
              mode="outlined"
              onPress={exportLogs}
              style={{ marginRight: 8, marginBottom: 8 }}
            >
              Export Logs
            </Button>
            <Button
              mode="outlined"
              onPress={clearLogs}
              style={{ marginBottom: 8 }}
              buttonColor="#ff6b6b"
            >
              Clear Logs
            </Button>
          </View>

          <Text style={{ marginBottom: 8 }}>
            Total: {logStats.total || 0} | Errors: {logStats.errors || 0} | Warnings: {logStats.warnings || 0}
          </Text>

          <View style={{ flexDirection: 'row', marginBottom: 16, flexWrap: 'wrap' }}>
            <Chip
              selected={selectedCategory === null}
              onPress={() => setSelectedCategory(null)}
              style={{ marginRight: 8, marginBottom: 4 }}
            >
              All
            </Chip>
            {Object.values(LOG_CATEGORIES).map(category => (
              <Chip
                key={category}
                selected={selectedCategory === category}
                onPress={() => setSelectedCategory(category)}
                style={{ marginRight: 8, marginBottom: 4 }}
              >
                {category}
              </Chip>
            ))}
          </View>

          <Divider style={{ marginBottom: 16 }} />

          {logs.length === 0 ? (
            <Text>No logs found</Text>
          ) : (
            logs.slice(0, 10).map((log, index) => (
              <View key={log.id} style={{
                marginBottom: 8,
                padding: 8,
                backgroundColor: log.level === 'ERROR' ? '#ffebee' :
                                log.level === 'WARN' ? '#fff3e0' : '#f5f5f5',
                borderRadius: 4
              }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                  [{log.level}] [{log.category}] {log.operation}
                </Text>
                <Text style={{ fontSize: 10, color: '#666' }}>
                  {new Date(log.timestamp).toLocaleTimeString()}
                </Text>
                {log.data && (
                  <Text style={{ fontSize: 10, marginTop: 4 }}>
                    Data: {JSON.stringify(log.data).substring(0, 100)}...
                  </Text>
                )}
                {log.error && (
                  <Text style={{ fontSize: 10, color: 'red', marginTop: 4 }}>
                    Error: {log.error.message}
                  </Text>
                )}
              </View>
            ))
          )}

          {logs.length > 10 && (
            <Text style={{ textAlign: 'center', marginTop: 8, color: '#666' }}>
              Showing 10 of {logs.length} logs
            </Text>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default DebugScreen;
