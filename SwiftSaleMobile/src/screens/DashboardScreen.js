import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { fetchDashboardStats } from '../store/slices/posSlice';
import { colors, spacing, borderRadius } from '../constants/theme';

const DashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { dashboardStats, isLoading } = useSelector((state) => state.pos);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const onRefresh = () => {
    dispatch(fetchDashboardStats());
  };

  const StatCard = ({ title, value, icon, color = colors.primary }) => (
    <Card style={[styles.statCard, { borderLeftColor: color }]}>
      <Card.Content style={styles.statContent}>
        <View style={styles.statInfo}>
          <Text variant="bodySmall" style={styles.statTitle}>
            {title}
          </Text>
          <Text variant="headlineSmall" style={styles.statValue}>
            {value}
          </Text>
        </View>
        <Icon name={icon} size={32} color={color} />
      </Card.Content>
    </Card>
  );

  const QuickAction = ({ title, icon, onPress, color = colors.primary }) => (
    <Card style={styles.actionCard}>
      <Card.Content style={styles.actionContent}>
        <Icon name={icon} size={32} color={color} />
        <Text variant="bodyMedium" style={styles.actionTitle}>
          {title}
        </Text>
        <Button mode="contained" onPress={onPress} style={styles.actionButton}>
          Open
        </Button>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.greeting}>
          Welcome back, {user?.name || 'User'}!
        </Text>
        <Text variant="bodyMedium" style={styles.date}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Today's Overview
        </Text>
        
        <View style={styles.statsGrid}>
          <StatCard
            title="Today's Sales"
            value={`$${dashboardStats.todaySales?.toFixed(2) || '0.00'}`}
            icon="today"
            color={colors.success}
          />
          <StatCard
            title="Total Revenue"
            value={`$${dashboardStats.totalRevenue?.toFixed(2) || '0.00'}`}
            icon="trending-up"
            color={colors.primary}
          />
          <StatCard
            title="Total Sales"
            value={dashboardStats.totalSales || '0'}
            icon="receipt"
            color={colors.info}
          />
          <StatCard
            title="Low Stock Items"
            value={dashboardStats.lowStockProducts || '0'}
            icon="warning"
            color={colors.warning}
          />
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Quick Actions
        </Text>
        
        <View style={styles.actionsGrid}>
          <QuickAction
            title="Start Sale"
            icon="point-of-sale"
            onPress={() => navigation.navigate('POS')}
            color={colors.success}
          />
          <QuickAction
            title="View Products"
            icon="inventory"
            onPress={() => navigation.navigate('Products')}
            color={colors.primary}
          />
          <QuickAction
            title="Sales History"
            icon="history"
            onPress={() => navigation.navigate('Sales')}
            color={colors.info}
          />
          <QuickAction
            title="Settings"
            icon="settings"
            onPress={() => navigation.navigate('Settings')}
            color={colors.gray[600]}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
  greeting: {
    color: colors.dark,
    fontWeight: 'bold',
  },
  date: {
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
  statsContainer: {
    padding: spacing.lg,
  },
  actionsContainer: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    color: colors.dark,
    fontWeight: 'bold',
  },
  statsGrid: {
    gap: spacing.md,
  },
  statCard: {
    borderLeftWidth: 4,
    borderRadius: borderRadius.md,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  statValue: {
    color: colors.dark,
    fontWeight: 'bold',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: borderRadius.md,
  },
  actionContent: {
    alignItems: 'center',
    padding: spacing.md,
  },
  actionTitle: {
    marginVertical: spacing.sm,
    textAlign: 'center',
    color: colors.dark,
  },
  actionButton: {
    marginTop: spacing.sm,
  },
});

export default DashboardScreen;
