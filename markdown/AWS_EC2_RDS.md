## 目標
- 使用 AWS EC2 + RDS 搭建 WordPreess。
- ## Amazon EC2（Elastic Compute Cloud）
	- ### 定義  
	  Amazon EC2 是 AWS 提供的虛擬伺服器服務，讓使用者能夠在雲端快速部署並管理可擴展的運算資源。使用者可依需求選擇 CPU、記憶體、儲存空間和作業系統，建立符合應用需求的 EC2 實例。
	- ###  核心功能
		- **按需計費（On-Demand）**：依照使用時間計費，適用於不穩定工作負載。
		- **預留實例（Reserved Instances）**：預付一年或三年，享有費用折扣，適合穩定工作負載。
		- **自動調整（Auto Scaling）**：根據系統負載，自動增加或減少實例數量。
		- **Elastic Load Balancing（ELB）**：將流量分散至多個 EC2 實例以提升可用性。
		- **Amazon Machine Image（AMI）**：使用映像檔快速複製與建立新的實例。
		- **整合 IAM 與 VPC**：提供細緻的存取權限與網路安全控管。
	- ### 使用場景
		- Web Server、應用程式伺服器（App Server）
		- 批次運算與資料處理
		- 容器平台（如 Docker / Kubernetes）
		- 測試 / DevOps CI/CD 環境
		- 遊戲伺服器
	- ###  官方來源  
	  [Amazon EC2 Documentation](https://docs.aws.amazon.com/ec2/index.html)
- ## Amazon RDS（Relational Database Service）
	- ### 定義  
	  Amazon RDS 是一項托管型關聯式資料庫服務，讓使用者在雲端輕鬆部署、操作及擴展資料庫，無需自行管理底層硬體與 DB 軟體。AWS 提供自動備份、修補、監控等功能。
	- ### 支援的資料庫引擎
		- Amazon Aurora（MySQL 與 PostgreSQL 相容）
		- MySQL
		- PostgreSQL
		- MariaDB
		- Oracle
		- Microsoft SQL Server
	- ### 核心功能
		- **自動備份與還原點（Point-in-Time Recovery）**
		- **多可用區部署（Multi-AZ）**：提升容錯能力與高可用性。
		- **讀取副本（Read Replica）**：提升查詢效能，支援水平擴展。
		- **整合 IAM、VPC、KMS 加密**：提供安全控管與資料保護。
		- **整合 CloudWatch 監控與告警**。
	- ### 使用場景
		- 電商平台資料庫後端
		- CMS 架站平台（如 WordPress）
		- ERP / CRM 後端資料服務
		- 資料倉儲（Aurora 小型 OLAP 場景）
	- ###  官方來源  
	  [Amazon RDS Documentation](https://docs.aws.amazon.com/rds/index.html)
- ## EC2 與 RDS 比較表
  
  | 項目         | EC2                                      | RDS                                      |
  |--------------|------------------------------------------|------------------------------------------|
  | 類型         | 計算服務                                  | 資料庫託管服務                            |
  | 控管層級     | 完全自主管理（需自行安裝 DB 等）          | AWS 託管資料庫維運                        |
  | 可彈性調整   | 高，可自由配置環境與中間件                 | 具限制，但自動管理 DB 運行與備份等功能   |
  | 使用情境     | 架站、AP Server、容器平台                  | 資料庫、儲存結構化資料                    |
  | 運維負擔     | 高，需要自行維護                          | 低，大多數管理由 AWS 自動處理             |
- ## 實作流程
	- ### RDS - Create Subnet group
		- ![image.png](./img/image_1752499398782_0.png)
		- ![image.png](./img/image_1752499481974_0.png)
		- ![image.png](./img/image_1752499545007_0.png)
	- ### RDS - Create Database
		- ![image.png](./img/image_1752499602563_0.png)
		- ![image.png](./img/image_1752499658191_0.png)
		- ![image.png](./img/image_1752499763081_0.png)
		- ![image.png](./img/image_1752499779559_0.png)
		- ![image.png](./img/image_1752499812971_0.png)
		- ![image.png](./img/image_1752500749257_0.png)
		- 練習用的帳號密碼
			- 帳號：admin
			- 密碼：cxcxc+123456
			- ![image.png](./img/image_1752500805531_0.png)
			- ![image.png](./img/image_1752500897361_0.png)
		- ![image.png](./img/image_1752501202322_0.png)
		- ![image.png](./img/image_1752501241652_0.png)
		- ![image.png](./img/image_1752502319733_0.png)
		- ![image.png](./img/image_1752502442641_0.png)
		- 練習時先不用：
			- ![image.png](./img/image_1752502581302_0.png)
			- ![image.png](./img/image_1752502611537_0.png)
		- ![image.png](./img/image_1752502705844_0.png)
		- ![image.png](./img/image_1752502772914_0.png)
		- ![image.png](./img/image_1752506224100_0.png)
		- ![image.png](./img/image_1752506342730_0.png)
		- ![image.png](./img/image_1752506396328_0.png)
	- ### Route53
		- ![image.png](./img/image_1752506519961_0.png)
		- ![image.png](./img/image_1752506550950_0.png)
		- ![image.png](./img/image_1752506600785_0.png)
		- ![image.png](./img/image_1752506702490_0.png)
		- ![image.png](./img/image_1752506728124_0.png)
		- ![image.png](./img/image_1752506827087_0.png)
		- ![image.png](./img/image_1752506864984_0.png)
		- ![image.png](./img/image_1752506947280_0.png)
		- ![image.png](./img/image_1752506975316_0.png)
		- ![image.png](./img/image_1752506993995_0.png)
		- ![image.png](./img/image_1752507026077_0.png)
		- ![image.png](./img/image_1752507046612_0.png)
	- ### 建立IAM Role
		- Permissions policies 依照下表搜尋勾選(已先將後續所需的資源存取權限預先加入)
		- | 政策名稱 | 用途 |
		  | AmazonS3FullAccess	 | EC2 to S3 使用 |
		  | AmazonRDSFullAccess | EC2 to RDS 使用 |
		  | CloudWatchFullAccess | EC2 to Cloudwatch 使用 |
		  | CloudWatchAgentAdminPolicy | EC2 to CloudWatch Agent 使用 |
		  | AmazonSSMFullAccess | EC2 to System Manager 使用 |
	- ### 建立EC2機器
		- ![image.png](./img/image_1752507168114_0.png)
		- t2.mirco
		- subnet:  1a-public
		- SG: 新建防火牆
		- 22 SSH 0.0.0.0/0
		- 80 HTTP 0.0.0.0/0
		- 8080 Custom 0.0.0.0/0
		- AMI: amazon Linux 2023
		- EBS: 10GB
		- IAM Profile (IAM Role): 選擇你剛才第一個步驟建立的IAM Role
		- **Userdata**
			- ```shell
			  #!/bin/bash
			  
			  yum update -y
			  
			  yum install -y docker
			  systemctl start docker
			  systemctl enable docker
			  usermod -a -G docker ec2-user
			  
			  mkdir -p /home/ec2-user/.docker/cli-plugins
			  curl -SL https://github.com/docker/compose/releases/download/v2.26.1/docker-compose-linux-x86_64 -o /home/ec2-user/.docker/cli-plugins/docker-compose
			  chmod +x /home/ec2-user/.docker/cli-plugins/docker-compose
			  chown ec2-user:ec2-user /home/ec2-user/.docker/
			  
			  yum install -y git
			  ```
	- ### **連線到EC2裡面後的佈署操作**
		- ![image.png](./img/image_1752507489926_0.png)
		- 參數或素材:
		- 下載課程的佈署素材
		  
		  ```bash
		  git clone https://github.com/avocadoit/wordpress-web.git
		  ```
		- **切換到素材目錄**
		  
		  ```bash
		  cd wordpress-web
		  ```
		- ![image.png](./img/image_1752507638832_0.png)
		- **用vim編輯器打開 docker-compose.ymlj**
		  
		  ```bash
		  vim docker-compose.yml
		  ```
		- **先準備之前建立RDS時的相關登入參數**
		  ![image.png](./img/image_1752507674055_0.png) 
		  ![image.png](./img/image_1752507732758_0.png) 
		  ```bash
		  oooooo.xxxxxxx.ap-northeast-1.rds.amazonaws.com
		  RDS的使用者名稱:  admin
		  RDS的資料庫密碼:  cxcxc+123456
		  RDS初始化創建的DB名稱:  wpdb
		  ```
		- **按 i 進入編輯模式，編輯以下資料庫設定值的內容**
		  
		  ```bash
		  version: '3.8'
		  
		  services:
		  
		    wordpress:
		      image: wordpress:latest
		      restart: always
		      container_name: wordpress-web
		      ports:
		        - 80:80
		      environment:
		        WORDPRESS_DB_HOST: db.wordpress-web.private (修改成RDS的位置)
		        WORDPRESS_DB_USER: db_admin (修改成RDS的使用者名稱)
		        WORDPRESS_DB_PASSWORD: cxcxc+123456 (修改成RDS的資料庫密碼)
		        WORDPRESS_DB_NAME: wpdb (修改成RDS初始化創建的DB名稱
		      volumes:
		        - ./html:/var/www/html
		        - ./logs:/var/log/apache2
		  
		    phpmyadmin:
		      image: phpmyadmin:latest
		      restart: always
		      container_name: phpmyadmin-db-console
		      ports:
		        - 8080:80
		      environment:
		        - PMA_ARBITRARY=1
		  ```
		- 編輯完畢後，按 Esc 離開編輯模式，輸入  :x  儲存並離開
		- **接著輸入指令，啟動容器服務**
		  
		  ```bash
		  docker compose up -d phpmyadmin
		  ```
		- ![image.png](./img/image_1752507796673_0.png)
		- **輸入指令，查看 phpmyadmin 容器服務是否正常啟用**
		  
		  ```bash
		  docker ps
		  ```
			- 連線到資料庫管理介面
			- http://{公有IP}:8080
			- 輸入帳號密碼，確認可連線到RDS DB
		- ![image.png](./img/image_1752507866714_0.png)
		- ![image.png](./img/image_1752507896804_0.png)
		- ![image.png](./img/image_1752508308589_0.png)
		- ![image.png](./img/image_1752508333996_0.png)
		- ![image.png](./img/image_1752508353003_0.png)
		- ![image.png](./img/image_1752508379019_0.png)
		- 登入資料庫：
			- 伺服器：db.cjc101.com
			- 帳號：admin
			- 密碼：cxcxc+123456
				- ![image.png](./img/image_1752508240998_0.png)
				- ![image.png](./img/image_1752508401731_0.png)
	- ### **啟用ＷordPress**
		- **接著輸入指令，啟動所有容器服務(包含WordPress)**
		  
		  ```bash
		  docker compose up -d
		  ```
		- ![image.png](./img/image_1752508736486_0.png)
		- **輸入指令，查看 wordpress 容器服務是否正常啟用**
		  
		  ```bash
		  docker ps
		  ```
		  ![image.png](./img/image_1752508775108_0.png)
			- 連線到網站初始畫面
			- http://{公有IP}:80
			- ![image.png](./img/image_1752508830155_0.png)
			- ![image.png](./img/image_1752508889470_0.png)
			- ![image.png](./img/image_1752508914104_0.png)
			- 輸入帳號密碼，確認可連線到網站
				- ![image.png](./img/image_1752508931238_0.png)
				- ![image.png](./img/image_1752508952073_0.png)
