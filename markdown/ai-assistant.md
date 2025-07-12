
# AI 維運助手

本專案使用 AWS Bedrock + FastAPI + Dify Workflow 開發，具備自然語言輸入以下功能：

- 查詢 EC2 主機狀態
- 解析 CloudWatch Logs 並摘要
- 提供帳單費用即時查詢

## 架構說明

1. 使用 Claude 模型進行語意解析
2. 自動呼叫 API 工具處理請求
3. 將 JSON 結果轉換為清楚條列回覆

## 技術棧

- FastAPI / ShellScript / App Runner
- AWS Bedrock / CloudWatch / ECR

![images.png](../img/PINK_DINO.jpg)

   - ### set -o 功能 :

      ```bash
      set -o noclobber   # 禁止使用 > 覆寫檔案
      set -o ignoreeof   # 禁止 Ctrl+D 直接離開
      set -o errexit     # 指令錯誤即退出（同 set -e）
      ```