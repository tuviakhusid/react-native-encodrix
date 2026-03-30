import { SearchXeroAccountsDocument } from '../../graphql/schema';
import { apolloClient } from '../apollo/apolloClient';

interface XeroAccount {
  _id?: string;
  account_id?: string;
  id?: string;
  account_class?: string;
  class?: string;
  account_type?: string;
  type?: string;
  code?: string;
  name?: string;
  description?: string;
  status?: string;
  currency_code?: string;
  tax_type?: string;
}

interface SearchAccountsResponse {
  results?: string | XeroAccount[];
}

class FinanceIntegrationService {
  async searchAccounts(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<XeroAccount[]> {
    try {
      if (!query || query.trim().length < 2) {
        return [];
      }

      const { data, errors } = await apolloClient.query({
        query: SearchXeroAccountsDocument,
        variables: {
          query: query.trim() || undefined,
          page: page || undefined,
          pageSize: limit || undefined,
        },
        fetchPolicy: 'network-only',
      });

      if (errors) {
        console.error('Error searching accounts:', errors);
        return [];
      }

      const response: any = data?.getAllXeroAccounts || {};
      let resultsArray: XeroAccount[] = [];

      // Handle PaginatedAccounts structure: getAllXeroAccounts.results
      if (response?.results) {
        if (typeof response.results === 'string') {
          try {
            const parsed = JSON.parse(response.results);
            resultsArray = Array.isArray(parsed) ? parsed : [];
          } catch (parseError) {
            console.error('Error parsing results JSON:', parseError);
            resultsArray = [];
          }
        } else if (Array.isArray(response.results)) {
          resultsArray = response.results;
        }
      }

      // Normalize account structure
      return resultsArray.map((account: any) => ({
        _id: account._id || account.id,
        account_id: account.account_id || account.id,
        account_class: account.account_class || account.class,
        account_type: account.account_type || account.type,
        code: account.code,
        name: account.name,
        description: account.description || '',
        status: account.status || 'ACTIVE',
        currency_code: account.currency_code || 'AUD',
        tax_type: account.tax_type || 'NONE',
      }));
    } catch (error) {
      console.error('Error searching accounts:', error);
      return [];
    }
  }
}

export default new FinanceIntegrationService();

