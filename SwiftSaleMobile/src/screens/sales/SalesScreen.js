import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSales } from '../../store/slices/posSlice';
import { colors, spacing, borderRadius } from '../../constants/theme';

const SalesScreen = () => {
  const dispatch = useDispatch();
  const { sales, isLoading, pagination } = useSelector((state) => state.pos);

  useEffect(() => {
    dispatch(fetchSales({ page: 1 }));
  }, [dispatch]);

  const loadMoreSales = () => {
    if (pagination.hasMore && !isLoading) {
      dispatch(fetchSales({ page: pagination.currentPage + 1 }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 1: return colors.success;
      case 2: return colors.warning;
      case 3: return colors.danger;
      default: return colors.gray[500];
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1: return 'Completed';
      case 2: return 'Pending';
      case 3: return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 1: return colors.success;
      case 2: return colors.warning;
      case 3: return colors.danger;
      default: return colors.gray[500];
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 1: return 'Paid';
      case 2: return 'Partial';
      case 3: return 'Unpaid';
      default: return 'Unknown';
    }
  };

  const renderSale = ({ item }) => (
    <Card style={styles.saleCard}>
      <Card.Content>
        <View style={styles.saleHeader}>
          <Text variant="titleMedium" style={styles.saleId}>
            Sale #{item.id}
          </Text>
          <Text variant="titleMedium" style={styles.saleAmount}>
            ${item.grand_total?.toFixed(2)}
          </Text>
        </View>
        
        <Text variant="bodySmall" style={styles.saleDate} numberOfLines={1} ellipsizeMode="tail">
          {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString()}
        </Text>

        {item.customer && (
          <Text variant="bodySmall" style={styles.customerName} numberOfLines={1} ellipsizeMode="tail">
            Customer: {item.customer.name}
          </Text>
        )}
        
        <View style={styles.saleFooter}>
          <View style={styles.statusContainer}>
            <Chip
              mode="flat"
              style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
              textStyle={styles.statusText}
            >
              {getStatusText(item.status)}
            </Chip>
            
            <Chip
              mode="flat"
              style={[styles.statusChip, { backgroundColor: getPaymentStatusColor(item.payment_status) }]}
              textStyle={styles.statusText}
            >
              {getPaymentStatusText(item.payment_status)}
            </Chip>
          </View>
          
          <Text variant="bodySmall" style={styles.paymentMethod}>
            {item.payment_type?.toUpperCase() || 'CASH'}
          </Text>
        </View>
        
        {item.sale_items && (
          <Text variant="bodySmall" style={styles.itemCount}>
            {item.sale_items.length} {item.sale_items.length === 1 ? 'item' : 'items'}
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sales}
        renderItem={renderSale}
        keyExtractor={(item) => item.id.toString()}
        style={styles.salesList}
        contentContainerStyle={styles.salesContent}
        refreshing={isLoading && pagination.currentPage === 1}
        onRefresh={() => dispatch(fetchSales({ page: 1 }))}
        onEndReached={loadMoreSales}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={
          !isLoading && (
            <View style={styles.emptyContainer}>
              <Text variant="bodyLarge" style={styles.emptyText}>
                No sales found
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
  salesList: {
    flex: 1,
  },
  salesContent: {
    padding: spacing.md,
  },
  saleCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
  },
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  saleId: {
    fontWeight: 'bold',
    color: colors.dark,
  },
  saleAmount: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  saleDate: {
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  customerName: {
    color: colors.gray[700],
    marginBottom: spacing.md,
  },
  saleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statusChip: {
    height: 24,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
  },
  paymentMethod: {
    color: colors.gray[600],
    fontWeight: 'bold',
  },
  itemCount: {
    color: colors.gray[600],
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

export default SalesScreen;
