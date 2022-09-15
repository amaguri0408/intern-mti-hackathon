const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TableName = "Team1TrainingHistory";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };
  
  const trainingHistoryId = AWS.util.uuid.v4();
  const userId = JSON.parse(event.body).userId;
  const timestamp = Date.now();

  const param = {
    TableName, 
    "Item": {
      trainingHistoryId,
      userId,
      timestamp
    }
  };
  
  try{
    await dynamo.put(param).promise();
    // const token = "mtiToken"
    response.statusCode = 201;
    response.body = JSON.stringify({trainingHistoryId, userId, timestamp});
  }catch(e){
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString()
    });
  }
  
  return response;
};