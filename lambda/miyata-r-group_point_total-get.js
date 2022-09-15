const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TableName = "Team1GroupPoint";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };
  

  const groupId = event.queryStringParameters?.groupId;
  
  // TODO: DBに登録するための情報をparamオブジェクトとして宣言する（中身を記述）
  let param = {
    TableName,
    Limit: 100,
    FilterExpression: "groupId = :gid",
    ExpressionAttributeValues: {
      ":gid": groupId,
    },
  }
  
  
  try{
    // dynamo.put()でDBにデータを登録
    const res = (await dynamo.scan(param).promise()).Items;
    // TODO: 登録に成功した場合の処理を記載する。(status codeの設定と、response bodyの設定)
    
    let total;
    if (res.length == 0) {
      total = 0
    } else {
      const tmp = res.map((x) => {return x.point})
      total = tmp.reduce((x, y) => {return x + y})
    }
    response.body = JSON.stringify({userPoint: total});
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
