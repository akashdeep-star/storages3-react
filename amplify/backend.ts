// import { defineBackend } from '@aws-amplify/backend';
// import { auth } from './auth/resource';
// import { data } from './data/resource';
// import { storage } from './storage/resource';
// import * as s3 from 'aws-cdk-lib/aws-s3';
// // import { aws_s3 as s3 } from 'aws-cdk-lib';

// // defineBackend({
// //   auth,
// //   data,
// //   storage
// // });
// const backend = defineBackend({
//   auth,
//   data,
//   storage
// });

// const s3Bucket = backend.storage.resources.bucket;
// const cfnBucket = s3Bucket.node.defaultChild as s3.CfnBucket;


// // const encryptionConfigurationProperty: s3.CfnBucket.EncryptionConfigurationProperty = {
// //   replicaKmsKeyId: 'arn:aws:kms:eu-west-1:082449889088:key/e78b4d9c-e2e1-4e4e-bb64-73943d1601c1',
// // };

// cfnBucket.bucketEncryption = {
//   serverSideEncryptionConfiguration: [
//     {
//       serverSideEncryptionByDefault: {
//         sseAlgorithm: 'aws:kms',
//         kmsMasterKeyId:'arn:aws:kms:eu-west-1:082449889088:key/e78b4d9c-e2e1-4e4e-bb64-73943d1601c1'
//       },
//       bucketKeyEnabled: true 
//     }
//   ]
// };

// // cfnBucket.addPropertyOverride('BucketPolicy', {
// //   PolicyDocument: {
// //     Version: "2012-10-17",
// //     Statement: [
// //       {
// //         Sid: "EnforceEncryption",
// //         Effect: "Deny",
// //         Principal: "*",
// //         Action: "s3:PutObject",
// //         Resource: `${s3Bucket.bucketArn}/*`,
// //         Condition: {
// //           StringNotEquals: {
// //             "s3:x-amz-server-side-encryption": "aws:kms"
// //           }
// //         }
// //       }
// //     ]
// //   }
// // });


import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { storage } from './storage/resource';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Stack, CfnOutput, Fn } from 'aws-cdk-lib';

const backend = defineBackend({
  auth,
  storage
});

// Get the storage bucket
const s3Bucket = backend.storage.resources.bucket;

// Get the stack from the backend
const stack = Stack.of(s3Bucket);

// Create a KMS key for S3 encryption
const kmsKey = new kms.Key(stack, 'S3BucketKey', {
  enableKeyRotation: true,
  description: 'KMS key for S3 bucket encryption',
  alias: 'alias/s3-bucket-key'
});

// Create VPC
const vpc = new ec2.Vpc(stack, 'MyVPC', {
  maxAzs: 2,
  subnetConfiguration: [
    {
      cidrMask: 24,
      name: 'Private',
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    }
  ]
});

// First, create the S3 Gateway Endpoint (required)
const s3GatewayEndpoint = vpc.addGatewayEndpoint('S3GatewayEndpoint', {
  service: ec2.GatewayVpcEndpointAwsService.S3
});

// Then, create the S3 Interface Endpoint
const s3InterfaceEndpoint = new ec2.CfnVPCEndpoint(stack, 'S3InterfaceEndpoint', {
  vpcId: vpc.vpcId,
  serviceName: `com.amazonaws.${stack.region}.s3`,
  vpcEndpointType: 'Interface',
  privateDnsEnabled: true,
  subnetIds: vpc.selectSubnets({
    subnetType: ec2.SubnetType.PRIVATE_ISOLATED
  }).subnetIds
});

// Add DNS Options after creation using addPropertyOverride
s3InterfaceEndpoint.addPropertyOverride('DnsOptions', {
  DnsRecordIpType: "ipv4",
  PrivateDnsOnlyForInboundResolverEndpoint: "AllResolvers"
});

// Ensure the Gateway endpoint is created first
s3InterfaceEndpoint.addDependsOn(s3GatewayEndpoint.node.defaultChild as ec2.CfnVPCEndpoint);

// Get the L1 construct for the bucket
const cfnBucket = s3Bucket.node.defaultChild as s3.CfnBucket;

// Configure KMS encryption for the bucket
cfnBucket.bucketEncryption = {
  serverSideEncryptionConfiguration: [
    {
      serverSideEncryptionByDefault: {
        sseAlgorithm: 'aws:kms',
        kmsMasterKeyId: kmsKey.keyArn
      },
      bucketKeyEnabled: true
    }
  ]
};

// Create outputs using Fn.select for DNS entries
new CfnOutput(stack, 'S3InterfaceEndpointDNS', {
  value: Fn.select(0, s3InterfaceEndpoint.attrDnsEntries),
  description: 'S3 Interface Endpoint DNS'
});

new CfnOutput(stack, 'S3BucketName', {
  value: s3Bucket.bucketName,
  description: 'S3 Bucket Name'
});

new CfnOutput(stack, 'S3BucketRegion', {
  value: stack.region,
  description: 'S3 Bucket Region'
});

// Export the endpoints and KMS key ARN for reference
export const gatewayEndpointId = s3GatewayEndpoint.vpcEndpointId;
export const interfaceEndpointId = s3InterfaceEndpoint.ref;
export const kmsKeyArn = kmsKey.keyArn;
export const bucketName = s3Bucket.bucketName;
export const region = stack.region;