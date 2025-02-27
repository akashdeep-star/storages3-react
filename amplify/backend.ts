import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import * as s3 from 'aws-cdk-lib/aws-s3';
// import { aws_s3 as s3 } from 'aws-cdk-lib';

// defineBackend({
//   auth,
//   data,
//   storage
// });
const backend = defineBackend({
  auth,
  data,
  storage
});

const s3Bucket = backend.storage.resources.bucket;


const cfnBucket = s3Bucket.node.defaultChild as s3.CfnBucket;


const encryptionConfigurationProperty: s3.CfnBucket.EncryptionConfigurationProperty = {
  replicaKmsKeyId: 'arn:aws:kms:eu-west-1:082449889088:key/e78b4d9c-e2e1-4e4e-bb64-73943d1601c1',
};