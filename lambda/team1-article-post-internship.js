const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  const {userId, text} = JSON.parse(event.body);
  
  const timestamp = Date.now();
  const getGroupIdParam = {
    TableName: "Team1User",
    Key: {
      userId,
    }
  };
  
  try{
    let user =  (await dynamo.get(getGroupIdParam).promise()).Item;
    
    const putParam = {
      TableName: "Team1Article",
      Item: {
        articleId: AWS.util.uuid.v4(),
        groupId: user.groupId,
        userId,
        text,
        timestamp,
      }
    };
    
    
    try {
      await dynamo.put(putParam).promise();
      response.statusCode = 201;
      const rbody = {
        groupId: user.groupId,
        userId,
        text,
        timestamp
      };
      response.body = JSON.stringify(rbody);
    } catch (e) {
       response.statusCode = 500;
      response.body = JSON.stringify({
        message: "予期せぬエラーが発生しました。",
        errorDetail: e.toString()
      });
    }
    
    
    
  }catch(e){
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString()
    });
  }
  
  return response;
}
