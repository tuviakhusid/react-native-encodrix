import 'dotenv/config';
import type { CodegenConfig } from '@graphql-codegen/cli';

const schemaUrl =
  process.env.CODEGEN_SCHEMA_URL ||
  process.env.EXPO_PUBLIC_API_URL ||
  'https://dev.encodrix.com/graphql/';

const authToken = process.env.CODEGEN_AUTH_TOKEN;

const schemaConfig = authToken
  ? {
      [schemaUrl]: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    }
  : schemaUrl;

const config: CodegenConfig = {
  schema: schemaConfig,
  documents: ['src/**/*.graphql'],
  generates: {
    './src/graphql/schema.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
      },
    },
  },
};

export default config;
