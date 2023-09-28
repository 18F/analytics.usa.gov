#!/bin/sh
export BUCKET_NAME=$(echo ${VCAP_SERVICES} | jq -r '.s3[0].credentials.bucket')
export S3_ENDPOINT=$(echo ${VCAP_SERVICES} | jq -r '.s3[0].credentials.endpoint')
nginx -p $PWD -c nginx.conf
