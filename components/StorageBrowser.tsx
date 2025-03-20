// import React from 'react';
import { createAmplifyAuthAdapter, createStorageBrowser } from '@aws-amplify/ui-react-storage/browser';
import '@aws-amplify/ui-react-storage/styles.css';
import { Amplify } from 'aws-amplify';
import config from '../amplify_outputs.json';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fetchAuthSession } from "aws-amplify/auth";
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
// export const { StorageBrowser } = createStorageBrowser({
// 	config: {
// 		...createAmplifyAuthAdapter(),
// 		// customEndpoint: 'vpce-0d645cb58afb1131f-2o7g1hwv.s3.us-east-1.vpce.amazonaws.com'
// 	}
// })
export const { StorageBrowser } = createStorageBrowser({
    actions: {
      default: {
        upload: {
          handler: (input) => {
            const { data } = input;

            return {
              result: (async () => {
                const { credentials } = await fetchAuthSession();
                const s3Client = new S3Client({
                  credentials: credentials,
                  region: "eu-west-1",
                });
                const command = new PutObjectCommand({
                  Bucket:
                    "amplify-d7avcxipkzn8r-main-bran-mys3bucketad696188-2vjhwylmajav",
                  Key: data.key,
                  Body: data.file,
                  ServerSideEncryption: "aws:kms",
                  SSEKMSKeyId: "e78b4d9c-e2e1-4e4e-bb64-73943d1601c1",
                });

                try {
                  const response = await s3Client.send(command);
                  console.log("Upload success:", response);
                  return {
                    status: "COMPLETE" as const,
                    value: { key: data.key },
                  };
                } catch (error) {
                  console.error("Upload error:", error);
                  return {
                    status: "FAILED" as const,
                    message:
                      error instanceof Error ? error.message : "Upload failed",
                  };
                }
              })(),
              cancel: async () => ({
                status: "CANCELED" as const,
                message: "Upload canceled",
              }),
            };
          },
          viewName: "UploadView",
          actionListItem: {
            label: "Upload File",
            icon: "upload",
            onClick: () => {
              console.log("Upload action clicked");
            },
            description: "Upload files with server-side encryption",
            disabled: false,
            hidden: false,
            // Optional: Additional styling
            style: {
              backgroundColor: "#f0f0f0",
              color: "#333",
              padding: "8px",
              borderRadius: "4px",
              margin: "4px 0",
            },
            // Optional: Custom class names
            className: "custom-upload-action",
            // Optional: Keyboard shortcuts
            keyboardShortcut: "ctrl+u",
            // Optional: Custom attributes
            attributes: {
              "data-testid": "upload-action-button",
              "aria-label": "Upload file with encryption",
            },
          },
        },
      },
    },
    config: {
      ...createAmplifyAuthAdapter(),
    },
  });
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