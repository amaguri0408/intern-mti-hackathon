const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const TableName = "Article";

function parameter(userId, start, end, category) {
  var value = "";
  
  let param = {
    TableName,
    "Limit": 100,
    KeyConditionExpression: "userId = :uid",
    // FilterExpression: value,
    ExpressionAttributeValues: {
      ":uid": userId
    },
    ExpressionAttributeNames: {
      "#ts": "timestamp"
    }
  };
  if(category){
    // param.FilterExpression.push("category = :ctg");
    value += "category = :ctg";
    param.ExpressionAttributeValues[":ctg"] = category;
    param.FilterExpression = "category = :ctg";
    param.ExpressionAttributeNames["#ts"] = "timestamp";
    if(start && end){
      param.KeyConditionExpression += " AND #ts BETWEEN :str AND :end";
      param.ExpressionAttributeValues[":str"] = parseInt(start);
      param.ExpressionAttributeValues[":end"] = parseInt(end);
    }
    else if(start){
      param.KeyConditionExpression += " AND #ts >= :str";
      param.ExpressionAttributeValues[":str"] = parseInt(start);
    }
    else if(end){
      param.KeyConditionExpression += " AND #ts <= :end";
      param.ExpressionAttributeValues[":end"] = parseInt(end);
    }
  }
  else {
    param.ExpressionAttributeNames["#ts"] = "timestamp";
    if(start && end){
      param.KeyConditionExpression += " AND #ts BETWEEN :str AND :end";
      param.ExpressionAttributeValues[":str"] = parseInt(start);
      param.ExpressionAttributeValues[":end"] = parseInt(end);
    }
    else if(start){
      param.KeyConditionExpression += " AND #ts >= :str";
      param.ExpressionAttributeValues[":str"] = parseInt(start);
    }
    else if(end){
      param.KeyConditionExpression += " AND #ts <= :end";
      param.ExpressionAttributeValues[":end"] = parseInt(end);
    }
  }
  // param.FilterExpression = value;
  return param;
}

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };
  
  // const { userId, start, end, category} = event.queryStringParameters;
  const userId = event.queryStringParameters?.userId;
  const category = event.queryStringParameters?.category;
  const start = event.queryStringParameters?.start;
  const end = event.queryStringParameters?.end;
  //TODO: 取得対象のテーブル名をparamに宣言
  let param;
  
  
    
  try{
    if(event.headers.authorization !== "mtiToken"){
      response.statusCode = 401;
      response.body = JSON.stringify({
      message: "認証されていません。HeaderにTokenを指定してください"
      });
    }
    // dynamo.scan()で全件取得
    if(!userId){
      param = {
        TableName,
        "Limit":100
      };
      const articles = (await dynamo.scan(param).promise()).Items;
      articles.sort();
      articles.reverse();
      response.statusCode = 201;
      response.body = JSON.stringify(articles);
      console.log("all");
    }
    else if (!category && !start && !end) {
      param = {
        TableName,
        "Limit":100,
        KeyConditionExpression: "userId = :uid",
        ExpressionAttributeValues: {
          ":uid": userId,
        }
      };
      const filteredArticles = (await dynamo.query(param).promise()).Items;
      response.statusCode = 201;
      filteredArticles.sort();
      filteredArticles.reverse();
      response.body = JSON.stringify(filteredArticles);
      console.log("filterd");
    }
    else {
      param = parameter(userId, start, end, category);
      const filteredArticles = (await dynamo.query(param).promise()).Items;
      response.statusCode = 201;
      filteredArticles.sort();
      filteredArticles.reverse();
      response.body = JSON.stringify(filteredArticles);
      console.log("filterd");
    }
    
    // function condition(article) {
    //   if((this.userId === article.userId) && (this.start === "" || this.start <== article.timestamp) 
    //   && (this.end === "" || this.end >== article.timestamp) && (this.category === "" || this.category === article.category)){
    //     return true;
    //   }
    //   else return false;
    // }
    //TODO: レスポンスボディを設定する
    
  
    
    
  }catch(e){
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      key: param,
      errorDetail: e.toString()
    });
  }
  
  return response;
};
