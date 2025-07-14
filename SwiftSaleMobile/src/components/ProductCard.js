import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Button, Badge, Chip } from 'react-native-paper';
import { colors, spacing, borderRadius } from '../constants/theme';

const ProductCard = ({ product, onAddToCart, isInCart }) => {
  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  return (
    <Card style={[styles.card, isInCart && styles.cardSelected]}>
      <TouchableOpacity onPress={onAddToCart} disabled={isOutOfStock}>
        <Card.Cover
          source={{
            uri: product.image_url || 'https://via.placeholder.com/150x150?text=No+Image',
          }}
          style={styles.image}
        />
        
        <Card.Content style={styles.content}>
          <Text variant="bodyMedium" style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          
          <Text variant="bodySmall" style={styles.code} numberOfLines={1} ellipsizeMode="tail">
            Code: {product.code}
          </Text>

          {product.category && (
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryText} numberOfLines={1} ellipsizeMode="tail">
                {product.category.name}
              </Text>
            </View>
          )}

          <View style={styles.priceRow}>
            <Text variant="titleMedium" style={styles.price}>
              ₱{product.price?.toFixed(2) || '0.00'}
            </Text>

            {isOutOfStock && (
              <Badge style={[styles.badge, styles.outOfStockBadge]}>
                Out of Stock
              </Badge>
            )}

            {isLowStock && !isOutOfStock && (
              <Badge style={[styles.badge, styles.lowStockBadge]}>
                Low Stock
              </Badge>
            )}
          </View>

          <Text variant="bodySmall" style={styles.stock} numberOfLines={1} ellipsizeMode="tail">
            Stock: {product.stock_quantity || 0}
          </Text>
          
          <Button
            mode={isInCart ? "contained" : "outlined"}
            onPress={onAddToCart}
            disabled={isOutOfStock}
            style={styles.addButton}
            contentStyle={styles.buttonContent}
            compact
            labelStyle={styles.buttonLabel}
          >
            {isInCart ? 'Added' : 'Add to Cart'}
          </Button>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    elevation: 2,
  },
  cardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  image: {
    height: 120,
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
  },
  content: {
    padding: spacing.sm,
  },
  name: {
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.xs,
    minHeight: 40,
  },
  code: {
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
    backgroundColor: colors.primary + '15',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.primary + '30',
    maxWidth: '100%',
    overflow: 'hidden',
  },
  categoryText: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 12,
    flexShrink: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  price: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  badge: {
    fontSize: 10,
  },
  outOfStockBadge: {
    backgroundColor: colors.danger,
  },
  lowStockBadge: {
    backgroundColor: colors.warning,
  },
  stock: {
    color: colors.gray[600],
    marginBottom: spacing.sm,
  },
  addButton: {
    marginTop: spacing.xs,
  },
  buttonContent: {
    paddingVertical: spacing.xs,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ProductCard;
