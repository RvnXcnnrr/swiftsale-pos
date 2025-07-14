import React, { useState } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { Button, Card, Text, IconButton, Avatar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { colors, spacing, borderRadius } from '../constants/theme';

const ProductImagePicker = ({ imageUri, onImageSelected, onImageRemoved }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Request permissions
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      // Request camera permissions
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermission.status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to take photos.',
          [{ text: 'OK' }]
        );
        return false;
      }

      // Request media library permissions
      const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaPermission.status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Media library permission is required to select photos.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const showImagePickerOptions = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    const options = [
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose from Gallery', onPress: pickImage },
    ];

    if (imageUri) {
      options.push({ text: 'Remove Image', onPress: removeImage, style: 'destructive' });
    }

    options.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert('Select Image', 'Choose an option', options);
  };

  const takePhoto = async () => {
    try {
      setIsLoading(true);
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        onImageSelected(imageUri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      setIsLoading(true);
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        onImageSelected(imageUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => onImageRemoved && onImageRemoved()
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.label}>
        Product Image
      </Text>
      
      <Card style={styles.imageCard}>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <View style={styles.imageWrapper}>
              <Avatar.Image 
                size={120} 
                source={{ uri: imageUri }} 
                style={styles.image}
              />
              <IconButton
                icon="close-circle"
                size={24}
                iconColor={colors.danger}
                containerColor={colors.white}
                style={styles.removeButton}
                onPress={removeImage}
              />
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Avatar.Icon 
                size={120} 
                icon="image-outline" 
                style={styles.placeholder}
              />
              <Text variant="bodyMedium" style={styles.placeholderText}>
                No image selected
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            icon="camera"
            onPress={showImagePickerOptions}
            style={styles.button}
            loading={isLoading}
            disabled={isLoading}
          >
            {imageUri ? 'Change Image' : 'Add Image'}
          </Button>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.sm,
    color: colors.dark,
    fontWeight: '600',
  },
  imageCard: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    elevation: 2,
  },
  imageContainer: {
    padding: spacing.md,
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    backgroundColor: colors.gray[100],
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    elevation: 4,
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  placeholder: {
    backgroundColor: colors.gray[100],
    marginBottom: spacing.sm,
  },
  placeholderText: {
    color: colors.gray[600],
    textAlign: 'center',
  },
  buttonContainer: {
    padding: spacing.md,
    paddingTop: 0,
  },
  button: {
    borderColor: colors.primary,
  },
});

export default ProductImagePicker;
