const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TableName = "Team1GroupPoint";

exports.handler = async (event, context) => {
  //レスポンスの雛形
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  const groupId = event.queryStringParameters.groupId;

  //TODO: 取得対象のテーブル名と検索に使うキーをparamに宣言
  const param = {
    TableName,
    // //プライマリーキー以外の属性でのフィルタ
    // FilterExpression: "groupId = :gId",
    // //検索値のプレースホルダの定義
    // ExpressionAttributeValues: {
    //   ":gId": groupId,
    // },
  };
  
  let totalPoint = 0;

  
  try{
    // dynamo.get()でDBからデータを取得
    let pointList =  (await dynamo.scan(param).promise()).Items;
    
    const groupBy = pointList.reduce((result, current) => {
      const element = result.find(point => point.group === current.groupId);
      
      if (current.groupId == groupId){
        totalPoint += current.point
      }
  
      if (element) {
      	//ある時（下記、初期データを操作）
          element.point += current.point;
      } else {
      	//無いとき（新規に初期データを作成）
      	
          result.push({
              group: current.groupId,
              point: current.point,
          });
      }
      return result;
      
    }, []); //初期値は[]
    
    const sorted = groupBy.sort((prev, current) => prev.point < current.point ? 1 : -1);
    let rank = sorted.findIndex(({group}) => group === groupId) + 1;
    
    let getParam = {
     TableName: "Team1Group",
      Key: {
        groupId,
      }
    };
    
    let body = {};
    
    try{
      let group =  (await dynamo.get(getParam).promise()).Item;
  
      body = {
        groupname: group.name,
        rank: rank,
        totalPoint: totalPoint
      };
      /* code */
    } catch (e) {
      response.statusCode = 500;
      response.body = JSON.stringify({
        message: "予期せぬエラーが発生しました。",
        errorDetail: e.toString()
      });
    }
    //TODO: レスポンスボディに取得したUserの情報を設定する
    response.body = JSON.stringify(body);
  
  }catch(e){
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString()
    });
  }
  
  return response;
};