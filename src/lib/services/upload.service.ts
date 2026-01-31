import { gql } from '@apollo/client';
import * as SecureStore from 'expo-secure-store';
import { apolloClient } from '../apollo/apolloClient';

const GET_EXTRACTED_DATA = gql`
  query GetExtractedData($invoiceId: String!) {
    getExractedData(invoiceId: $invoiceId) 
  }
`;

const PROCESS_STAGE_ACTION = gql`
  mutation ProcessStageAction(
    $instanceId: String!
    $action: String!
    $comments: String
  ) {
    processStageAction(
      instanceId: $instanceId
      action: $action
      comments: $comments
    ) {
      ok
      action
      completed
      rejected
      resumed
      nextStage {
        name
        order
        assignedTo
        dueDays
      }
      workflowStatus
      documentStatus
      error
      googleDriveResult
    }
  }
`;

interface ProcessStageActionResult {
  ok: boolean;
  action: string;
  completed?: boolean | null;
  rejected?: boolean | null;
  resumed?: boolean | null;
  nextStage?: {
    name: string;
    order: number;
    assignedTo?: string | null;
    dueDays?: number | null;
  } | null;
  workflowStatus?: string | null;
  documentStatus?: string | null;
  error?: string | null;
  googleDriveResult?: string | null;
}

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
                mutation: PROCESS_STAGE_ACTION,
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

