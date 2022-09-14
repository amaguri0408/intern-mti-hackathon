const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TableName = "Team1User";

exports.handler = async (event, context) => {
  //レスポンスの雛形
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  const {userId, groupId} = JSON.parse(event.body);

  if (!userId || !groupId) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      messege: "無効なリクエストです．request bodyに必須パラメータがセットされていません．",
    })
    return response;
  }

  //TODO: 取得対象のテーブル名と検索に使うキーをparamに宣言
  const param = {TableName, Key: {userId}};
  
  try{
    // dynamo.get()でDBからデータを取得
    let user = (await dynamo.get(param).promise()).Item;
    
    // グループidを加えて上書きする
    user.groupId = groupId
    const param2 = {
      TableName,
      Item: user
    }
    let res = (await dynamo.put(param2).promise());
    delete user.password
    response.body = JSON.stringify(user);
  }catch(e){
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString()
    });
  }
  
  return response;
};