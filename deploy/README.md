# Déploiement Frontend (VPS + Nginx)

## 1. Sur le VPS
```bash
git clone git@github.com:Vignemanuelh/lexfront.git /opt/lexfront
cd /opt/lexfront
cp deploy/images.env.example .images.env
```

## 2. Nginx + Certbot
```bash
sudo cp deploy/nginx/lexbenin-front.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/lexbenin-front.conf /etc/nginx/sites-enabled/
sudo mkdir -p /var/www/certbot
sudo certbot certonly --webroot -w /var/www/certbot -d lexbenin.emmanuelhoudji.com
sudo nginx -t && sudo systemctl reload nginx
```

## 3. Lancement & CI/CD
```bash
docker compose -f docker-compose.prod.yml up -d
```
Un tag `vX.Y.Z` poussé sur `main` déclenche `release.yml` → build GHCR → SSH vers `/opt/lexfront/deploy/scripts/deploy.sh <tag>` (qui fait `git pull`, tire l'image et redémarre `lexfront` avec rollback automatique).
