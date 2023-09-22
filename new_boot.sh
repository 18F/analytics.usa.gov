#!/bin/sh
set -ex

if [ -n "${S3_BUCKET_URL}" ]; then
  sed '/# this is to allow /data/ to pass through untouched/ r /app/nginx_snips/if_S3_BUCKET_URL.txt)' /app/nginx/conf/nginx.conf 
fi

if [ -f "$APP_ROOT/nginx/conf/.enable_directory_index" ]; then
  sed '/index index.html index.htm Default.htm;/ r /app/nginx_snips/if_edi.txt' /app/nginx/conf/nginx.conf
fi 

if [ -f "$APP_ROOT/nginx/conf/.htpasswd" ]; then
  sed '/index index.html index.htm Default.htm;/ r /app/nginx_snips/if_htpasswd.txt' /app/nginx/conf/nginx.conf
fi

if [ -n "${FORCE_HTTPS}" ]; then
  sed '/# this is to allow /data/ to pass through untouched/ r /app/nginx_snips/if_force_https.txt)' /app/nginx/conf/nginx.conf 
fi

$APP_ROOT/start_logging.sh
nginx -p $APP_ROOT/nginx -c $APP_ROOT/nginx/conf/nginx.conf
