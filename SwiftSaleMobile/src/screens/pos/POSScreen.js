import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, FAB, Searchbar, Chip } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { FlatGrid } from 'react-native-super-grid';
import { fetchProducts, fetchCategories, setFilters } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { colors, spacing, borderRadius } from '../../constants/theme';
import ProductCard from '../../components/ProductCard';
import CartSummary from '../../components/CartSummary';

const POSScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { products, categories, isLoading, filters } = useSelector((state) => state.products);
  const { items: cartItems, total } = useSelector((state) => state.cart);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      dispatch(setFilters({ search: searchQuery }));
      dispatch(fetchProducts({ page: 1, search: searchQuery, categoryId: selectedCategory }));
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, selectedCategory, dispatch]);

  const handleAddToCart = (product) => {
    if (product.stock_quantity <= 0) {
      Alert.alert('Out of Stock', 'This product is currently out of stock.');
      return;
    }
    
    dispatch(addToCart(product));
  };

  const handleCategorySelect = (categoryId) => {
    const newCategoryId = selectedCategory === categoryId ? null : categoryId;
    setSelectedCategory(newCategoryId);
    dispatch(setFilters({ categoryId: newCategoryId }));
  };

  const renderProduct = ({ item }) => (
    <ProductCard
      product={item}
      onAddToCart={() => handleAddToCart(item)}
      isInCart={cartItems.some(cartItem => cartItem.id === item.id)}
    />
  );

  const renderCategory = ({ item }) => (
    <Chip
      mode={selectedCategory === item.id ? 'flat' : 'outlined'}
      selected={selectedCategory === item.id}
      onPress={() => handleCategorySelect(item.id)}
      style={styles.categoryChip}
    >
      {item.name}
    </Chip>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search products..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      {categories.length > 0 && (
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoriesRow}>
              {categories.map((category) => (
                <Chip
                  key={category.id}
                  mode={selectedCategory === category.id ? 'flat' : 'outlined'}
                  selected={selectedCategory === category.id}
                  onPress={() => handleCategorySelect(category.id)}
                  style={styles.categoryChip}
                >
                  <Text numberOfLines={1} ellipsizeMode="tail">{category.name}</Text>
                </Chip>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      <View style={styles.content}>
        <FlatGrid
          itemDimension={180}
          data={products}
          style={styles.productGrid}
          spacing={spacing.sm}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          refreshing={isLoading}
          onRefresh={() => dispatch(fetchProducts({ page: 1, search: searchQuery, categoryId: selectedCategory }))}
        />
      </View>

      {cartItems.length > 0 && (
        <CartSummary
          itemCount={cartItems.length}
          total={total}
          onPress={() => navigation.navigate('Payment')}
        />
      )}

      <FAB
        icon="cart"
        style={[styles.fab, { backgroundColor: cartItems.length > 0 ? colors.primary : colors.gray[400] }]}
        onPress={() => navigation.navigate('Payment')}
        disabled={cartItems.length === 0}
        label={cartItems.length > 0 ? cartItems.length.toString() : undefined}
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
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.white,
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchbar: {
    flex: 1,
  },

  categoriesContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  categoriesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  categoryChip: {
    marginRight: spacing.sm,
  },
  content: {
    flex: 1,
  },
  productGrid: {
    padding: spacing.md,
  },
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 80,
  },
});

export default POSScreen;
