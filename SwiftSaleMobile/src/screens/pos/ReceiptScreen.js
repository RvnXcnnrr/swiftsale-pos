import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Divider } from 'react-native-paper';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { colors, spacing, borderRadius } from '../../constants/theme';

const ReceiptScreen = ({ route, navigation }) => {
  const { sale } = route.params;

  const handlePrint = async () => {
    try {
      const html = generateReceiptHTML(sale);
      await Print.printAsync({ html });
    } catch (error) {
      Alert.alert('Error', 'Failed to print receipt');
    }
  };

  const handleShare = async () => {
    try {
      const html = generateReceiptHTML(sale);
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert('Error', 'Failed to share receipt');
    }
  };

  const handleNewSale = () => {
    navigation.navigate('POSMain');
  };

  const generateReceiptHTML = (sale) => {
    const items = sale.sale_items || [];
    const itemsHTML = items.map(item => `
      <tr>
        <td>${item.product?.name || 'Product'}</td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: right;">₱${item.price?.toFixed(2)}</td>
        <td style="text-align: right;">₱${item.total?.toFixed(2)}</td>
      </tr>
    `).join('');

    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .company-name { font-size: 24px; font-weight: bold; }
            .receipt-title { font-size: 18px; margin: 10px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 8px; border-bottom: 1px solid #ddd; }
            th { background-color: #f5f5f5; }
            .total-row { font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">SwiftSale</div>
            <div class="receipt-title">Sales Receipt</div>
            <div>Receipt #${sale.id}</div>
            <div>${new Date(sale.created_at).toLocaleString()}</div>
          </div>
          
          ${sale.customer ? `
            <div style="margin-bottom: 20px;">
              <strong>Customer:</strong> ${sale.customer.name}<br>
              ${sale.customer.email ? `<strong>Email:</strong> ${sale.customer.email}<br>` : ''}
              ${sale.customer.phone ? `<strong>Phone:</strong> ${sale.customer.phone}` : ''}
            </div>
          ` : ''}
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
          
          <table>
            <tr>
              <td><strong>Subtotal:</strong></td>
              <td style="text-align: right;"><strong>₱${(sale.grand_total - (sale.tax_amount || 0)).toFixed(2)}</strong></td>
            </tr>
            ${sale.discount > 0 ? `
              <tr>
                <td>Discount (${sale.discount}%):</td>
                <td style="text-align: right;">-₱${((sale.grand_total - (sale.tax_amount || 0)) * sale.discount / 100).toFixed(2)}</td>
              </tr>
            ` : ''}
            ${sale.tax_amount > 0 ? `
              <tr>
                <td>Tax:</td>
                <td style="text-align: right;">₱${sale.tax_amount.toFixed(2)}</td>
              </tr>
            ` : ''}
            <tr class="total-row">
              <td><strong>Total:</strong></td>
              <td style="text-align: right;"><strong>₱${sale.grand_total.toFixed(2)}</strong></td>
            </tr>
            <tr>
              <td>Payment Method:</td>
              <td style="text-align: right;">${(sale.payment_type || 'Cash').toUpperCase()}</td>
            </tr>
            ${sale.received_amount ? `
              <tr>
                <td>Received:</td>
                <td style="text-align: right;">₱${sale.received_amount.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Change:</td>
                <td style="text-align: right;">₱${(sale.received_amount - sale.grand_total).toFixed(2)}</td>
              </tr>
            ` : ''}
          </table>
          
          <div class="footer">
            <p>Thank you for your business!</p>
            <p>Powered by SwiftSale POS</p>
          </div>
        </body>
      </html>
    `;
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>
              Receipt
            </Text>
            <Text variant="titleMedium" style={styles.receiptNumber}>
              #${sale.id}
            </Text>
            <Text variant="bodyMedium" style={styles.date}>
              {new Date(sale.created_at).toLocaleString()}
            </Text>
          </View>

          {sale.customer && (
            <View style={styles.customerSection}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Customer
              </Text>
              <Text variant="bodyLarge">{sale.customer.name}</Text>
              {sale.customer.email && (
                <Text variant="bodyMedium" style={styles.customerDetail}>
                  {sale.customer.email}
                </Text>
              )}
              {sale.customer.phone && (
                <Text variant="bodyMedium" style={styles.customerDetail}>
                  {sale.customer.phone}
                </Text>
              )}
            </View>
          )}

          <View style={styles.itemsSection}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Items
            </Text>
            
            {(sale.sale_items || []).map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text variant="bodyLarge">{item.product?.name || 'Product'}</Text>
                  <Text variant="bodySmall" style={styles.itemDetails}>
                    {item.quantity} × ₱{item.price?.toFixed(2)}
                  </Text>
                </View>
                <Text variant="bodyLarge" style={styles.itemTotal}>
                  ₱{item.total?.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          <Divider style={styles.divider} />

          <View style={styles.summarySection}>
            <View style={styles.summaryRow}>
              <Text variant="bodyLarge">Subtotal:</Text>
              <Text variant="bodyLarge">
                ₱{(sale.grand_total - (sale.tax_amount || 0)).toFixed(2)}
              </Text>
            </View>
            
            {sale.discount > 0 && (
              <View style={styles.summaryRow}>
                <Text variant="bodyMedium">Discount ({sale.discount}%):</Text>
                <Text variant="bodyMedium">
                  -₱{((sale.grand_total - (sale.tax_amount || 0)) * sale.discount / 100).toFixed(2)}
                </Text>
              </View>
            )}
            
            {sale.tax_amount > 0 && (
              <View style={styles.summaryRow}>
                <Text variant="bodyMedium">Tax:</Text>
                <Text variant="bodyMedium">₱{sale.tax_amount.toFixed(2)}</Text>
              </View>
            )}
            
            <View style={styles.totalRow}>
              <Text variant="titleLarge" style={styles.totalText}>Total:</Text>
              <Text variant="titleLarge" style={styles.totalAmount}>
                ₱{sale.grand_total.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text variant="bodyMedium">Payment:</Text>
              <Text variant="bodyMedium">
                {(sale.payment_type || 'Cash').toUpperCase()}
              </Text>
            </View>
            
            {sale.received_amount && (
              <>
                <View style={styles.summaryRow}>
                  <Text variant="bodyMedium">Received:</Text>
                  <Text variant="bodyMedium">₱{sale.received_amount.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text variant="bodyMedium">Change:</Text>
                  <Text variant="bodyMedium">
                    ₱{(sale.received_amount - sale.grand_total).toFixed(2)}
                  </Text>
                </View>
              </>
            )}
          </View>
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="outlined"
          onPress={handlePrint}
          style={styles.actionButton}
          icon="printer"
        >
          Print
        </Button>
        
        <Button
          mode="outlined"
          onPress={handleShare}
          style={styles.actionButton}
          icon="share"
        >
          Share
        </Button>
        
        <Button
          mode="contained"
          onPress={handleNewSale}
          style={styles.actionButton}
        >
          New Sale
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
  card: {
    margin: spacing.md,
    borderRadius: borderRadius.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  receiptNumber: {
    color: colors.dark,
    marginTop: spacing.xs,
  },
  date: {
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
  customerSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.dark,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  customerDetail: {
    color: colors.gray[600],
  },
  itemsSection: {
    marginBottom: spacing.lg,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  itemInfo: {
    flex: 1,
  },
  itemDetails: {
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
  itemTotal: {
    fontWeight: 'bold',
    color: colors.dark,
  },
  divider: {
    marginVertical: spacing.md,
  },
  summarySection: {
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray[300],
  },
  totalText: {
    fontWeight: 'bold',
    color: colors.dark,
  },
  totalAmount: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});

export default ReceiptScreen;
