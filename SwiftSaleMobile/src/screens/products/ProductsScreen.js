import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Searchbar, Chip, FAB, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories, setFilters } from '../../store/slices/productSlice';
import { colors, spacing, borderRadius } from '../../constants/theme';

const ProductsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { products, categories, isLoading, pagination } = useSelector((state) => state.products);

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

  const handleCategorySelect = (categoryId) => {
    const newCategoryId = selectedCategory === categoryId ? null : categoryId;
    setSelectedCategory(newCategoryId);
    dispatch(setFilters({ categoryId: newCategoryId }));
  };

  const loadMoreProducts = () => {
    if (pagination.hasMore && !isLoading) {
      dispatch(fetchProducts({
        page: pagination.currentPage + 1,
        search: searchQuery,
        categoryId: selectedCategory,
      }));
    }
  };

  const renderProduct = ({ item }) => (
    <Card style={styles.productCard}>
      <Card.Content>
        <View style={styles.productHeader}>
          <View style={styles.productInfo}>
            <Text variant="titleMedium" style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
              {item.name}
            </Text>
            <Text variant="titleMedium" style={styles.productPrice}>
              ₱{item.price?.toFixed(2)}
            </Text>
          </View>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => navigation.navigate('EditProduct', { productId: item.id, product: item })}
            style={styles.editButton}
          />
        </View>

        <Text variant="bodySmall" style={styles.productCode} numberOfLines={1} ellipsizeMode="tail">
          Code: {item.code}
        </Text>

        <View style={styles.productFooter}>
          <Text variant="bodySmall" style={styles.stockText} numberOfLines={1} ellipsizeMode="tail">
            Stock: {item.stock_quantity || 0}
          </Text>

          {item.category && (
            <Chip mode="outlined" compact style={styles.categoryChip}>
              <Text numberOfLines={1} ellipsizeMode="tail">{item.category.name}</Text>
            </Chip>
          )}
        </View>
      </Card.Content>
    </Card>
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
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Chip
                mode={selectedCategory === item.id ? 'flat' : 'outlined'}
                selected={selectedCategory === item.id}
                onPress={() => handleCategorySelect(item.id)}
                style={styles.categoryFilter}
              >
                <Text numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
              </Chip>
            )}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
      )}

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        style={styles.productsList}
        contentContainerStyle={styles.productsContent}
        refreshing={isLoading && pagination.currentPage === 1}
        onRefresh={() => dispatch(fetchProducts({ page: 1, search: searchQuery, categoryId: selectedCategory }))}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={
          !isLoading && (
            <View style={styles.emptyContainer}>
              <Text variant="bodyLarge" style={styles.emptyText}>
                No products found
              </Text>
            </View>
          )
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddProduct')}
        label="Add Product"
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
  },
  searchbar: {
    elevation: 0,
  },
  categoriesContainer: {
    backgroundColor: colors.white,
    paddingBottom: spacing.md,
  },
  categoriesList: {
    paddingHorizontal: spacing.md,
  },
  categoryFilter: {
    marginRight: spacing.sm,
  },
  productsList: {
    flex: 1,
  },
  productsContent: {
    padding: spacing.md,
  },
  productCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  productInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productName: {
    flex: 1,
    fontWeight: 'bold',
    color: colors.dark,
    marginRight: spacing.md,
  },
  editButton: {
    margin: 0,
    backgroundColor: colors.gray[100],
  },
  productPrice: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  productCode: {
    color: colors.gray[600],
    marginBottom: spacing.md,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockText: {
    color: colors.gray[700],
  },
  categoryChip: {
    height: 24,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});

export default ProductsScreen;
