import * as SecureStore from 'expo-secure-store';
import {
  GetExtractedDataDocument,
  ProcessStageActionDocument,
  type GetExtractedDataQuery,
  type ProcessStageActionMutation,
} from '../../graphql/schema';
import { apolloClient } from '../apollo/apolloClient';

type ProcessStageActionResult = NonNullable<
  ProcessStageActionMutation['processStageAction']
>;

type ExtractedData = GetExtractedDataQuery['getExractedData'];

class UploadService {
    async getExtractData(invoiceId: string): Promise<ExtractedData | null> {
        try {
            if (!invoiceId) {
                return null;
            }

            const { data } = await apolloClient.query({
                query: GetExtractedDataDocument,
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

    async processStageAction(
        instanceId: string,
        action: string,
        comments?: string
    ): Promise<ProcessStageActionResult | null> {
        try {
            if (!instanceId || !action) {
                console.error('Missing required parameters for processStageAction');
                return null;
            }

            const { data, errors } = await apolloClient.mutate({
                mutation: ProcessStageActionDocument,
                variables: {
                    instanceId,
                    action,
                    comments,
                },
            });

            if (errors) {
                console.error('Error processing stage action:', errors);
                throw new Error(errors[0]?.message || 'Mutation failed');
            }

            return data?.processStageAction ?? null;
        } catch (error) {
            console.error('Error processing stage action:', error);
            throw error;
        }
    }
}

export default new UploadService();

