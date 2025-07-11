# Auto-Save Form Data Implementation

This implementation provides automatic saving and restoration of form data when users refresh the page or navigate away and come back.

## 🚀 Features

- **Automatic Saving**: Form data is automatically saved to localStorage as users type
- **Debounced Saving**: Prevents excessive localStorage writes with configurable debounce timing
- **Smart Restoration**: Shows notification when saved data is available
- **Data Validation**: Only saves meaningful data (non-empty fields)
- **Form-Specific**: Each form has its own storage key to prevent conflicts
- **Easy Integration**: Simple hook-based implementation

## 📁 Files Created

1. `shared/hooks/useAutoSave.js` - Main auto-save hook
2. `shared/components/AutoSaveNotification.js` - Notification component
3. `shared/components/AutoSaveInput.js` - Auto-save enabled input components

## 🔧 Usage

### Basic Implementation

```javascript
import useAutoSave from '../../shared/hooks/useAutoSave';
import AutoSaveNotification from '../../shared/components/AutoSaveNotification';
import { AutoSaveInput } from '../../shared/components/AutoSaveInput';

const MyForm = () => {
    // Initial form data
    const initialData = {
        name: '',
        email: '',
        phone: ''
    };

    // Auto-save hook
    const { 
        formData, 
        setFormData, 
        clearSavedData, 
        hasSavedData 
    } = useAutoSave('my_form_key', initialData, 1000);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit form data
        submitForm(formData);
        // Clear saved data after successful submission
        clearSavedData();
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Auto-save notification */}
            <AutoSaveNotification
                hasSavedData={hasSavedData}
                onRestore={() => {}} // Data already restored by hook
                onDiscard={clearSavedData}
                formName="contact form"
            />

            {/* Form fields */}
            <AutoSaveInput
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter name"
            />

            <AutoSaveInput
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
            />

            <button type="submit">Submit</button>
        </form>
    );
};
```

### Advanced Configuration

```javascript
// Custom debounce timing (default: 1000ms)
const { formData, setFormData } = useAutoSave('form_key', initialData, 2000);

// Form-specific keys for different contexts
const formKey = id ? `product_edit_${id}` : 'product_create';
const { formData, setFormData } = useAutoSave(formKey, initialData);
```

## 🎯 Integration Examples

### Product Form (Already Implemented)
- Auto-saves product name, code, and other fields
- Shows notification for new products only
- Clears data after successful submission

### Customer Form (Partially Implemented)
- Ready for auto-save integration
- Import statements added

### Sales Form
- Can be easily integrated following the same pattern

## 🔧 Hook Parameters

### `useAutoSave(formKey, initialData, debounceMs)`

- **formKey** (string): Unique identifier for the form
- **initialData** (object): Default form data structure
- **debounceMs** (number): Debounce delay in milliseconds (default: 1000)

### Returns

- **formData**: Current form data state
- **setFormData**: Function to update form data
- **clearSavedData**: Function to clear saved data
- **hasSavedData**: Boolean indicating if saved data exists

## 🎨 Notification Component

### `AutoSaveNotification` Props

- **hasSavedData** (boolean): Whether saved data exists
- **onRestore** (function): Called when user clicks "Restore Data"
- **onDiscard** (function): Called when user clicks "Start Fresh"
- **formName** (string): Display name for the form

## 📝 Input Components

### Available Components

- **AutoSaveInput**: Standard text input
- **AutoSaveTextarea**: Multi-line text input
- **AutoSaveSelect**: Dropdown select

### Props

All standard HTML input props are supported, plus:
- **name**: Input name (required)
- **value**: Input value (required)
- **onChange**: Change handler (required)

## 🔄 Data Flow

1. User types in form field
2. `onChange` handler updates form state
3. `useAutoSave` hook detects state change
4. After debounce delay, data is saved to localStorage
5. On page refresh/reload:
   - Hook loads saved data automatically
   - Notification appears if saved data exists
   - User can choose to restore or discard

## 🧹 Cleanup

- Data is automatically cleared after successful form submission
- Users can manually discard saved data via notification
- Empty forms don't create localStorage entries

## 🔧 Customization

### Custom Storage Key Format
```javascript
const formKey = `${formType}_${userId}_${timestamp}`;
```

### Custom Validation
```javascript
const hasData = Object.values(data).some(value => {
    // Custom validation logic
    return value && value.toString().trim() !== '';
});
```

### Custom Debounce Timing
```javascript
// Faster for simple forms
useAutoSave('form_key', initialData, 500);

// Slower for complex forms
useAutoSave('form_key', initialData, 2000);
```

## 🚀 Next Steps

1. **Add to More Forms**: Integrate with remaining forms (Sales, Purchase, etc.)
2. **Enhanced Notifications**: Add progress indicators or save status
3. **Data Encryption**: Encrypt sensitive form data in localStorage
4. **Sync Across Tabs**: Use BroadcastChannel for multi-tab sync
5. **Server Backup**: Optional server-side auto-save for critical forms

## 🐛 Troubleshooting

### Data Not Saving
- Check browser localStorage quota
- Verify unique form keys
- Check console for errors

### Performance Issues
- Increase debounce timing
- Reduce data being saved
- Check for memory leaks

### Data Not Restoring
- Verify form key consistency
- Check localStorage permissions
- Ensure proper component mounting
