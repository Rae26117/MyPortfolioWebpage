# OSI 七層模型詳細筆記

OSI（Open Systems Interconnection）是由 ISO 制定的網路模型，將網路通訊分為 7 層，幫助理解資料如何從應用程式層經過網路層層封裝、傳送至接收端。

---

## 七層總覽

| 層級 | 名稱（英文 / 中文） | 功能重點 | 對應協定 / 技術 |
|------|--------------------|----------|------------------|
| 7 | Application（應用層） | 提供使用者與網路應用的介面 | HTTP, FTP, DNS, SMTP |
| 6 | Presentation（表現層） | 資料格式轉換、加密、壓縮 | SSL/TLS, JPEG, MPEG |
| 5 | Session（會議層） | 建立、管理與終止會話連線 | NetBIOS, RPC |
| 4 | Transport（傳輸層） | 分段傳輸、錯誤控制、流量控制 | TCP, UDP |
| 3 | Network（網路層） | 路由選擇、IP 定位與封包轉送 | IP, ICMP, ARP |
| 2 | Data Link（資料連結層） | MAC 位址控制、錯誤偵測 | Ethernet, PPP, VLAN |
| 1 | Physical（實體層） | 資料的實體傳輸（訊號） | RJ45, 光纖, 無線電波 |

---

## 記憶口訣

> **英文版（由上往下）**  
“All People Seem To Need Data Processing”  

> **中文版（由上往下）**  
「應表會傳網連實」

---

## 各層詳細說明

### 7. 應用層（Application Layer）
- 功能：提供使用者與網路服務的互動介面
- 例如：開瀏覽器上網、收信、看影片
- 協定：HTTP、HTTPS、FTP、SMTP、POP3、DNS

---

### 6. 表現層（Presentation Layer）
- 功能：格式轉換、加密解密、壓縮解壓
- 把資料轉換成接收端能理解的格式（例如 Unicode → ASCII）
- 技術：SSL/TLS（加密）、JPEG、MPEG、PNG、Base64

---

### 5. 會議層（Session Layer）
- 功能：建立、管理與終止應用之間的對話（Session）
- 負責同步與檢查點，例如影片串流過程中「接續播放」
- 協定：NetBIOS、RPC（Remote Procedure Call）

---

### 4. 傳輸層（Transport Layer）
- 功能：負責資料傳輸的正確性、可靠性與分段重組
- 提供端到端的連線控制與流量控制
- 協定：TCP（可靠）、UDP（快速）

---

### 3. 網路層（Network Layer）
- 功能：決定資料傳送的路徑、負責邏輯位址（IP）
- 負責選擇最佳路由、處理封包轉送
- 協定：IP（IPv4/IPv6）、ICMP、IGMP、ARP、NAT

---

### 2. 資料連結層（Data Link Layer）
- 功能：把封包封裝成 frame，處理 MAC 位址與錯誤檢測
- 負責同一區域網段內的資料傳送
- 協定：Ethernet、PPP、HDLC、VLAN、MAC

---

### 1. 實體層（Physical Layer）
- 功能：傳送實體位元（0 與 1）到實體媒介上，如電壓、光訊號
- 對應硬體設備，例如線材、插槽、無線電波
- 技術：RJ45、網路卡、光纖、無線電波、USB

---

## OSI 與 TCP/IP 模型對照

| OSI 模型 | TCP/IP 模型 | 對應說明 |
|----------|-------------|----------|
| 第 7~5 層（應用、表現、會議） | 應用層（Application） | 提供應用服務 |
| 第 4 層（傳輸層） | 傳輸層（Transport） | TCP/UDP |
| 第 3 層（網路層） | 網際層（Internet） | IP 封包轉送與路由 |
| 第 2~1 層（資料連結 + 實體） | 網路介面層（Network Interface） | 封裝 + 實體傳送 |

---

## 為什麼要學 OSI 模型？

- 有助於**系統性理解網路通訊流程**
- 快速定位網路問題是哪一層（如 DNS 是應用層，IP 是網路層）
- 設計與診斷網路架構、路由、防火牆與應用協定的基礎

