import { ApolloClient, ApolloLink, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { createUploadLink } from 'apollo-upload-client';
import * as SecureStore from 'expo-secure-store';
import authService from '../services/auth.service';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://dev.encodrix.com/graphql/';

// Network logging link to log all requests and responses
const loggingLink = new ApolloLink((operation, forward) => {
  const startTime = Date.now();
  const operationName = operation.operationName;
  const variables = operation.variables;

  // Log request
  console.log('\n========== GraphQL Request ==========');
  console.log(`Operation: ${operationName || 'Unknown'}`);
  console.log(`URL: ${API_URL}`);
  console.log(`Variables:`, JSON.stringify(variables, null, 2));
  console.log(`Query:`, operation.query.loc?.source.body || 'N/A');
  console.log('=======================================\n');

  return forward(operation).map((response) => {
    const duration = Date.now() - startTime;

    // Log response
    console.log('\n========== GraphQL Response ==========');
    console.log(`Operation: ${operationName || 'Unknown'}`);
    console.log(`Duration: ${duration}ms`);

    if (response.errors) {
      console.log('Errors:', JSON.stringify(response.errors, null, 2));
    }

    if (response.data) {
      console.log('Data:', JSON.stringify(response.data, null, 2));
    }

    console.log('=======================================\n');

    return response;
  });
});

const uploadLink = createUploadLink({
  uri: API_URL,
  // Enable logging in createUploadLink
  fetchOptions: {
    // This will help with debugging
  },
});

const authLink = setContext(async (_, { headers }) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    const authHeaders: Record<string, string> = {
      ...headers,
    };
    // Only set Authorization when we have a token (e.g. do not send it for guest upload)
    if (token) {
      authHeaders.authorization = `Bearer ${token}`;
    }

    // Log auth headers (without token value for security); when no token, header is not sent
    console.log('[Auth Link] Headers:', {
      ...authHeaders,
      ...(authHeaders.authorization ? { authorization: 'Bearer ***' } : {}),
    });

    return {
      headers: authHeaders,
    };
  } catch (error) {
    console.error('Error getting token:', error);
    return {
      headers: {
        ...headers,
      },
    };
  }
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  // Handle GraphQL errors
  if (graphQLErrors) {
    console.error('\n========== GraphQL Errors ==========');
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(`Message: ${message}`);
      console.error(`Path: ${JSON.stringify(path)}`);
      console.error(`Locations:`, JSON.stringify(locations, null, 2));
      if (extensions) {
        console.error(`Extensions:`, JSON.stringify(extensions, null, 2));

        // Check for authentication errors in extensions
        if (extensions.code === 'UNAUTHENTICATED' || extensions.code === 'FORBIDDEN') {
          console.error('Authentication error detected, logging out...');
          authService.logout().catch((err) => {
            console.error('Error during logout:', err);
          });
        }
      }
    });
    console.error('===================================\n');
  }

  // Handle network errors
  if (networkError) {
    console.error('\n========== Network Error ==========');
    console.error(`Operation: ${operation?.operationName || 'Unknown'}`);
    console.error(`Error: ${networkError.message}`);

    const statusCode = (networkError as any).statusCode;
    console.error(`Status Code:`, statusCode);

    // Auto-logout on authentication errors (401, 403)
    if (statusCode === 401 || statusCode === 403) {
      console.error('Authentication error detected (401/403), logging out...');
      authService.logout().catch((err) => {
        console.error('Error during logout:', err);
      });
    }

    if ('response' in networkError && networkError.response) {
      const response = (networkError as any).response;
      console.error(`Response Status: ${response.status}`);
      console.error(`Response Headers:`, JSON.stringify(response.headers, null, 2));

      // Auto-logout if response status is 401 or 403
      if (response.status === 401 || response.status === 403) {
        console.error('Authentication error detected in response, logging out...');
        authService.logout().catch((err) => {
          console.error('Error during logout:', err);
        });
      }

      // Try to read response body
      if (response._bodyBlob || response._bodyInit) {
        const blob = response._bodyBlob || response._bodyInit;
        if (blob && typeof blob.text === 'function') {
          blob.text()
            .then((text: string) => {
              console.error(`Response Body:`, text);
              // Try to parse as JSON if possible
              try {
                const json = JSON.parse(text);
                console.error(`Response JSON:`, JSON.stringify(json, null, 2));

                // Check for authentication errors in JSON response
                if (json.errors) {
                  const hasAuthError = json.errors.some((err: any) =>
                    err.extensions?.code === 'UNAUTHENTICATED' ||
                    err.extensions?.code === 'FORBIDDEN'
                  );
                  if (hasAuthError) {
                    console.error('Authentication error in GraphQL response, logging out...');
                    authService.logout().catch((err) => {
                      console.error('Error during logout:', err);
                    });
                  }
                }
              } catch {
                // Not JSON, already logged as text
              }
            })
            .catch((err: any) => {
              console.error(`Could not read response body:`, err);
            });
        }
      }
    }

    console.error(`Variables:`, JSON.stringify(operation?.variables, null, 2));
    console.error('===================================\n');
  }
});

export const apolloClient = new ApolloClient({
  link: from([loggingLink, errorLink, authLink, uploadLink]),
  cache: new InMemoryCache({
    typePolicies: {},
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

