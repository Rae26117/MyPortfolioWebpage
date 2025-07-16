## 目標
- 使用AWS Organization 與 IAM Identity Center建立共用專案環境，管理組員權限,並盡量遵守最小權限原則。
- ![image.png](./img/image_1752684178873_0.png)
- [[draws/2025-06-13-17-39-30.excalidraw]]
- AWS Organizations
	- 1.AWS Organizations > Organizationnal unit > Create new
		- ![image.png](./img/image_1749815447172_0.png){:height 461, :width 780}
	- 2.Add an AWS account > 新增一個專屬專案的帳號 > 並移動到指定的 Organizationnal unit
		- ![截圖 2025-06-13 晚上7.51.22.png](./img/截圖_2025-06-13_晚上7.51.22_1749815536430_0.png)
		- ![image.png](./img/image_1749815641843_0.png)
		- ![image.png](./img/image_1749963478619_0.png)
- IAM identity Center
	- 1.Group > Create Groups (建立群組)<--- 根據需求建立群組
		- ![image.png](./img/image_1749815803210_0.png)
	- 2.User > Add user (新增使用者)<---根據需求新增使用者
		- ![image.png](./img/image_1749815876956_0.png)
	- 3.Permission sets > Create permission set (新增許可設定) <--- 根據需求設定
		- ![image.png](./img/image_1749816164578_0.png)
		- ![image.png](./img/image_1749816705909_0.png)
		- ![image.png](./img/image_1749816782137_0.png)
		- 勾選會使用的Policy
			- AmazonBedrockFullAccess
			  Provides full access to Amazon Bedrock as well as limited access to related services that are required by it
			- AmazonConnect_FullAccess
			  The purpose of this policy is to grant permissions to AWS Connect users required to use Connect resources. This policy provides full access to AWS Connect resources via the Connect Console and public APIs
			- AmazonEC2FullAccess
			  Provides full access to Amazon EC2 via the AWS Management Console.
			- AmazonS3FullAccess
			  Provides full access to all buckets via the AWS Management Console.
			- AmazonVPCFullAccess
			  Provides full access to Amazon VPC via the AWS Management Console.
			- AWSAppRunnerFullAccess
			  Grants permissions to all App Runner actions.
			- AWSBillingReadOnlyAccess
			  Allows users to view bills on the Billing Console.
			- CloudWatchActionsEC2Access
			  Provides read-only access to CloudWatch alarms and metrics as well as EC2 metadata. Provides access to Stop, Terminate and Reboot EC2 instances.
			- CloudWatchFullAccessV2
			  Provides full access to CloudWatch.
			- IAMFullAccess
			  Provides full access to IAM via the AWS Management Console.
		- 檢查Permission set
			- ![image.png](./img/image_1749964949052_0.png)
			- ![image.png](./img/image_1749816584992_0.png)
	- 4. AWS account > 選擇專案帳號 > Assign user or group
		- ![image.png](./img/image_1749964403638_0.png)
		- ![image.png](./img/image_1749965216972_0.png)
		- ![image.png](./img/image_1749965374407_0.png)
		- ![image.png](./img/image_1749965307088_0.png)
