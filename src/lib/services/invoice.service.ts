import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { Linking, Platform, Alert } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://dev.encodrix.com/api';

// Create API instance with token injection
const createApiInstance = async () => {
  const token = await SecureStore.getItemAsync('token');
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

class InvoiceService {
  /**
   * Stream file from server and return as blob
   * Similar to web app's getStreamLine method
   */
  async getStreamLine(file_url: string): Promise<Blob> {
    try {
      const api = await createApiInstance();
      const response = await api.get('/folders/stream_file/', {
        params: { file_url },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error streaming file:', error);
      throw error;
    }
  }

  /**
   * Get streaming URL for document preview
   * Returns a URL that can be used to stream and view the document
   */
  async getStreamingUrl(s3Url: string): Promise<string | null> {
    try {
      if (!s3Url) {
        return null;
      }

      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        return null;
      }

      // Construct streaming URL with authentication
      const streamingUrl = `${API_URL}/folders/stream_file/?file_url=${encodeURIComponent(s3Url)}`;
      return streamingUrl;
    } catch (error) {
      console.error('Error getting streaming URL:', error);
      return null;
    }
  }

  /**
   * Preview document by opening it in browser or external app
   * Uses expo-web-browser for better control and authentication handling
   */
  async previewDocument(s3Url: string): Promise<void> {
    try {
      if (!s3Url) {
        Alert.alert('Error', 'File URL is required');
        return;
      }

      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        Alert.alert('Error', 'Authentication required. Please login again.');
        return;
      }

      // Get streaming URL with authentication
      const streamingUrl = await this.getStreamingUrl(s3Url);
      
      if (!streamingUrl) {
        Alert.alert('Error', 'Unable to generate file URL. Please check your authentication.');
        return;
      }

      // Use expo-web-browser for better document preview
      // It can handle PDFs, images, and other document types
      // Note: The API endpoint needs to accept the Authorization header
      // If the endpoint doesn't support headers in browser requests,
      // we may need to pass token as query parameter or use a different approach
      
      try {
        await WebBrowser.openBrowserAsync(streamingUrl, {
          // Add authentication headers if supported
          // Note: WebBrowser may not support custom headers directly
          // The backend should accept token via query parameter or cookie
          enableBarCollapsing: false,
          showInRecents: true,
        });
      } catch (browserError) {
        // Fallback to Linking if WebBrowser fails
        console.log('WebBrowser failed, trying Linking:', browserError);
        const canOpen = await Linking.canOpenURL(streamingUrl);
        if (canOpen) {
          await Linking.openURL(streamingUrl);
        } else {
          Alert.alert(
            'Preview Unavailable',
            'Unable to open document. The file may need to be downloaded first.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.error('Error previewing document:', error);
      Alert.alert('Error', 'Failed to preview document. Please try again.');
    }
  }

  /**
   * Get file URL for direct access (if supported)
   */
  async getFileUrl(s3Url: string): Promise<string | null> {
    return this.getStreamingUrl(s3Url);
  }
}

export default new InvoiceService();

