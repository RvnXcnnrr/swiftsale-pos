import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, spacing, borderRadius } from '../constants/theme';

const CartSummary = ({ itemCount, total, onPress }) => {
  return (
    <Card style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <Card.Content style={styles.content}>
          <View style={styles.leftSection}>
            <Icon name="shopping-cart" size={24} color={colors.primary} />
            <View style={styles.textContainer}>
              <Text variant="bodyMedium" style={styles.itemCount}>
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </Text>
              <Text variant="titleMedium" style={styles.total}>
                ${total.toFixed(2)}
              </Text>
            </View>
          </View>
          
          <Button
            mode="contained"
            onPress={onPress}
            style={styles.checkoutButton}
            contentStyle={styles.buttonContent}
          >
            Checkout
          </Button>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    elevation: 8,
    backgroundColor: colors.white,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: spacing.md,
  },
  itemCount: {
    color: colors.gray[600],
  },
  total: {
    fontWeight: 'bold',
    color: colors.dark,
  },
  checkoutButton: {
    borderRadius: borderRadius.md,
  },
  buttonContent: {
    paddingHorizontal: spacing.md,
  },
});

export default CartSummary;
