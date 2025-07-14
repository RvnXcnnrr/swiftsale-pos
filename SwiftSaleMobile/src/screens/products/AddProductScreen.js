import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  HelperText,
  Divider,
  Chip,
  ActivityIndicator,
  Menu,
  TouchableRipple,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, fetchCategories, fetchBrands } from '../../store/slices/productSlice';
import { colors, spacing, borderRadius } from '../../constants/theme';
import { logInfo, logError, LOG_CATEGORIES } from '../../utils/debugLogger';
import ProductImagePicker from '../../components/ImagePicker';

const AddProductScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { categories, brands, isLoading } = useSelector((state) => state.products);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    barcode: '',
    price: '',
    cost: '',
    stock_quantity: '',
    min_stock: '',
    category_id: '',
    brand_id: '',
    description: '',
  });

  // Image state
  const [selectedImage, setSelectedImage] = useState(null);

  // Validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Menu state for dropdowns
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [brandMenuVisible, setBrandMenuVisible] = useState(false);

  useEffect(() => {
    // Fetch categories and brands when component mounts
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch]);

  // Auto-generate product code based on name
  useEffect(() => {
    if (formData.name && !formData.code) {
      const generatedCode = formData.name
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 10);
      setFormData(prev => ({ ...prev, code: generatedCode }));
    }
  }, [formData.name]);

  // Auto-generate barcode
  useEffect(() => {
    if (formData.code && !formData.barcode) {
      const timestamp = Date.now().toString().slice(-6);
      const generatedBarcode = `${formData.code}${timestamp}`.substring(0, 13);
      setFormData(prev => ({ ...prev, barcode: generatedBarcode }));
    }
  }, [formData.code]);

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Product code is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid positive number';
    }

    if (!formData.cost.trim()) {
      newErrors.cost = 'Cost is required';
    } else if (isNaN(parseFloat(formData.cost)) || parseFloat(formData.cost) <= 0) {
      newErrors.cost = 'Cost must be a valid positive number';
    }

    if (!formData.stock_quantity.trim()) {
      newErrors.stock_quantity = 'Stock quantity is required';
    } else if (isNaN(parseInt(formData.stock_quantity)) || parseInt(formData.stock_quantity) < 0) {
      newErrors.stock_quantity = 'Stock quantity must be a valid non-negative number';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }

    if (!formData.brand_id) {
      newErrors.brand_id = 'Brand is required';
    }

    // Price vs Cost validation
    if (formData.price && formData.cost) {
      const price = parseFloat(formData.price);
      const cost = parseFloat(formData.cost);
      if (price < cost) {
        newErrors.price = 'Price should not be less than cost';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleImageSelected = (imageUri) => {
    setSelectedImage(imageUri);
    logInfo(LOG_CATEGORIES.PRODUCTS, 'addProduct_image_selected', { imageUri });
  };

  const handleImageRemoved = () => {
    setSelectedImage(null);
    logInfo(LOG_CATEGORIES.PRODUCTS, 'addProduct_image_removed', {});
  };

  const handleSubmit = async () => {
    logInfo(LOG_CATEGORIES.PRODUCTS, 'addProduct_form_submit', { formData });

    if (!validateForm()) {
      logError(LOG_CATEGORIES.PRODUCTS, 'addProduct_validation_failed', { errors });
      Alert.alert('Validation Error', 'Please fix the errors and try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare product data
      const productData = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        barcode: formData.barcode.trim(),
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        stock_quantity: parseInt(formData.stock_quantity),
        min_stock: formData.min_stock ? parseInt(formData.min_stock) : 5,
        category_id: parseInt(formData.category_id),
        brand_id: parseInt(formData.brand_id),
        description: formData.description.trim(),
        image_url: selectedImage || `https://via.placeholder.com/150x150?text=${encodeURIComponent(formData.name)}`,
        is_active: 1,
      };

      logInfo(LOG_CATEGORIES.PRODUCTS, 'addProduct_submitting', { productData });

      // Dispatch add product action
      const result = await dispatch(addProduct(productData)).unwrap();

      logInfo(LOG_CATEGORIES.PRODUCTS, 'addProduct_success', { result });

      Alert.alert(
        'Success',
        'Product added successfully!',
        [
          {
            text: 'Add Another',
            onPress: () => {
              // Reset form
              setFormData({
                name: '',
                code: '',
                barcode: '',
                price: '',
                cost: '',
                stock_quantity: '',
                min_stock: '',
                category_id: '',
                brand_id: '',
                description: '',
              });
              setSelectedImage(null);
            },
          },
          {
            text: 'Go Back',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      logError(LOG_CATEGORIES.PRODUCTS, 'addProduct_failed', { error: error.message });
      Alert.alert('Error', error.message || 'Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === parseInt(formData.category_id));
  const selectedBrand = brands.find(brand => brand.id === parseInt(formData.brand_id));

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Add New Product
            </Text>
            <Divider style={styles.divider} />

            {/* Product Image */}
            <ProductImagePicker
              imageUri={selectedImage}
              onImageSelected={handleImageSelected}
              onImageRemoved={handleImageRemoved}
            />

            {/* Product Name */}
            <TextInput
              label="Product Name *"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              mode="outlined"
              style={styles.input}
              error={!!errors.name}
              placeholder="Enter product name"
            />
            <HelperText type="error" visible={!!errors.name}>
              {errors.name}
            </HelperText>

            {/* Product Code */}
            <TextInput
              label="Product Code *"
              value={formData.code}
              onChangeText={(value) => handleInputChange('code', value.toUpperCase())}
              mode="outlined"
              style={styles.input}
              error={!!errors.code}
              placeholder="Auto-generated or enter custom code"
            />
            <HelperText type="error" visible={!!errors.code}>
              {errors.code}
            </HelperText>

            {/* Barcode */}
            <TextInput
              label="Barcode"
              value={formData.barcode}
              onChangeText={(value) => handleInputChange('barcode', value)}
              mode="outlined"
              style={styles.input}
              placeholder="Auto-generated or enter custom barcode"
            />

            <Divider style={styles.divider} />

            {/* Price and Cost Row */}
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <TextInput
                  label="Selling Price *"
                  value={formData.price}
                  onChangeText={(value) => handleInputChange('price', value)}
                  mode="outlined"
                  keyboardType="decimal-pad"
                  error={!!errors.price}
                  placeholder="0.00"
                  left={<TextInput.Affix text="₱" />}
                />
                <HelperText type="error" visible={!!errors.price}>
                  {errors.price}
                </HelperText>
              </View>

              <View style={styles.halfWidth}>
                <TextInput
                  label="Cost Price *"
                  value={formData.cost}
                  onChangeText={(value) => handleInputChange('cost', value)}
                  mode="outlined"
                  keyboardType="decimal-pad"
                  error={!!errors.cost}
                  placeholder="0.00"
                  left={<TextInput.Affix text="₱" />}
                />
                <HelperText type="error" visible={!!errors.cost}>
                  {errors.cost}
                </HelperText>
              </View>
            </View>

            {/* Stock Quantities Row */}
            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <TextInput
                  label="Stock Quantity *"
                  value={formData.stock_quantity}
                  onChangeText={(value) => handleInputChange('stock_quantity', value)}
                  mode="outlined"
                  keyboardType="number-pad"
                  error={!!errors.stock_quantity}
                  placeholder="0"
                />
                <HelperText type="error" visible={!!errors.stock_quantity}>
                  {errors.stock_quantity}
                </HelperText>
              </View>

              <View style={styles.halfWidth}>
                <TextInput
                  label="Minimum Stock"
                  value={formData.min_stock}
                  onChangeText={(value) => handleInputChange('min_stock', value)}
                  mode="outlined"
                  keyboardType="number-pad"
                  placeholder="5"
                />
              </View>
            </View>

            <Divider style={styles.divider} />

            {/* Category Selection */}
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Category *
            </Text>
            <Menu
              visible={categoryMenuVisible}
              onDismiss={() => setCategoryMenuVisible(false)}
              anchor={
                <TouchableRipple
                  onPress={() => setCategoryMenuVisible(true)}
                  style={[styles.dropdownButton, errors.category_id && styles.dropdownError]}
                >
                  <View style={styles.dropdownContent}>
                    <Text style={styles.dropdownText}>
                      {selectedCategory ? selectedCategory.name : 'Select Category'}
                    </Text>
                    <Text style={styles.dropdownIcon}>▼</Text>
                  </View>
                </TouchableRipple>
              }
            >
              {categories.map((category) => (
                <Menu.Item
                  key={category.id}
                  onPress={() => {
                    handleInputChange('category_id', category.id.toString());
                    setCategoryMenuVisible(false);
                  }}
                  title={category.name}
                />
              ))}
            </Menu>
            <HelperText type="error" visible={!!errors.category_id}>
              {errors.category_id}
            </HelperText>

            {/* Brand Selection */}
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Brand *
            </Text>
            <Menu
              visible={brandMenuVisible}
              onDismiss={() => setBrandMenuVisible(false)}
              anchor={
                <TouchableRipple
                  onPress={() => setBrandMenuVisible(true)}
                  style={[styles.dropdownButton, errors.brand_id && styles.dropdownError]}
                >
                  <View style={styles.dropdownContent}>
                    <Text style={styles.dropdownText}>
                      {selectedBrand ? selectedBrand.name : 'Select Brand'}
                    </Text>
                    <Text style={styles.dropdownIcon}>▼</Text>
                  </View>
                </TouchableRipple>
              }
            >
              {brands.map((brand) => (
                <Menu.Item
                  key={brand.id}
                  onPress={() => {
                    handleInputChange('brand_id', brand.id.toString());
                    setBrandMenuVisible(false);
                  }}
                  title={brand.name}
                />
              ))}
            </Menu>
            <HelperText type="error" visible={!!errors.brand_id}>
              {errors.brand_id}
            </HelperText>

            <Divider style={styles.divider} />

            {/* Description */}
            <TextInput
              label="Description"
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
              placeholder="Enter product description (optional)"
            />

            {/* Submit Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                style={styles.cancelButton}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                disabled={isSubmitting || isLoading}
                loading={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Product'}
              </Button>
            </View>

            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.loadingText}>Loading categories and brands...</Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: spacing.md,
    borderRadius: borderRadius.lg,
  },
  title: {
    fontWeight: 'bold',
    color: colors.dark,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  divider: {
    marginVertical: spacing.md,
  },
  input: {
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  halfWidth: {
    flex: 0.48,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: colors.gray[400],
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
    minHeight: 56,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  dropdownError: {
    borderColor: colors.error,
  },
  dropdownContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: colors.dark,
  },
  dropdownIcon: {
    fontSize: 12,
    color: colors.gray[600],
  },
  selectedChip: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  cancelButton: {
    flex: 0.4,
  },
  submitButton: {
    flex: 0.6,
    backgroundColor: colors.primary,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  loadingText: {
    marginLeft: spacing.sm,
    color: colors.gray[600],
  },
});

export default AddProductScreen;
