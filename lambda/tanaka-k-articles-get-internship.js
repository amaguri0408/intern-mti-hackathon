const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TableName = "Article";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };
  
  //TODO: 取得対象のテーブル名をparamに宣言
  const param = {
    TableName,
  };
  
    
  try{
    // dynamo.scan()で全件取得
    const articles = (await dynamo.scan(param).promise()).Items;
    
    if(event.headers.authorization !== "mtiToken"){
      response.statusCode = 401;
      response.body = JSON.stringify({
      message: "認証されていません。HeaderにTokenを指定してください"
      });
    }

    //TODO: レスポンスボディを設定する
    response.statusCode = 201;
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
