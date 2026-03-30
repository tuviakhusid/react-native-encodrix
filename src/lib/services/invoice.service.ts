import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { Alert, Linking } from 'react-native';

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
   * Uses the new v2 endpoint with file_id and token as query parameters
   */
  async getStreamLine(file_id: string): Promise<Blob> {
    try {
      if (!file_id) {
        throw new Error('File ID is required');
      }

      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        throw new Error('Authentication token is required');
      }

      const api = await createApiInstance();
      const response = await api.get('/stream_file_v2/', {
        params: {
          file_id,
          token,
        },
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
   * Uses the new v2 endpoint with file_id and token as query parameters
   */
  async getStreamingUrl(file_id: string): Promise<string | null> {
    try {
      if (!file_id) {
        return null;
      }

      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        return null;
      }

      // Construct streaming URL with authentication using new v2 endpoint
      const streamingUrl = `${API_URL}/folders/stream_file_v2/?file_id=${encodeURIComponent(file_id)}&token=${encodeURIComponent(token)}`;
      return streamingUrl;
    } catch (error) {
      console.error('Error getting streaming URL:', error);
      return null;
    }
  }

  /**
   * Preview document by opening it in browser or external app
   * Uses expo-web-browser for better control and authentication handling
   * Now uses file_id instead of s3Url
   */
  async previewDocument(file_id: string): Promise<void> {
    try {
      if (!file_id) {
        Alert.alert('Error', 'File ID is required');
        return;
      }

      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        Alert.alert('Error', 'Authentication required. Please login again.');
        return;
      }

      // Get streaming URL with authentication using new v2 endpoint
      const streamingUrl = await this.getStreamingUrl(file_id);

      if (!streamingUrl) {
        Alert.alert('Error', 'Unable to generate file URL. Please check your authentication.');
        return;
      }

      // Use expo-web-browser for better document preview
      // Token is now included in the URL as a query parameter

      try {
        await WebBrowser.openBrowserAsync(streamingUrl, {
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
   * Now uses file_id instead of s3Url
   */
  async getFileUrl(file_id: string): Promise<string | null> {
    return this.getStreamingUrl(file_id);
  }
}

export default new InvoiceService();

