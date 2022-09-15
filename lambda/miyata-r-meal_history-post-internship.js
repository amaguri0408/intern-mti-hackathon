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

  // TODO: リクエストボディの中身をJavaScriptオブジェクトに変換し、1つ、あるいは複数の変数に代入する
  const mealHistoryId = AWS.util.uuid.v4();
  const params = JSON.parse(event.body);
  const userId = params.userId;
  const timestamp = Date.now();
  // TODO: DBに登録するための情報をparamオブジェクトとして宣言する（中身を記述）
  const param = {
    TableName, 
    "Item": {
      mealHistoryId,
      userId,
      timestamp
    }
  };
  
  try{
    // dynamo.put()でDBにデータを登録
    await dynamo.put(param).promise();
    // TODO: 登録に成功した場合の処理を記載する。(status codeの設定と、response bodyの設定)
    // const token = "mtiToken"
    response.statusCode = 201;
    response.body = JSON.stringify({mealHistoryId, userId, timestamp});
  }catch(e){
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString()
    });
  }
  console.log(response);
  
  return response;
}
