import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, TextInput } from 'react-native-paper';
import { colors, spacing } from '../constants/theme';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const handleQuantityChange = (value) => {
    const quantity = parseInt(value) || 0;
    if (quantity >= 0) {
      onQuantityChange(item.id, quantity);
    }
  };

  const incrementQuantity = () => {
    onQuantityChange(item.id, item.quantity + 1);
  };

  const decrementQuantity = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.productInfo}>
        <Text variant="bodyLarge" style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {item.name}
        </Text>
        <Text variant="bodySmall" style={styles.code} numberOfLines={1} ellipsizeMode="tail">
          {item.code}
        </Text>
        <Text variant="bodyMedium" style={styles.price} numberOfLines={1} ellipsizeMode="tail">
          ₱{item.price?.toFixed(2)} each
        </Text>
      </View>
      
      <View style={styles.controls}>
        <View style={styles.quantityControls}>
          <IconButton
            icon="minus"
            size={20}
            onPress={decrementQuantity}
            disabled={item.quantity <= 1}
            style={styles.quantityButton}
          />
          
          <TextInput
            value={item.quantity.toString()}
            onChangeText={handleQuantityChange}
            keyboardType="numeric"
            style={styles.quantityInput}
            mode="outlined"
            dense
            textAlign="center"
          />
          
          <IconButton
            icon="plus"
            size={20}
            onPress={incrementQuantity}
            style={styles.quantityButton}
          />
        </View>
        
        <View style={styles.rightSection}>
          <Text variant="titleMedium" style={styles.total}>
            ₱{item.total?.toFixed(2)}
          </Text>
          
          <IconButton
            icon="delete"
            size={20}
            onPress={() => onRemove(item.id)}
            iconColor={colors.danger}
            style={styles.deleteButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  productInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  name: {
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  code: {
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  price: {
    color: colors.gray[700],
  },
  controls: {
    alignItems: 'flex-end',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  quantityButton: {
    margin: 0,
    width: 32,
    height: 32,
  },
  quantityInput: {
    width: 60,
    marginHorizontal: spacing.xs,
    textAlign: 'center',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  total: {
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  deleteButton: {
    margin: 0,
    width: 32,
    height: 32,
  },
});

export default CartItem;
