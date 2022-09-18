const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TableName = "Team1UserPoint";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  const {userId, trainingHistoryId, point} = JSON.parse(event.body);
  
  const userPointId = AWS.util.uuid.v4();
  const timestamp = Date.now();
  const param = {
    TableName,
    Item: {
      userPointId,
      userId,
      trainingHistoryId,
      point,
      timestamp,
    }
  };
  
  try{
    await dynamo.put(param).promise();
    // TODO: 登録に成功した場合の処理を記載する。(status codeの設定と、response bodyの設定)
    response.statusCode = 201;
    const rbody = {
      userPointId,
      userId,
      trainingHistoryId,
      point,
      timestamp,
    };
    response.body = JSON.stringify(rbody);
    
    // ユーザのgroupIdを取得
    const param3 = {
      TableName: "Team1User",
      Key: {
        userId
      }
    }
    const user = (await dynamo.get(param3).promise()).Item;
    const groupId = user.groupId;
    // GroupPointテーブルにも登録
    const groupPointId = AWS.util.uuid.v4();
    const param2 = {
      TableName: "Team1GroupPoint",
      Item: {
        groupPointId,
        groupId,
        trainingHistoryId,
        userId,
        point,
        timestamp
      }
    }
    await dynamo.put(param2).promise();
    
  }catch(e){
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString()
    });
  }
  
  return response;
}
