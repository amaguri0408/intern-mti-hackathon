const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TableName = "Team1Group";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };
  
  //TODO: 取得対象のテーブル名をparamに宣言
  const param = {TableName};
    
  try {
    // dynamo.scan()で全件取得
    const groups = (await dynamo.scan(param).promise()).Items;
    
    // if(event.headers.authorization !== "mtiToken"){
    //   response.statusCode = 401;
    //   response.body = JSON.stringify({
    //   message: "認証されていません。HeaderにTokenを指定してください"
    //   });
    // }

    //TODO: レスポンスボディを設定する
    response.body = JSON.stringify({groups});
  } catch(e) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString()
    });
  }
  
  return response;
};