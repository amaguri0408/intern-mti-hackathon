const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TableName = "User";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  const {userId, text, category} = JSON.parse(event.body);
  
  const timestamp = Date.now()
  const param = { TableName };
  
  try{
    await dynamo.get(param).promise();
    // TODO: 登録に成功した場合の処理を記載する。(status codeの設定と、response bodyの設定)
    response.statusCode = 201;
    const rbody = {
      userId,
      text,
      category,
      timestamp
    };
    response.body = JSON.stringify(rbody);
  }catch(e){
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString()
    });
  }
  
  return response;
}
