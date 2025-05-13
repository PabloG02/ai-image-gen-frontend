#!/bin/sh

# Replace environment variables in the JavaScript files
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|API_URL_PLACEHOLDER|${API_URL}|g" {} \;

# Start nginx
nginx -g "daemon off;"
