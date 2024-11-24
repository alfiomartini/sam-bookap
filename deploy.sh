#!/bin/bash

# Fetch the AWS region from the AWS CLI configuration
AWS_REGION=us-east-1

# Deploy the SAM stack
sam deploy \
  --template-file .aws-sam/build/template.yaml \
  --stack-name sam-bookapp \
  --s3-bucket sam-bookapp-bucket \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides AwsRegion=$AWS_REGION
  