const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TableName = "Team1MealHistory";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };
  

  const userId = event.queryStringParameters?.userId;
  const start = event.queryStringParameters?.start;
  const end = event.queryStringParameters?.end;
  
  // TODO: DBに登録するための情報をparamオブジェクトとして宣言する（中身を記述）
  let param = {
    TableName,
    Limit: 100,
    FilterExpression: "userId = :uid",
    ExpressionAttributeValues: {
      ":uid": userId,
    },
  }
  
  if (start || end){
    param.ExpressionAttributeNames = {};
    param.ExpressionAttributeNames["#ts"] = "timestamp";
  }
  if (start && end){
    param.FilterExpression += " AND #ts BETWEEN :str AND :end";
    param.ExpressionAttributeValues[":str"] = parseInt(start);
    param.ExpressionAttributeValues[":end"] = parseInt(end);
  } else if (start) {
    param.FilterExpression += " AND #ts >= :str";
    param.ExpressionAttributeValues[":str"] = parseInt(start);
  } else if (end) {
    param.FilterExpression += " AND #ts <= :end";
    param.ExpressionAttributeValues[":end"] = parseInt(end);
  }
  
  
  
  try{
    // dynamo.put()でDBにデータを登録
    const res = (await dynamo.scan(param).promise()).Items;
    // TODO: 登録に成功した場合の処理を記載する。(status codeの設定と、response bodyの設定)
    // const token = "mtiToken"
    response.body = JSON.stringify({mealHistories: res});
  }catch(e){
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      param,
      errorDetail: e.toString()
    });
  }
  
  return response;
}
