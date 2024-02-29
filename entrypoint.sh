#!/bin/sh
cat nginx.conf
nginx -p $PWD -c nginx.conf
