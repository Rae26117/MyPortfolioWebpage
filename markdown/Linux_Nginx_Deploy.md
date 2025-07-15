## 目標

- 於本地端 Ubuntu 環境下，使用 Nginx 部署靜態與動態網頁。

## 認識 Nginx

- Nginx（Engine-X）是一個高效能、開源的 Web Server，同時也可作為：
  - 反向代理伺服器（Reverse Proxy）
  - 負載平衡器（Load Balancer）
  - HTTP 快取（Caching Proxy）
  - Mail 代理伺服器
- ### 基本架構
  ```arduino
   Client → Nginx → [Static files 或 Proxy 到後端伺服器（如 PHP-FPM / Node.js / FastAPI）]
  ```
- ### 常見檔案與目錄結構
  - | 位置                          | 說明                                 |
    | ----------------------------- | ------------------------------------ |
    | `/etc/nginx/nginx.conf`       | 主設定檔                             |
    | `/etc/nginx/sites-available/` | 虛擬主機設定檔                       |
    | `/etc/nginx/sites-enabled/`   | 啟用的虛擬主機設定（通常為符號連結） |
    | `/var/www/html/`              | 預設網站根目錄                       |
    | `/var/log/nginx/`             | 存放存取與錯誤日誌                   |
- ### 為什麼要使用 Nginx ?
  - #### 1. 高效能與低資源消耗
    Nginx 採用事件驅動（event-driven）架構，能夠處理大量並發連線而不需要為每個請求建立一個新的執行緒或程序。這讓它在高併發環境下比傳統伺服器（如 Apache）更有效率，同時佔用較少的記憶體與 CPU。
  - #### 2. 適合反向代理與負載平衡
    Nginx 原生支援反向代理（Reverse Proxy）與負載平衡，可以將流量轉發到後端伺服器群組，實現應用層級的負載分擔，提升整體服務可用性與擴展性。
  - #### 3. 快速處理靜態內容
    對於靜態檔案（如 HTML、CSS、JavaScript、圖片），Nginx 的回應速度非常快，適合部署在 CDN 前端或網站前端作為第一層處理器。
  - #### 4. 穩定性高
    即使在高流量情況下，Nginx 仍然能穩定運行，不容易因為某個請求阻塞而導致整體服務停擺，這對於 24 小時不間斷服務非常重要。
  - #### 5. 支援熱重載與不中斷服務更新
    Nginx 的設定檔可在不中斷服務的情況下重新載入，透過 `nginx -t` 測試設定後用 `reload` 就能套用變更，不影響現有連線。
  - #### 6. 可整合多種應用架構
    Nginx 可以與後端的 Node.js、Flask、FastAPI、PHP 等框架搭配，作為前端入口點，負責處理請求、轉發與安全控制。這種模式非常適合微服務架構。
  - #### 7. 安全性強
    Nginx 支援多種安全設定，包括 HTTPS（SSL/TLS）、HTTP headers 控管、防止請求偽造（CSRF）、限制請求速率（Rate Limiting）等，有助於保護網站與 API。
  - #### 8. 設定彈性與可擴充性高
    透過 location、rewrite、正則表達式等機制，Nginx 的設定非常靈活，能根據不同需求建立複雜的路由邏輯與流量控制規則。
    總結來說，Nginx 適合用於高效能、可擴展的現代 Web 架構，能提升應用的穩定性、速度與安全性，因此成為眾多企業與開發者的首選 Web 伺服器。
- ## 安裝 Nginx (Ubuntu)
  ```bash
  sudo apt update
  sudo apt install nginx
  ```
- ## 啟用與檢查

  ```bash
  # 啟動 Nginx
  sudo systemctl start nginx

  # 檢查狀態
  sudo systemctl status nginx

  # 測試配置是否正確
  sudo nginx -t

  # 重啟 Nginx（修改設定後必做）
  sudo systemctl reload nginx
  ```

  - ![image.png](./img/image_1752097839132_0.png)
  - ![image.png](./img/image_1752097714428_0.png)

- ## 基本設定說明

  - `/etc/nginx/nginx.conf`

    - ```nginx
      server {
          listen 80;
          server_name example.com;

          root /var/www/html;
          index index.html;

          location / {
              try_files $uri $uri/ =404;
          }
      }
      ```

      - `listen`：監聽的 port
      - `server_name`：對應的網域名稱
      - `root`：網站根目錄
      - `location`：路由匹配規則

  - ### 反向代理
    - 將請求轉送到後端應用（例如：Flask、FastAPI）
    - ```nginx
      location /api/ {
          proxy_pass http://127.0.0.1:8000/;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
      }
      ```
  - ### 靜態資源與快取範例
    - ```nginx
      location ~* \.(jpg|jpeg|png|gif|css|js)$ {
          expires 30d;
          access_log off;
      }
      ```
  - ### 簡單的負載平衡設定

    - ```nginx
      upstream backend {
          server 127.0.0.1:8001;
          server 127.0.0.1:8002;
      }

      server {
          listen 80;
          location / {
              proxy_pass http://backend;
          }
      }
      ```

  - ### SSL HTTPS 設定（搭配 Let's Encryp ）

    - ```nginx
       server {
          listen 443 ssl;
          server_name example.com;

          ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
          ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

          location / {
              proxy_pass http://127.0.0.1:8000;
          }
      }
      ```

