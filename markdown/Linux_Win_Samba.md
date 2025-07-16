# 網路芳鄰的建立與使用
	- 環境：
		- (1) Server端 x 1，使用 Linux (不限發行版)，軟體指定 Samba
		- (2) Client端 x 2，使用 Windows (網路芳鄰) 與 Linux (不限發行版)
	- 目標：
		- (1) Server端分享兩個目錄，
			- 將 /var/shares 分享為 任何人都 "唯讀"，需展示驗證實作畫面 (Windows / Linux)
			- 將 /var/update 分享為 任何人都 "可讀、可寫"，需展示驗證實作畫面 (Windows / Linux)
		- (2) 加分題：(可選擇)
			- Server 端新增一個 amy 本機帳號 (密碼：123)
			- 使用 amy 才可進入網路芳鄰指定目錄
			- Server 端再享一個目錄，將 /var/secret 分享為 需要帳號、密碼，才能進入目錄，且為"可讀、可寫"
- # Samba 簡介
	- ## Samba 是什麼？
		- Samba 是一套開放原始碼的**檔案與印表機分享軟體**，可以讓 **Linux / Unix 系統** 和 **Windows 系統** 之間進行檔案傳輸與資源共享。
	- ## 為什麼需要 Samba？
		- 在網路中，Windows 使用的是 SMB / CIFS 協定來進行「網路芳鄰」功能，但 Linux 並不支援這個協定，透過 Samba 來幫忙「翻譯」這種語言，讓 Linux 也能與 Windows 正常分享資料夾和印表機。
	- ## Samba 能做什麼？
		- 可以做到資料夾、印表機分享，並設定及管理使用者帳號權限，做到windows與Linux資料雙向共享的目的。
			- | 功能 | 說明 |
			  | ---- | ---- | ---- |
			  | 資料夾分享 | Linux 分享資料夾給 Windows 存取（網路芳鄰） |
			  | 印表機分享 | 讓多台電腦共用一台印表機 |
			  | 使用者帳號權限管理 | 可以限制誰能看、誰能寫 |
			  | 雙向共享 | Windows 也能共享資料夾給 Linux 使用 |
	- ##  Samba 的運作方式
		- ### Samba 在 Linux 上會啟動兩個主要服務：
			- **smbd**：處理實際的檔案分享與權限
			- **nmbd**：處理電腦名稱與網路芳鄰的辨識（類似 DNS）
	- ##  使用情境舉例
		- 家用環境、公司內部、學校實驗室
			- | 情境 | 解釋 |
			  | ---- | ---- | ---- |
			  | 家用環境 | Linux 電腦想把影片資料夾分享給家中的 Windows 電腦觀看 |
			  | 公司內部 | 建立中央檔案伺服器，由多位員工跨系統存取與同步資料 |
			  | 學校實驗室 | 教學用伺服器提供學生上傳作業、存取教材 |
	- ##  Samba 的優點
		- 免費開源
		- 可與 Windows 完美整合
		- 支援用戶登入、權限控管
		- 易於設定與維護
	- 參考資料:[Samba - 維基百科，自由的百科全書](https://zh.wikipedia.org/zh-tw/Samba)
- # 實作環境圖
	- [[拓樸圖]]
	- ![image.png](./img/image_1749053635490_0.png)
- # Server端設定步驟（Ubuntu 24.04）
	- ### 安裝與設定 Samba
	  
	  ```bash
	  sudo apt update
	  sudo apt install samba
	  ```
		- ![vlcsnap-2025-06-08-15h27m03s148.png](./img/vlcsnap-2025-06-08-15h27m03s148_1749368009126_0.png){:height 75, :width 293}
		- ![vlcsnap-2025-06-08-15h27m57s820.png](./img/vlcsnap-2025-06-08-15h27m57s820_1749367892313_0.png){:height 100, :width 567}
	- ### 建立三個分享資料夾
	  
	  ```bash
	  sudo mkdir -p /var/shares
	  sudo mkdir -p /var/update
	  sudo mkdir -p /var/secret
	  ```
		- ![vlcsnap-2025-06-08-15h46m19s748.png](./img/vlcsnap-2025-06-08-15h46m19s748_1749368911490_0.png)
		- ![image.png](./img/image_1749368977882_0.png)
	- ### 設定權限
	  
	  ```bash
	  # shares: 可被所有人唯讀
	  sudo chmod 755 /var/shares
	  
	  # update: 可被所有人讀寫
	  sudo chmod 777 /var/update
	  
	  # secret: 只允許特定使用者進入
	  sudo chmod 770 /var/secret
	  sudo useradd -M amy
	  sudo passwd amy  # 設為123
	  
	  # 指定該資料夾擁有者為 amy
	  sudo chown amy:amy /var/secret
	  ```
		- ![image.png](./img/image_1749369071233_0.png)
		- ![image.png](./img/image_1749369374052_0.png)
	- ### 加入 Samba 使用者
	  
	  ```bash
	  sudo smbpasswd -a amy
	  ```
		- ![image.png](./img/image_1749369436872_0.png)
	- ### 編輯 Samba 設定檔
	  
	  ```bash
	  sudo vim /etc/samba/smb.conf
	  ```
		- #### 在檔案最下方新增：
		  
		  ```bash
		  [shares]
		   path = /var/shares
		   browseable = yes
		   read only = yes
		   guest ok = yes
		  
		  [update]
		   path = /var/update
		   browseable = yes
		   read only = no
		   guest ok = yes
		  
		  [secret]
		   path = /var/secret
		   browseable = yes
		   writable = yes
		   valid users = amy
		  ```
			- ![{16A8D5A3-10F9-49D7-A150-16CDDCAB8E14}.png](./img/{16A8D5A3-10F9-49D7-A150-16CDDCAB8E14}_1749371080762_0.png) {:height 660, :width 436}
	- ### 啟動與自動啟動 Samba
	  
	  ```bash
	  # 啟動 smbd 與 nmbd 服務
	  sudo systemctl start smbd nmbd
	  
	  # 設定開機自動啟動
	  sudo systemctl enable smbd nmbd
	  ```
		- ![image.png](./img/image_1749370130137_0.png)
- # Client端設定與驗證流程（Windows / Linux）
	- ### Linux Client：
	  collapsed:: true
		- 安裝 smbclient 工具（如尚未安裝）
			- ```bash
			  sudo apt install smbclient
			  ```
		- 使用 smbclient 連線
			- ```bash
			  smbclient //<Server-IP>/shares -N
			  smbclient //<Server-IP>/update -N
			  smbclient //<Server-IP>/secret -U amy
			  ```
			- 登入後可使用指令如：
			- ```bash
			  ls
			  put 本地檔案
			  get 檔案
			  ```
			- 驗證唯讀目錄是否可進入但不可新增檔案
				- 開啟： `shares` 資料夾
					- 嘗試新增或編輯檔案，僅可讀
						- ![image.png](./img/image_1749370678405_0.png)
				- 開啟： `update` 資料夾
					- 嘗試新增檔案，測試可讀寫
						- ![image.png](./img/image_1749370718436_0.png)
				- 開啟： `secret` 資料夾
					- ![image.png](./img/image_1749370783952_0.png)
					- ![image.png](./img/image_1749370844358_0.png)
					- ![image.png](./img/image_1749370866362_0.png)
	- ### Windows Client：
		- Windows 24H2 或更新版本需特別設定>以`系統管理員身分`執行 `PowerShell`
			- ![image.png](./img/image_1749369653853_0.png)
			- 啟用不安全的訪客登入
			- ```PowerShell
			  Set-SmbClientConfiguration -EnableInsecureGuestLogons $true -Force
			  ```
			- 禁用 SMB 驗證
			- ```PowerShell
			  Set-SmbClientConfiguration -RequireSecuritySignature $false
			  ```
				- ![image.png](./img/image_1749369786958_0.png)
		- 開啟檔案總管，輸入： `\\<Server-IP>`
			- 驗證唯讀目錄是否可進入但不可新增檔案
			- ![image.png](./img/image_1748674165461_0.png)
		- 開啟： `shares` 資料夾
			- ![image.png](./img/image_1748674208625_0.png)
			- 嘗試新增或編輯檔案，僅可讀
				- ![{8D6D59BC-ED60-4477-A40A-0837B7B7F3D1}.png](./img/{8D6D59BC-ED60-4477-A40A-0837B7B7F3D1}_1748674432580_0.png)
		- 開啟： `update` 資料夾
			- ![image.png](./img/image_1748674953640_0.png)
			- 嘗試新增檔案，測試可讀寫
				- ![image.png](./img/image_1748674535637_0.png){:height 418, :width 689}
				- ![image.png](./img/image_1748674593535_0.png)
		- 開啟： `secret` 資料夾
			- ![image.png](./img/image_1748674972838_0.png)
			- 會要求輸入帳號密碼
				- ![image.png](./img/image_1748674831202_0.png)
				- 輸入帳號 amy、密碼 123，驗證是否可進入並新增檔案
					- ![image.png](./img/image_1748674663549_0.png)
					- ![image.png](./img/image_1748674870318_0.png){:height 402, :width 659}
					- ![image.png](./img/image_1748674921839_0.png){:height 402, :width 659}
- # 加分題說明與驗證
	- 帳號 amy 已建立並加入 Samba 資料庫
	- 目錄 /var/secret 權限設為 770，僅 amy 可進入
	- Samba 設定限制 valid users = amy
		- ![{A23BB31F-3A2F-443E-BB0A-4E183715C30D}.png](./img/{A23BB31F-3A2F-443E-BB0A-4E183715C30D}_1749371120426_0.png)
	- 成功透過 Windows / Linux 使用者 amy 登入並操作該目錄
- # 補充 : 固定IP設定
	- ![image.png](./img/image_1748676697196_0.png){:height 376, :width 642}
	- ![vw.png](./img/vw_1749373080179_0.png)
	- ![image.png](./img/image_1749373058595_0.png)
	- <span class='yellow'>VMware網卡設定 > Custom : Specific virtual network</span>
		- ![{46CBB58D-1A6C-4D54-8CF3-2991B82A3E70}.png](./img/{46CBB58D-1A6C-4D54-8CF3-2991B82A3E70}_1748676060734_0.png)
	- ### Server IP 設定（靜態）
		- 假設要設定 IP 為 192.168.200.10 ：
		  ```bash
		  sudo vim /etc/netplan/*.yaml
		  ```
		- 範例設定內容：
			- ```bash
			  network:
			     version: 2
			     ethernets:
			       ens33:
			         dhcp4: no
			         dhcp6: no
			         addresses:
			         - 192.168.200.10/24
			         routes:
			         - to: default
			           via: 192.168.200.254
			         nameservers:
			           addresses:
			           - 168.95.1.1
			           - 8.8.8.8
			  ```
		- 儲存後執行套用：
			- ```bash
			  sudo netplan apply
			  ```
	- ### Linux Client IP 設定（靜態）
		- 假設要設定 IP 為 192.168.200.10 ：
		  ```bash
		  sudo vim /etc/netplan/*.yaml
		  ```
		- 範例設定內容：
			- ```bash
			  network:
			     version: 2
			     ethernets:
			       ens33:
			         dhcp4: no
			         dhcp6: no
			         addresses:
			         - 192.168.200.11/24
			         routes:
			         - to: default
			           via: 192.168.200.254
			         nameservers:
			           addresses:
			           - 168.95.1.1
			           - 8.8.8.8
			  ```
		- 儲存後執行套用：
			- ```bash
			  sudo netplan apply
			  ```
	- ### Windows Client IP 設定（靜態）
		- 開啟「控制台」→「網路和共用中心」→「變更介面卡設定」
		- 右鍵點選使用中的網路卡 → 點選「內容」
		- 選擇「Internet Protocol Version 4 (TCP/IPv4)」→「內容」
		- 設定如下：
			- IP位址：192.168.200.12
			- 子網路遮罩：255.255.255.0
			- 預設閘道：192.168.200.254
			- DNS：8.8.8.8 或依實際需求設定
- # 心得與收穫
	- 透過本次 Samba 分享實作作業，學會了如何讓 Linux 與 Windows 系統之間共享資料夾，並體會到設定權限與帳號控管的重要性，特別是在實作唯讀/可寫與帳號限制上，理解了 Linux 的檔案權限設計、Samba 的設定邏輯，也讓我更熟悉網路芳鄰的背後機制，這些技能未來在企業或實驗室網路架構中非常實用。
