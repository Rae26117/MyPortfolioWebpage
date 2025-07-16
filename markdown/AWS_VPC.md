## 目標
- 在AWS 雲端上**自訂屬於自己的隔離網路環境**，像在地端資料中心內建置一個網路一樣。
- ## VPC 核心名詞與功能一覽
	- ### ✅ AWS VPC 核心名詞與功能對照表
	  
	  | 編號 | 名稱 | 定義與用途 | 備註 |
	  |------|------|------------|------|
	  | 1️⃣| **VPC（Virtual Private Cloud）** | 在 AWS 上建立邏輯上隔離的網路環境。可自訂 IP 範圍、子網、路由、安全設定，像是虛擬資料中心。 | 每個帳號預設可建立多個 VPC。 |
	  | 2️⃣ | **Subnet（子網路）** | 將 VPC 切割為更小單位，方便管理與安全隔離。**Public Subnet**：對外通訊（經 IGW）**Private Subnet**：內部資源（如 RDS） | 通常搭配多可用區部署。 |
	  | 3️⃣ | **Route Table（路由表）** | 控制子網路的網路流向，例如：`0.0.0.0/0` → IGW（提供外連）私有子網 → NAT Gateway | 每個子網只能綁一張路由表。 |
	  | 4️⃣ | **Internet Gateway（IGW）** | 讓 Public Subnet 可與網際網路互通。需綁定至 VPC 並在路由表中設定。 | 無額外費用，但需設定安全組。 |
	  | 5️⃣ | **NAT Gateway / NAT Instance** | 讓 Private Subnet 中資源**主動連外**，但無法被外部存取。**NAT Gateway**：受管服務，穩定可靠**NAT Instance**：EC2 模擬，需自行維運 | NAT Gateway 有固定費用。 |
	  | 6️⃣ | **Security Group（安全群組）** | 控制 EC2、RDS 等資源的**入/出站流量**。屬於**狀態式**防火牆，自動允許回應流量。 | 可套用多個 Security Group。 |
	  | 7️⃣ | **Network ACL（網路 ACL）** | 子網路層級的存取控制。屬於**無狀態**防火牆，需手動允許回應流量。 | 可針對 IP、Port 設定規則。 |
	  | 8️⃣ | **VPC Peering（對等連線）** | 讓兩個 VPC 間可私下通訊（同區/跨區皆可）。 | 無法做轉發（non-transitive）。 |
	  | 9️⃣ | **VPC Endpoint** | 私下連接 AWS 服務（如 S3、DynamoDB），不需走公開網路。**Interface Endpoint**：ENI 方式**Gateway Endpoint**：限 S3/DynamoDB | 提升安全性與效能。 |
	  | 🔟 | **Elastic IP（EIP）** | 靜態 IPv4 公網位址，可綁定 EC2 或 NAT Gateway 等。 | 未綁定時會產生費用。 |
- ![image.png](./img/image_1751963731459_0.png)
-
- ## 前置
	- 將預設VPC命名為Default
	- ![image.png](./img/image_1751964181936_0.png)
	- ![image.png](./img/image_1751964235490_0.png)
	- ![image.png](./img/image_1751964258377_0.png)
	- ![image.png](./img/image_1751964347220_0.png)
	- ![image.png](./img/image_1751964375976_0.png)
	- ![image.png](./img/image_1751964408695_0.png)
	- ![image.png](./img/image_1751964488445_0.png)
	- ![image.png](./img/image_1751964527846_0.png)
