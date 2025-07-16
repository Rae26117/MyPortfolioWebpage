## 目標
- 透過網路資料與youtube 影片建立基本對向量資料庫的認知。
	- 參考資料：
      - [https://youtu.be/W_ZUUDJsUtA?si=dzEJeupKX2_TxOHa](https://youtu.be/W_ZUUDJsUtA?si=dzEJeupKX2_TxOHa)
      - [https://youtu.be/ct20Kv8yn0U?si=nLam33GDXNz7i3R4](https://youtu.be/ct20Kv8yn0U?si=nLam33GDXNz7i3R4)
- ## 結論
	- 向量資料庫為生成式 AI 應用的核心基礎，尤其是在需要結合**語意檢索（semantic search）**時。
	- **向量資料庫 ≠ 一般資料庫**，但常與傳統資料庫共同使用，例如：先用向量庫檢索，回傳 ID 再查詢原始資料。
	- 初學者可從 FAISS 或 Weaviate 入門，再依需求考慮 Pinecone 或 Milvus。
- ## 向量資料庫是什麼？
	- ### 定義
	  向量資料庫（Vector Database）是一種專門用來儲存與查詢「高維度向量資料」的資料庫，通常應用於處理語意相似度、圖像辨識、推薦系統等需要**近似搜尋（Approximate Nearest Neighbor, ANN）**的情境。
- ## 核心概念說明
    | **概念**                        | **說明**                                                                 |
    |-------------------------------|--------------------------------------------------------------------------|
    | **向量（Vector）**             | 將文字、圖片、音訊等資料轉換為模型可理解的數值向量（通常為高維陣列）。        |
    | **Embedding**                 | 利用 AI 模型（如 OpenAI Embedding API、BERT）將資料轉換成向量的過程。          |
    | **向量搜尋（Similarity Search）** | 給定一筆查詢向量，尋找資料庫中最相近的向量（透過餘弦相似度或歐氏距離等方式）。 |
    | **ANN 演算法**                | 為了加速高維資料的搜尋，使用「近似最近鄰」技術，如 HNSW、IVF、PQ 等。         |

- ## 影片重點整理
	- ###   [影片 1：向量資料庫是什麼？（時間軸型說明）](https://youtu.be/W_ZUUDJsUtA?si=dzEJeupKX2_TxOHa)
	  
	  **重點內容：**
		- **背景問題：**
			- 傳統關聯式資料庫無法處理語意相似查詢（e.g. 找出意思接近的句子）
		- **向量化流程：**
			- 將文本 → Embedding（向量化）→ 儲存至向量資料庫
		- **實際應用：**
			- RAG（Retrieval-Augmented Generation）：讓 LLM 結合向量資料庫找出語意接近的資料段落，再生成回答。
		- **優點與限制：**
			- 快速語意查詢、高維資料檢索好幫手
			- 但需要選對向量資料庫與適合的 ANN 方法
	- ###   [影片 2：市面常見向量資料庫比較](https://youtu.be/ct20Kv8yn0U?si=nLam33GDXNz7i3R4)
	  
	  **提到的向量資料庫工具與特性：**
		- | 工具 | 特性 | 備註 |
		  | ---- | ---- | ---- |
		  | **FAISS（Meta 開發）** | 高效能、可在本機使用、不支援分散式 | 適合本地測試與學術用途 |
		  | **Pinecone** | 商用化平台、支援擴充與即時查詢 | 使用者友善，但需付費 |
		  | **Weaviate** | 支援 REST API、GraphQL、多模態搜尋 | 支援多種外部模型接入 |
		  | **Milvus** | 開源且支援大規模分布式運算 | 適合企業級應用 |
- ## 使用場景舉例
    | **應用場景**                 | **說明**                                                                 |
    |-----------------------------|--------------------------------------------------------------------------|
    | **智能問答系統（RAG）**     | 將用戶問題向量化，在向量資料庫找出相關資料，再交由 LLM 回答。            |
    | **推薦系統**                | 根據使用者行為向量與商品向量做匹配，推薦相關商品。                        |
    | **圖片辨識與搜尋**          | 將圖片轉成向量後進行相似圖片比對。                                     |
    | **欺詐偵測 / 異常偵測**     | 利用向量比對發現異常行為或交易。                                        |

- ## 延伸參考
	- [FAISS 官方 GitHub](https://github.com/facebookresearch/faiss)
	- [Pinecone](https://www.pinecone.io/)
	- [Weaviate](https://weaviate.io/)
	- [Milvus](https://milvus.io/)
