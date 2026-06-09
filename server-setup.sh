#!/bin/bash
set -e

echo "=== 1. 清理损坏的 Nginx 配置 ==="
rm -f /etc/nginx/sites-enabled/ai-profile
rm -f /etc/nginx/sites-enabled/default

echo "=== 2. 写入 Nginx 配置（端口 8035） ==="
cat > /etc/nginx/sites-available/ai-profile << 'EOF'
server {
    listen 8035;
    server_name _;

    location / {
        proxy_pass http://localhost:3035;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        proxy_pass http://localhost:3035;
        expires 1M;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/javascript application/json;
}
EOF

echo "=== 3. 启用配置 ==="
ln -sf /etc/nginx/sites-available/ai-profile /etc/nginx/sites-enabled/ai-profile
nginx -t
systemctl restart nginx
systemctl enable nginx

echo "=== 4. 防火墙放行 8035 端口 ==="
ufw allow 8035/tcp || true

echo "=== 5. 安全组放行提示 ==="
echo "请在火山云控制台 → 安全组 → 添加入站规则："
echo "  协议：TCP"
echo "  端口：8035"
echo "  来源：0.0.0.0/0"

echo "=== 完成 ==="
echo "Nginx 已配置为监听 8035 端口，反向代理到 localhost:3035"
echo "访问地址：http://服务器IP:8035"