- ## 建置步驟
	- ![image.png](./img/image_1751964581087_0.png)
	- 各AZ網段參數表
	- VPC CIDR: 10.0.0.0/16
	  | Availability Zone | Subnet CIDR     | Subnet 名稱                                      |
	  |-------------------|------------------|--------------------------------------------------|
	  | ap-northeast-1a   | 10.0.0.0/24      | cjc101-99-ap-northeast-1a-public-subnet-1       |
	  |                   | 10.0.3.0/24      | cjc101-99-ap-northeast-1a-private-subnet-4      |
	  |                   | 10.0.6.0/24      | cjc101-99-ap-northeast-1a-private-subnet-7      |
	  | ap-northeast-1c   | 10.0.1.0/24      | cjc101-99-ap-northeast-1c-public-subnet-2       |
	  |                   | 10.0.4.0/24      | cjc101-99-ap-northeast-1c-private-subnet-5      |
	  |                   | 10.0.7.0/24      | cjc101-99-ap-northeast-1c-private-subnet-8      |
	  | ap-northeast-1d   | 10.0.2.0/24      | cjc101-99-ap-northeast-1d-public-subnet-3       |
	  |                   | 10.0.5.0/24      | cjc101-99-ap-northeast-1d-private-subnet-6      |
	  |                   | 10.0.8.0/24      | cjc101-99-ap-northeast-1d-private-subnet-9      |
	- 1.建立VPC
		- ![image.png](./img/image_1751964836833_0.png)
		- ![image.png](./img/image_1751964870249_0.png)
		- ![image.png](./img/image_1751964918800_0.png)
	- 2.依照AZ分別建立9個子網段( <mark class='red'>99要記得改，圖片裡忘了改了</mark> )
		- ![image.png](./img/image_1751964982963_0.png){:height 424, :width 718}
		- ![image.png](./img/image_1751965229728_0.png)
		- ![image.png](./img/image_1751965263745_0.png)
		- ![image.png](./img/image_1751965358808_0.png)
		- ![image.png](./img/image_1751965428769_0.png)
		- ![image.png](./img/image_1751965485954_0.png)
		- ![image.png](./img/image_1751965588795_0.png)
		- ![image.png](./img/image_1751965641430_0.png)
		- ![image.png](./img/image_1751965685579_0.png)
		- ![image.png](./img/image_1751965865789_0.png)
		- ![image.png](./img/image_1751965921804_0.png)
		- ![image.png](./img/image_1751965985224_0.png)
		- ![image.png](./img/image_1751966029463_0.png)
	- 3.建立IGW (Internet Gateways 網際網路閘道)，並掛接於 VPC 上
		- ![image.png](./img/image_1751966111737_0.png)
		- ![image.png](./img/image_1751966151318_0.png)
		- ![image.png](./img/image_1751966207898_0.png)
		- ![image.png](./img/image_1751966231030_0.png)
	- 4.設定主要路由表(公有)
		- ![image.png](./img/image_1751966308364_0.png)
		- ![image.png](./img/image_1751966347657_0.png)
		- ![image.png](./img/image_1751967101533_0.png)
		- ![image.png](./img/image_1751967157531_0.png)
		- ![image.png](./img/image_1751967238309_0.png)
		- ![image.png](./img/image_1751967268710_0.png)
		-
	- 5.新增並設定1個路由表(私有)
		- ![image.png](./img/image_1751966984101_0.png)
		- ![image.png](./img/image_1751967040649_0.png)
		- ![image.png](./img/image_1751967319806_0.png)
		- ![image.png](./img/image_1751967373817_0.png)
		-
	- 6.設定公網段可自動分配公有IP
		- ![image.png](./img/image_1751966717882_0.png)
		- ![image.png](./img/image_1751966824035_0.png)
		- ![image.png](./img/image_1751966863343_0.png)
		- ![image.png](./img/image_1751966780216_0.png)
		- ![image.png](./img/image_1751966904428_0.png)
		- ![image.png](./img/image_1751966928194_0.png)
	- 7.開啟VPC Hostname功能
		- ![image.png](./img/image_1751966551351_0.png)
		- ![image.png](./img/image_1751966584505_0.png)
	- 8.NACL、Security groups命名
		- ![image.png](./img/image_1751967628857_0.png)
		- ![image.png](./img/image_1751967550809_0.png){:height 426, :width 718}
	- 9.建立S3 Bucket
		- ![image.png](./img/image_1751968072606_0.png)
		- ![image.png](./img/image_1751968103579_0.png)
		- ![image.png](./img/image_1751968131943_0.png)
		- ![image.png](./img/image_1751968174394_0.png)
	- 10.開啟並設定Flow Log轉存至S3
		- ![image.png](./img/image_1751967702655_0.png)
		- ![image.png](./img/image_1751967781289_0.png)
		- ![image.png](./img/image_1751968204422_0.png)
		- ![image.png](./img/image_1751968302689_0.png)
