import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, TextInput, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity, removeFromCart, setDiscount, setTax, clearCart } from '../../store/slices/cartSlice';
import { processSale } from '../../store/slices/posSlice';
import { colors, spacing, borderRadius } from '../../constants/theme';
import CartItem from '../../components/CartItem';

const PaymentScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, subtotal, total, discount, tax, shipping, customer, notes: cartNotes } = useSelector((state) => state.cart);
  const { isProcessing } = useSelector((state) => state.pos);
  
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [receivedAmount, setReceivedAmount] = useState('');
  const [notes, setNotes] = useState('');

  const handleQuantityChange = (productId, quantity) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleDiscountChange = (value) => {
    const discountValue = parseFloat(value) || 0;
    if (discountValue >= 0 && discountValue <= 100) {
      dispatch(setDiscount(discountValue));
    }
  };

  const handleTaxChange = (value) => {
    const taxValue = parseFloat(value) || 0;
    if (taxValue >= 0 && taxValue <= 100) {
      dispatch(setTax(taxValue));
    }
  };

  const handleProcessSale = async () => {
    console.log('🔄 [PaymentScreen] Processing sale started...', {
      itemsCount: items.length,
      subtotal,
      total,
      receivedAmount,
      paymentMethod,
      discount,
      tax
    });

    if (items.length === 0) {
      console.log('❌ [PaymentScreen] Cart is empty');
      Alert.alert('Error', 'Cart is empty');
      return;
    }

    if (paymentMethod === 'cash') {
      const received = parseFloat(receivedAmount) || 0;
      if (received < total) {
        console.log('❌ [PaymentScreen] Insufficient payment', { received, total });
        Alert.alert('Error', 'Received amount must be greater than or equal to total');
        return;
      }
    }

    // Validate stock availability before processing
    console.log('🔍 [PaymentScreen] Validating stock availability...');
    for (const item of items) {
      if (item.stock_quantity < item.quantity) {
        console.log('❌ [PaymentScreen] Insufficient stock', {
          productId: item.id,
          productName: item.name,
          available: item.stock_quantity,
          requested: item.quantity
        });
        Alert.alert('Error', `Insufficient stock for ${item.name}. Available: ${item.stock_quantity}, Requested: ${item.quantity}`);
        return;
      }
    }

    console.log('✅ [PaymentScreen] Validation passed, creating sale data...');

    // Calculate amounts properly
    const discountAmount = (subtotal * discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * tax) / 100;
    const grandTotal = taxableAmount + taxAmount + shipping;
    const receivedAmountValue = parseFloat(receivedAmount) || grandTotal;
    const changeAmount = paymentMethod === 'cash' ? Math.max(0, receivedAmountValue - grandTotal) : 0;

    const saleData = {
      customer_id: customer?.id || null,
      warehouse_id: 1, // Default warehouse
      sale_items: items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
      subtotal: subtotal,
      discount: discount,
      tax_rate: tax,
      tax_amount: taxAmount,
      shipping: shipping,
      grand_total: grandTotal,
      received_amount: receivedAmountValue,
      change_amount: changeAmount,
      payment_type: paymentMethod,
      payment_status: 1, // Paid
      status: 1, // Completed
      note: notes,
      date: new Date().toISOString().split('T')[0],
    };

    try {
      console.log('🚀 [PaymentScreen] Dispatching processSale action...', saleData);
      const result = await dispatch(processSale(saleData)).unwrap();
      console.log('✅ [PaymentScreen] Sale processed successfully!', result);

      console.log('🧹 [PaymentScreen] Clearing cart...');
      dispatch(clearCart());

      console.log('📄 [PaymentScreen] Navigating to receipt...', { saleId: result.id });
      navigation.navigate('Receipt', { sale: result });
    } catch (error) {
      console.error('❌ [PaymentScreen] Sale processing failed:', error);
      Alert.alert('Error', error || 'Failed to process sale');
    }
  };

  const changeAmount = paymentMethod === 'cash' ? 
    Math.max(0, (parseFloat(receivedAmount) || 0) - total) : 0;

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="titleLarge" style={styles.emptyText}>
          Your cart is empty
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          Continue Shopping
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Cart Items
          </Text>
          
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveItem}
            />
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Order Summary
          </Text>
          
          <View style={styles.summaryRow}>
            <Text>Subtotal:</Text>
            <Text>₱{subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Discount (%):</Text>
            <TextInput
              value={discount.toString()}
              onChangeText={handleDiscountChange}
              keyboardType="numeric"
              style={styles.smallInput}
              mode="outlined"
              dense
            />
          </View>
          
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Tax (%):</Text>
            <TextInput
              value={tax.toString()}
              onChangeText={handleTaxChange}
              keyboardType="numeric"
              style={styles.smallInput}
              mode="outlined"
              dense
            />
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text variant="titleMedium">Total:</Text>
            <Text variant="titleMedium" style={styles.totalAmount}>
              ₱{total.toFixed(2)}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Payment
          </Text>
          
          <View style={styles.paymentMethods}>
            <Button
              mode={paymentMethod === 'cash' ? 'contained' : 'outlined'}
              onPress={() => setPaymentMethod('cash')}
              style={styles.paymentButton}
            >
              Cash
            </Button>
            <Button
              mode={paymentMethod === 'card' ? 'contained' : 'outlined'}
              onPress={() => setPaymentMethod('card')}
              style={styles.paymentButton}
            >
              Card
            </Button>
          </View>
          
          {paymentMethod === 'cash' && (
            <View>
              <TextInput
                label="Received Amount"
                value={receivedAmount}
                onChangeText={setReceivedAmount}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
              />
              
              {receivedAmount && (
                <View style={styles.changeRow}>
                  <Text variant="titleMedium">Change:</Text>
                  <Text variant="titleMedium" style={styles.changeAmount}>
                    ₱{changeAmount.toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
          )}
          
          <TextInput
            label="Notes (Optional)"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />
        </Card.Content>
      </Card>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleProcessSale}
          loading={isProcessing}
          disabled={isProcessing}
          style={styles.processButton}
          contentStyle={styles.processButtonContent}
        >
          Process Sale - ₱{total.toFixed(2)}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  emptyText: {
    marginBottom: spacing.lg,
    color: colors.gray[600],
  },
  backButton: {
    paddingHorizontal: spacing.lg,
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  inputLabel: {
    flex: 1,
  },
  smallInput: {
    width: 80,
  },
  divider: {
    marginVertical: spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalAmount: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  paymentMethods: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  paymentButton: {
    flex: 1,
  },
  input: {
    marginBottom: spacing.md,
  },
  changeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  changeAmount: {
    fontWeight: 'bold',
    color: colors.success,
  },
  footer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  processButton: {
    borderRadius: borderRadius.md,
  },
  processButtonContent: {
    paddingVertical: spacing.md,
  },
});

export default PaymentScreen;
