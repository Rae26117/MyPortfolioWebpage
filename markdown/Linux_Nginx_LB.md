## 目標
- 於本地端 Ubuntu 環境下，使用 Nginx 做網頁負載平衡。
- ## 負載均衡目標架構
	- ```lua
	                               [Client]
	                                   |
	                             +-----▼-----+
	                             |  Nginx LB |        ← 負載均衡器（主控）
	                             +-----------+
	                                   |
	                 +----------------+----------------+
	                 |                                 |
	           +-----▼-----+                     +-----▼-----+
	           | WordPress1|                     | WordPress2| ← LNMP 架構（Nginx + PHP + 靜態/動態內容）
	           | Nginx/PHP |                     | Nginx/PHP |
	           +-----------+                     +-----------+
	                 |                                 |
	                 +---------------+-----------------+
	                                 |
	                           +-----▼-----+
	                           |   MySQL   |            ← 資料庫主機（集中式）
	                           +-----------+
	  
	  ```
- ## 前置準備
- ### 1. 主機準備
	- | 主機名稱 | 功能說明 | 安裝內容 |
	  | ---- | ---- | ---- |
	  | `lb-server` | 負載均衡器 | Nginx |
	  | `app-server-1` | LNMP + WordPress | Nginx + PHP + WordPress |
	  | `app-server-2` | LNMP + WordPress | Nginx + PHP + WordPress |
	  | `mysql-server` | 資料庫主機 | MySQL / MariaDB |
- ### 2. 建議網段與角色設定（本地或 VM 環境可參考）
	- | 主機 | IP | 用途 |
	  | ---- | ---- | ---- |
	  | lb-server | 192.168.10.10 | Nginx Load Balancer |
	  | app-server-1 | 192.168.10.11 | WordPress App |
	  | app-server-2 | 192.168.10.12 | WordPress App |
	  | mysql-server | 192.168.10.13 | MySQL Server |
- ## 部署環境概覽
	- | 腳本名稱 | 用途 | 適用主機 |
	  | ---- | ---- | ---- |
	  | `setup_app_server.sh` | 安裝 LNMP 與 WordPress | WordPress1、WordPress2 |
	  | `setup_mysql_server.sh` | 安裝並初始化 MySQL | MySQL 主機 |
	  | `setup_lb_server.sh` | 安裝 Nginx 並設定負載均衡 | 負載均衡器 |
- ## 自動化部署腳本
	- ### `setup_app_server.sh` – App Server 部署 WordPress + LNMP
	- ```bash
	  #!/bin/bash
	  set -e
	  
	  # 安裝必要套件
	  sudo apt update
	  sudo apt install -y nginx php-fpm php-mysql php-xml php-curl php-mbstring php-zip php-gd php-intl unzip wget
	  
	  # 設定 PHP-FPM 已啟動
	  sudo systemctl enable php8.3-fpm
	  sudo systemctl start php8.3-fpm
	  
	  # 建立網站根目錄
	  sudo mkdir -p /var/www/html
	  sudo chown -R www-data:www-data /var/www/html
	  
	  # 下載並安裝 WordPress
	  cd /tmp
	  wget https://wordpress.org/latest.tar.gz
	  tar -xzf latest.tar.gz
	  sudo mv wordpress/* /var/www/html/
	  sudo chown -R www-data:www-data /var/www/html/
	  
	  # 建立 Nginx 設定檔
	  cat <<EOF | sudo tee /etc/nginx/sites-available/wordpress
	  server {
	      listen 80;
	      server_name _;
	  
	      root /var/www/html;
	      index index.php index.html;
	  
	      location / {
	          try_files \$uri \$uri/ =404;
	      }
	  
	      location ~ \.php$ {
	          include snippets/fastcgi-php.conf;
	          fastcgi_pass unix:/run/php/php8.3-fpm.sock;
	      }
	  
	      location ~ /\.ht {
	          deny all;
	      }
	  }
	  EOF
	  
	  # 啟用站點
	  sudo ln -sf /etc/nginx/sites-available/wordpress /etc/nginx/sites-enabled/
	  sudo nginx -t && sudo systemctl reload nginx
	  
	  ```
	- ### `setup_mysql_server.sh` – 安裝 MySQL 並建立 WordPress 資料庫
	- ```bash
	  #!/bin/bash
	  set -e
	  
	  # 安裝 MySQL
	  sudo apt update
	  sudo apt install -y mysql-server
	  
	  # 啟動與設定開機自動啟動
	  sudo systemctl enable mysql
	  sudo systemctl start mysql
	  
	  # 修改設定允許遠端連線
	  sudo sed -i "s/^bind-address.*/bind-address = 0.0.0.0/" /etc/mysql/mysql.conf.d/mysqld.cnf
	  sudo systemctl restart mysql
	  
	  # 初始化 WordPress 資料庫與帳號
	  sudo mysql -e "
	  CREATE DATABASE wordpress DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
	  CREATE USER 'admin'@'%' IDENTIFIED BY 'wppassword';
	  GRANT ALL PRIVILEGES ON wordpress.* TO 'admin'@'%';
	  FLUSH PRIVILEGES;"
	  
	  ```
	- ### `setup_lb_server.sh` – 負載均衡器 Nginx 設定
	- ```bash
	  #!/bin/bash
	  set -e
	  
	  # 安裝 Nginx
	  sudo apt update
	  sudo apt install -y nginx
	  
	  # 建立 upstream 與 proxy 設定
	  cat <<EOF | sudo tee /etc/nginx/sites-available/loadbalance
	  upstream wordpress_backend {
	      server 172.16.40.139:80;
	      server 172.16.40.140:80;
	  }
	  
	  server {
	      listen 80;
	      server_name _;
	  
	      location / {
	          proxy_pass http://wordpress_backend;
	          proxy_set_header Host \$host;
	          proxy_set_header X-Real-IP \$remote_addr;
	      }
	  }
	  EOF
	  
	  # 啟用並重啟
	  sudo ln -sf /etc/nginx/sites-available/loadbalance /etc/nginx/sites-enabled/
	  sudo nginx -t && sudo systemctl reload nginx
	  ```
