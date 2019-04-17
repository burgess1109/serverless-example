# serverless-example
近期因工作需求接觸了[serverless framework](https://serverless.com/framework/)，記錄一下心得感想。

Serverless 架構流行了一陣子了，以 function 為單位，讓開發者專注於程式開發，無需擔心維護 server 問題。這使許多雲端服務商推出 serverless 服務，如 AWS Lambda 及 Google Cloud Function。

那如何快速部署 serverless applications 呢？以 AWS 為例，可以透過 console 介面，上傳打包的檔案，但身為工程師，這手動化更新的過程實在難以接受。

另一個方式是透過 AWS CloudFormation，但目前無法支援打包 Lambda code 上傳 S3，所以必須自行找工具將 Lambda 打包上傳 S3，再撰寫 CloudFormation template 把其他相應的服務部署到 AWS 上。

AWS CloudFormation 過程聽起來很複雜，有沒有更簡單的方式部署程式呢？就是這 repo 使用的 serverless framework，只需要一行指令就能把 Lambda, API GateWay, DynamoDB‎ ... 等服務部署到 AWS。當然不止 AWS, serverless framework 也支援 Google Cloud, MicroSoft Azure, IBM Cloud 等等雲端服務商的部署。

本篇範例使用 API Gateway 建立一個 message 的 RESTful API，並透過 Lambda Function 對 DynamoDB‎ 進行 CRUD，Lambda 則是用 Node.js 編寫，完全不需要使用到 EC2 instance。

## 使用方式

- 下載專案
```
git clone https://github.com/burgess1109/serverless-example.git
```

- 安裝 lib
```
yarn update
```

- 修改 config
```
cp config.example.yml config.{YourStageName}.yml
```

更改 config.{YourStageName}.yml `CORS` 及 `API_KEY` 設定


- 部署

note : 請先設定好 AWS User 在 credentials 的 aws_access_key_id, aws_secret_access_key，該帳號必須具備部署需要的權限

```
yarn sls deploy --stage {YourStageName}
```

若有自行設定 AWS profile，可透過 `--aws-profile` 指定
```
yarn sls deploy --stage {YourStageName} --aws-profile {YourProfile}
```

部署成功會出現 Service Information


![圖示說明](https://github.com/burgess1109/serverless-example/blob/master/example1.png) 

顯示部署的 region, CloudFormation stack name, API Gateway api key & 各個 end points 以及 Lambda function name...等訊息。
實際到 AWS 後台，可看到 serverless framework 部署在 S3, CloudFormation, API Gateway, Lambda, DynamoDB‎ 的服務，這時就能透過 endpoints 去執行 CRUD，因為有設定 api key，所以 要在 header 加入 `x-api-key`, 值為 ServerlessFrameworkExample 產生的內容。


若要調整相關服務設定，請務必從 serverless.yml 調整後再 deploy，勿自行到後台 console 介面設定

- 移除

移除相關部署只需要執行

```
yarn sls remove --stage {YourStageName}
```
or

```
yarn sls deploy --stage {YourStageName} --aws-profile {YourProfile}
```

## 關於 serverless.yml

能快速部署的關鍵在於 serverless.yml，只要撰寫好 serverless.yml，serverless framework 就能幫助我們輕鬆部署。在撰寫 serverless.yml 前需先了解 [Variables](https://serverless.com/framework/docs/providers/aws/guide/variables) 和 [AWS CloudFormation Intrinsic Function](https://docs.aws.amazon.com/en_us/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html) 使用方式。

在執行 `sls deploy` 後，serverless framework 會將 serverless.yml 轉換成 CloudFormation template (JSON)，並且將 lambda 打包成 .zip 檔，相關檔案會放在 .serverless 資料夾下。接著會將相關檔案上傳到 AWS S3，建立 CloudFormation stack，並執行 CloudFormation template 設定的內容。

## Plugin

為支援縱多的 AWS 服務，serverless framework 發展出許許多多 Plugin，以下推薦兩個常用的:

- [serverless-finch](https://github.com/fernando-mc/serverless-finch): serverless-finch 可以幫助我們把靜態檔部署到 S3 Bucket 上，例如將前端檔案部署至 S3。

- [serverless-appsync-plugin](https://github.com/sid88in/serverless-appsync-plugin): AWS 提供的 GraphQL Server，如果前端厭倦了 RESTful 在同一頁面需多次發起 request，可以嘗試看看自由度更高的 GraphQL，且 AWS AppSync 後端可以整合 dynamoDB, Relational Database, ElasticSearch, Lambda 或其他 http end point，透過 plugin 讓部署變得更簡易。

## Cloud Front

實作過程中，由於後端的 API Gateway 會產生一組 domain，前端部署到 S3 則會有另一個 domain，這時推薦使用 Cloud Front 將前後端 domain 連結在一起。
