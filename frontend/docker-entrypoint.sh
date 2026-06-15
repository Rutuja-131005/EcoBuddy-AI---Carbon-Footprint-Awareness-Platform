#!/bin/sh
# Start nginx with PORT environment variable support

# Get port from environment, default to 8080 for Cloud Run
PORT=${PORT:-8080}

# Create the nginx config with the correct port
cat > /etc/nginx/conf.d/default.conf <<EOF
server {
  listen $PORT;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files \$uri \$uri/ /index.html;
  }
}
EOF

# Start nginx in foreground
nginx -g "daemon off;"
