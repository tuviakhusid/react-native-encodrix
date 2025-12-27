import { gql } from '@apollo/client';
import * as SecureStore from 'expo-secure-store';
import { apolloClient } from '../apollo/apolloClient';

const GET_EXTRACTED_DATA = gql`
  query GetExtractedData($invoiceId: String!) {
    getExractedData(invoiceId: $invoiceId) 
  }
`;

interface ExtractedData {
    extracted_data?: {
        vendor_name?: string;
        total_amount?: string | number;
        issue_date?: string;
        [key: string]: any;
    };
    s3_url?: string;
    [key: string]: any;
}

class UploadService {
    async getExtractData(invoiceId: string): Promise<ExtractedData | null> {
        try {
            if (!invoiceId) {
                return null;
            }

            const { data } = await apolloClient.query({
                query: GET_EXTRACTED_DATA,
                variables: { invoiceId },
                fetchPolicy: 'network-only',
            });

            console.log('Extracted data:', data?.getExractedData);

            return data?.getExractedData || null;
        } catch (error) {
            console.error('Error fetching extracted data:', error);
            return null;
        }
    }

    async getFileUrl(s3Url: string): Promise<string | null> {
        try {
            const token = await SecureStore.getItemAsync('token');
            if (!token || !s3Url) {
                return null;
            }

            // Construct the file URL with token
            // This might need to be adjusted based on your API structure
            return s3Url;
        } catch (error) {
            console.error('Error getting file URL:', error);
            return null;
        }
    }
}

export default new UploadService();

