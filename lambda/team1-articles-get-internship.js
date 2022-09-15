const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TableName = "Team1Article";

exports.handler = async (event, context) => {
  //レスポンスの雛形
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  const groupId = event.queryStringParameters.groupId;

  //TODO: 取得対象のテーブル名と検索に使うキーをparamに宣言
  const param = {
    TableName,
    //プライマリーキー以外の属性でのフィルタ
    FilterExpression: "groupId = :gId",
    //検索値のプレースホルダの定義
    ExpressionAttributeValues: {
      ":gId": groupId,
    },
  };
  
  try{
    // dynamo.get()でDBからデータを取得
    let articles =  (await dynamo.scan(param).promise()).Items;
    
    //TODO: レスポンスボディに取得したUserの情報を設定する
    response.body = JSON.stringify(articles);
  
  }catch(e){
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString()
    });
  }
  
  return response;
};