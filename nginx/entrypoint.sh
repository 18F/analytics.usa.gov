#!/bin/sh

mv /home/vcap/app/testing.conf /home/vcap/app/nginx/conf.f/default.conf

nginx -p $PWD -c /home/vcap/app/nginx/conf.d/default.conf
