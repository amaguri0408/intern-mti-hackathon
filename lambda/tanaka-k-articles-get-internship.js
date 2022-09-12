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
  
  // const { userId, start, end, category} = event.queryStringParameters;
  const userId = event.queryStringParameters?.userId;
  const category = event.queryStringParameters?.category;
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
      response.statusCode = 201;
      response.body = JSON.stringify(articles);
      console.log("all");
    }
    else {
      param = {
        TableName,
        "Limit":100,
        KeyConditionExpression: "userId = :uid",
        FilterExpression: "category = :ctg",
        // FilterExpression: {
        //   "start <= :time",
        //   end >= :time",
        //   "category = :cat"
        // }
        ExpressionAttributeValues: {
          ":uid": userId,
          ":ctg": category
        }
      };
      const filteredArticles = (await dynamo.query(param).promise()).Items;
      response.statusCode = 201;
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
      errorDetail: e.toString()
    });
  }
  
  return response;
};
