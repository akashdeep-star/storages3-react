import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      saml: {
        name: 'IAMIdC',
        metadata: {
          metadataContent: 'https://portal.sso.us-east-1.amazonaws.com/saml/metadata/NTcxNDA1MzMxMzU2X2lucy1iNmRhOGY3MThkZDBkYWVh', 
          metadataType: 'URL', // or 'FILE'
        },
        attributeMapping: {
          email: 'email'
        }
      },
      logoutUrls: ['http://localhost:5173/', 'https://main.d7avcxipkzn8r.amplifyapp.com/'],
      callbackUrls: [
        'http://localhost:5173/', 'https://main.d7avcxipkzn8r.amplifyapp.com/'
      ],
    },
  },
});
