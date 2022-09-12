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

  if (event.headers.authorization !== "mti-Token") {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "認証に失敗しました。"
    });
  }

  const body = event.body ? JSON.parse(event.body) : null;
  if (!body || !body.userId || !body.timestamp) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "無効なリクエストです。"
    });
    return response;
  }

  const userId = body.userId;
  const timestamp = body.timestamp;
  const param = {
    TableName,
    Key: {
      userId,
      timestamp
    }
  };

 try{
    await dynamo.delete(param).promise();
    response.statusCode = 204;
  
  } catch(e) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString()
    });
  }
  
  return response;
};