- ## 部署靜態網頁

  - 假設部署一個簡單的 HTML 網站：
  - ```bash
    sudo mkdir -p /var/www/mywebsite
    sudo vim /var/www/mywebsite/index.html
    ```
  - 範例內容：
    - ```html
      <!DOCTYPE html>
      <html>
        <head>
          <title>My Static Website</title>
        </head>
        <body>
          <h1>Hello from Nginx!</h1>
        </body>
      </html>
      ```
  - 設定目錄權限（使用 `www-data` 是為了與 Nginx 配合）：
  - ```bash
    sudo chown -R www-data:www-data /var/www/mywebsite
    ```
  - 在 `/etc/nginx/sites-available` 新建一個設定檔，例如 `mywebsite`：
  - ```bash
    sudo vim /etc/nginx/sites-available/mywebsite
    ```
  - 加入以下內容（請將 `yourdomain.com` 替換為你的網域名稱）：

    - ```nginx
      server {
          listen 80;
          server_name yourdomain.com www.yourdomain.com;

          root /var/www/mywebsite;
          index index.html;

          location / {
              try_files $uri $uri/ =404;
          }
      }
      ```

  - 如你目前還沒有網域，也可以改用伺服器的 IP 測試

    - ```nginx
      server {
          listen 8080;
          server_name _;

          root /var/www/mywebsite;
          index index.html;

          location / {
              try_files $uri $uri/ =404;
          }
      }
      ```

  - 啟用該站點：
  - ```bash
    sudo ln -s /etc/nginx/sites-available/mywebsite /etc/nginx/sites-enabled/
    ```
  - 測試設定語法是否正確：
  - ```bash
    sudo nginx -t
    ```
  - 重新載入 Nginx：
  - ```bash
    sudo systemctl reload nginx
    ```
  - 成功連接：
    ![image.png](./img/image_1752103140828_0.png)
  - ![image.png](./img/image_1752102868287_0.png)

- ## 部署 LNMP 架構的動態網站

  - LNMP 是什麼意思？
    - **L**：Linux（作業系統）
    - **N**：Nginx（Web 伺服器）
    - **M**：MySQL / MariaDB（資料庫）
    - **P**：PHP（後端程式語言）
  - ### 安裝 Nginx、MySQL、PHP
  - ```bash
    # 更新套件清單
    sudo apt update

    # 安裝 Nginx
    sudo apt install nginx -y

    # 安裝 MySQL（或 MariaDB）
    sudo apt install mysql-server -y

    # 安裝 PHP 與 Nginx 整合模組
    sudo apt install php-fpm php-mysql -y
    ```

  - 資料庫基本設定（MySQL）:
  - ```bash
    # 啟動 mysql 安全性設定精靈
    sudo mysql_secure_installation
    ```
    - 接著設定 root 密碼、移除匿名用戶、禁用遠端 root 登入、刪除 test 資料庫。
  - 登入 MySQL 建立一個測試資料庫與使用者：
  - ```bash
    sudo mysql -u root -p
    ```
  - 在 MySQL shell 中執行：
  - ```sql
    CREATE DATABASE testdb;
    CREATE USER 'admin'@'%' IDENTIFIED BY 'cxcxc+123456';
    GRANT ALL PRIVILEGES ON testdb.* TO 'admin'@'%';
    FLUSH PRIVILEGES;
    EXIT;
    ```
  - PHP 基礎配置：
    - 確認 PHP_FPM 正常執行：
    - ```bash
      sudo systemctl status php8.3-fpm  # 或根據實際版本
      ```
  - ### 設定 Nginx 虛擬主機支援 PHP

    - 建立網站根目錄：
    - ```bash
      sudo mkdir -p /var/www/lnmp-site
      sudo vim /var/www/lnmp-site/index.php
      ```
    - 放入測試內容：
    - ```php
      <?php
      phpinfo();
      ?>
      ```
    - 設定虛擬主機：
    - ```bash
      sudo vim /etc/nginx/sites-available/lnmp-site
      ```
    - 加入以下內容（請依實際 PHP 版本調整 `php8.1-fpm`）：
    - ```nginx
      server {
          listen 8080;
          server_name localhost;

          root /var/www/lnmp-site;
          index index.php index.html;

          location / {
              try_files $uri $uri/ =404;
          }

          location ~ \.php$ {
              include snippets/fastcgi-php.conf;
              fastcgi_pass unix:/run/php/php8.3-fpm.sock;
          }

          location ~ /\.ht {
              deny all;
          }
      }
      ```

    - 啟用站點並重載 Nginx：
    - ```bash
      sudo ln -s /etc/nginx/sites-available/lnmp-site /etc/nginx/sites-enabled/
      sudo nginx -t
      sudo systemctl reload nginx
      ```
    - ![image.png](./img/image_1752105515249_0.png)

  - ### 動態 Web 原始碼下載、解壓與權限管理
    - 假設你要部署 WordPress：
    - ```bash
      cd /tmp
      wget https://wordpress.org/latest.tar.gz
      tar -xzf latest.tar.gz
      sudo mv wordpress/* /var/www/lnmp-site/
      sudo chown -R www-data:www-data /var/www/lnmp-site
      ```
  - 進行 WordPresss 安裝：
  - ![image.png](./img/image_1752105714301_0.png)
  - ![image.png](./img/image_1752106666586_0.png)
  - ![image.png](./img/image_1752106721911_0.png)
  - ![image.png](./img/image_1752106755350_0.png)
  - ![image.png](./img/image_1752106263326_0.png)
  - ![image.png](./img/image_1752106865915_0.png)
  - ![image.png](./img/image_1752106916310_0.png)
