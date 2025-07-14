import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Searchbar, Button, List } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers } from '../../store/slices/customerSlice';
import { setCustomer } from '../../store/slices/cartSlice';
import { colors, spacing, borderRadius } from '../../constants/theme';

const CustomerSelectScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { customers, isLoading } = useSelector((state) => state.customers);
  const { customer: selectedCustomer } = useSelector((state) => state.cart);
  
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchCustomers({ search: '' }));
  }, [dispatch]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      dispatch(fetchCustomers({ search: searchQuery }));
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, dispatch]);

  const handleSelectCustomer = (customer) => {
    dispatch(setCustomer(customer));
    navigation.goBack();
  };

  const handleClearCustomer = () => {
    dispatch(setCustomer(null));
    navigation.goBack();
  };

  const renderCustomer = ({ item }) => (
    <Card style={styles.customerCard}>
      <List.Item
        title={item.name}
        description={`${item.email || 'No email'} • ${item.phone || 'No phone'}`}
        left={(props) => <List.Icon {...props} icon="account" />}
        right={(props) => (
          <Button
            mode={selectedCustomer?.id === item.id ? "contained" : "outlined"}
            onPress={() => handleSelectCustomer(item)}
            compact
          >
            {selectedCustomer?.id === item.id ? 'Selected' : 'Select'}
          </Button>
        )}
        onPress={() => handleSelectCustomer(item)}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search customers..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        
        {selectedCustomer && (
          <Button
            mode="outlined"
            onPress={handleClearCustomer}
            style={styles.clearButton}
          >
            Clear Selection
          </Button>
        )}
      </View>

      {selectedCustomer && (
        <Card style={styles.selectedCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.selectedTitle}>
              Selected Customer
            </Text>
            <Text variant="bodyLarge" style={styles.selectedName}>
              {selectedCustomer.name}
            </Text>
            <Text variant="bodyMedium" style={styles.selectedDetails}>
              {selectedCustomer.email || 'No email'} • {selectedCustomer.phone || 'No phone'}
            </Text>
          </Card.Content>
        </Card>
      )}

      <FlatList
        data={customers}
        renderItem={renderCustomer}
        keyExtractor={(item) => item.id.toString()}
        style={styles.customersList}
        contentContainerStyle={styles.customersContent}
        refreshing={isLoading}
        onRefresh={() => dispatch(fetchCustomers({ search: searchQuery }))}
        ListEmptyComponent={
          !isLoading && (
            <View style={styles.emptyContainer}>
              <Text variant="bodyLarge" style={styles.emptyText}>
                No customers found
              </Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.white,
    gap: spacing.sm,
  },
  searchbar: {
    elevation: 0,
  },
  clearButton: {
    borderColor: colors.danger,
  },
  selectedCard: {
    margin: spacing.md,
    marginBottom: 0,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  selectedTitle: {
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  selectedName: {
    color: colors.dark,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  selectedDetails: {
    color: colors.gray[600],
  },
  customersList: {
    flex: 1,
  },
  customersContent: {
    padding: spacing.md,
  },
  customerCard: {
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    color: colors.gray[600],
  },
});

export default CustomerSelectScreen;
