// import React from 'react';
import { createAmplifyAuthAdapter, createStorageBrowser } from '@aws-amplify/ui-react-storage/browser';
import '@aws-amplify/ui-react-storage/styles.css';
import { Amplify } from 'aws-amplify';
import config from '../amplify_outputs.json';

// Configure Amplify using the imported configuration
Amplify.configure(config);

// Create the StorageBrowser component with Amplify authentication
// export const { StorageBrowser } = createStorageBrowser({
//   config: createAmplifyAuthAdapter(),
// });

// interface Config {
//   accountId?: string;
//   customEndpoint?: string;
//   getLocationCredentials: GetLocationCredentials;
//   listLocations: ListLocations;
//   registerAuthListener: RegisterAuthListener;
//   region: string;
// }
export const { StorageBrowser } = createStorageBrowser({
	config: {
		...createAmplifyAuthAdapter(),
		// customEndpoint: '*.vpce-0d645cb58afb1131f-2o7g1hwv.s3.us-east-1.vpce.amazonaws.com'
	}
})

// const { StorageBrowser } = createStorageBrowser({
//   actions: {
//     default: {
//       upload: {
//         ...defaultActionConfigs.upload,
//         handler: ({ config, data, options }) =>
//           defaultActionConfigs.upload.handler({
//             config,
//             data,
//             options: {
//               ...options,
//               onSuccess: (...input) => {
//                 options?.onSuccess?.(...input);
//                 fileUploadCounter.add(1); // Your custom counter metrics.
//               },
//               onError: (data, message, error) => {
//                 options?.onError?.(data, message, error);
//                 fileUploadError.recordError(error); // Your custom error metrics.
//               },
//             },
//           }),
//       }
//     }
//   }
// });