- ## 使用方法
	- ### 每台主機執行對應腳本：
	- | 主機名稱         | 指令範例                         |
	  | ------------ | ---------------------------- |
	  | app-server-1 | `bash setup_app_server.sh`   |
	  | app-server-2 | `bash setup_app_server.sh`   |
	  | mysql-server | `bash setup_mysql_server.sh` |
	  | lb-server    | `bash setup_lb_server.sh`    |
- ## 實作截圖
	- ### 作業系統：Ubuntu Server 24.04 LTS
	- ![image.png](./img/image_1752477980311_0.png)
	- ### server-1 、 server-2 建立 setup_app_server.sh 腳本 ( <span class='red'>安裝時要注意php-fpm版本</span> )
	- ![image.png](./img/image_1752479976237_0.png)
	- ![image.png](./img/image_1752480033248_0.png)
	- ![image.png](./img/image_1752480247625_0.png)
	- ![image.png](./img/image_1752480178117_0.png)
	- ![image.png](./img/image_1752480937333_0.png)
	- ![image.png](./img/image_1752481135304_0.png)
	- ![image.png](./img/image_1752481638491_0.png)
	- ![image.png](./img/image_1752481420980_0.png){:height 515, :width 749}
	- ![image.png](./img/image_1752481457866_0.png)
	- ![image.png](./img/image_1752481607697_0.png)
	- ### 安裝 MySQL 並建立 WordPress 資料庫
	- ![image.png](./img/image_1752481812552_0.png)
	- ![image.png](./img/image_1752481794182_0.png)
	- ![image.png](./img/image_1752481870899_0.png)
	- ![image.png](./img/image_1752482472427_0.png)
	- ![image.png](./img/image_1752482499781_0.png)
	- ![image.png](./img/image_1752482676379_0.png)
	- ![image.png](./img/image_1752482720955_0.png)
	- ### 負載均衡器 Nginx 設定
	- ![image.png](./img/image_1752483149764_0.png)
	- ![image.png](./img/image_1752482997824_0.png)
- ## 測試負載平衡有沒有成功
	- ## 步驟一：在每台 App Server 上修改  `index.php`
	- ### 1. 連到 App Server
	  
	  以 `app-server-1` 為例：
	  
	  ```bash
	  ssh user@app-server-1
	  ```
	- ### 2. 編輯 WordPress 首頁檔案
	  
	  ```bash
	  sudo vim /var/www/html/index.php
	  ```
	- ### 3. 在開頭插入主機名稱顯示程式碼
	  
	  在第一行 `<?php` 後方加入這行：
	  
	  ```php
	  <?php echo "<h2>Server: " . gethostname() . "</h2>"; ?>
	  ```
	  
	  完整範例如下：
	  ![image.png](./img/image_1752484099928_0.png) 
	  ```php
	  <?php echo "<h2>Server: " . gethostname() . "</h2>"; ?>
	  <?php
	  /**
	  * Front to the WordPress application. This file doesn't do anything, but loads
	  * wp-blog-header.php which does and tells WordPress to load the theme.
	  *
	  * @package WordPress
	  */
	  ```
	- ### 4. 儲存並關閉
	- ### 5. 在  `app-server-2`  上重複以上動作
	  建議讓它顯示自己的主機名（例如：WordPress2）
	- ## 步驟二：測試負載均衡效果
	- ### 方法 A：瀏覽器測試
	  
	  在瀏覽器中開啟：
	  ```cpp
	  http://<負載均衡器 IP 或網域>
	  ```
	  然後 **按 F5 多次重新整理**，你會看到畫面頂部輪流出現：
	  ```pgsql
	  Server: app-server-1
	  Server: app-server-2
	  ```
	  ![image.png](./img/image_1752486947665_0.png)
	  ![image.png](./img/image_1752486967047_0.png) 
	  代表每次請求都由不同主機處理，表示 **負載均衡成功**。
	- ### 方法 B：使用 curl 測試
	  在 LB 上或你自己的電腦上執行：
	  
	  ```bash
	  curl http://<負載均衡器 IP>
	  curl http://<負載均衡器 IP>
	  curl http://<負載均衡器 IP>
	  ```
	  
	  每次輸出應該不同，例如：
	  ![image.png](./img/image_1752484665471_0.png) 
	  ```php-template
	  <h2>Server: app-server-1</h2>
	  ...
	  <h2>Server: app-server-2</h2>
	  ...
	  ```
	- <span class='pink'>備注：移除預設站台設定（避免干擾）</span>
	- ```bash
	  sudo rm /etc/nginx/sites-enabled/default
	  ```
