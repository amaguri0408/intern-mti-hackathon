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
  
  const mealHistoryId = event.queryStringParameters?.mealHistoryId;
  
  // TODO: DBに登録するための情報をparamオブジェクトとして宣言する（中身を記述）
  let param = {
    TableName,
    Key: {mealHistoryId}
  }
  try{
    // dynamo.put()でDBにデータを登録
    const res = (await dynamo.delete(param).promise()).Items;
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
