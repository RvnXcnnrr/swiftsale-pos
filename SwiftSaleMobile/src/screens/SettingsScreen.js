import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, List, Switch, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { colors, spacing, borderRadius } from '../constants/theme';

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isOnline, lastSyncTime } = useSelector((state) => state.offline);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => dispatch(logoutUser()),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            User Information
          </Text>
          
          <List.Item
            title="Name"
            description={user?.name || 'N/A'}
            left={(props) => <List.Icon {...props} icon="account" />}
          />
          
          <List.Item
            title="Email"
            description={user?.email || 'N/A'}
            left={(props) => <List.Icon {...props} icon="email" />}
          />
          
          <List.Item
            title="Role"
            description={user?.role?.display_name || 'N/A'}
            left={(props) => <List.Icon {...props} icon="shield-account" />}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            System Status
          </Text>
          
          <List.Item
            title="Connection Status"
            description={isOnline ? 'Online' : 'Offline'}
            left={(props) => (
              <List.Icon 
                {...props} 
                icon={isOnline ? "wifi" : "wifi-off"} 
                color={isOnline ? colors.success : colors.danger}
              />
            )}
          />
          
          {lastSyncTime && (
            <List.Item
              title="Last Sync"
              description={new Date(lastSyncTime).toLocaleString()}
              left={(props) => <List.Icon {...props} icon="sync" />}
            />
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            App Settings
          </Text>
          
          <List.Item
            title="Notifications"
            description="Enable push notifications"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => <Switch value={true} onValueChange={() => {}} />}
          />
          
          <List.Item
            title="Auto Sync"
            description="Automatically sync data when online"
            left={(props) => <List.Icon {...props} icon="sync" />}
            right={() => <Switch value={true} onValueChange={() => {}} />}
          />
          
          <List.Item
            title="Sound Effects"
            description="Play sounds for actions"
            left={(props) => <List.Icon {...props} icon="volume-high" />}
            right={() => <Switch value={false} onValueChange={() => {}} />}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            About
          </Text>
          
          <List.Item
            title="App Version"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
          
          <List.Item
            title="Build Number"
            description="100"
            left={(props) => <List.Icon {...props} icon="hammer" />}
          />
          
          <List.Item
            title="Developer"
            description="SwiftSale Team"
            left={(props) => <List.Icon {...props} icon="code-tags" />}
          />
        </Card.Content>
      </Card>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleLogout}
          style={[styles.logoutButton, { backgroundColor: colors.danger }]}
          contentStyle={styles.logoutButtonContent}
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },
  card: {
    margin: spacing.md,
    borderRadius: borderRadius.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    color: colors.dark,
    fontWeight: 'bold',
  },
  footer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  logoutButton: {
    borderRadius: borderRadius.md,
  },
  logoutButtonContent: {
    paddingVertical: spacing.md,
  },
});

export default SettingsScreen;
