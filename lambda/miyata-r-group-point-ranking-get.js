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
  
  const param = {TableName};
    
  try {
    const groupPointRecords = (await dynamo.scan(param).promise()).Items;
    
    // if(event.headers.authorization !== "mtiToken"){
    //   response.statusCode = 401;
    //   response.body = JSON.stringify({
    //   message: "認証されていません。HeaderにTokenを指定してください"
    //   });
    // }
    
    let groupPoints = {};
    groupPointRecords.forEach((record) => {
      const groupId = record.groupId;
      const point = parseInt(record.point);
      if (groupId in groupPoints) {
        groupPoints[groupId] = parseInt(groupPoints[groupId]) + point;
      } else {
        groupPoints[groupId] = point;
      }
    });
    
    let points = Object.entries(groupPoints);
    points.sort((p1, p2) => {
      let p1Val = p1[1], p2Val = p2[1];
      return p2Val - p1Val;
    });
    
    
    let getParam = { TableName: "Team1Group" };
    
    let groups = (await dynamo.scan(getParam).promise()).Items;
    let groupNames = {};
    groups.forEach((group) => {
      const name = group.name;
      const groupId = group.groupId;
      groupNames[groupId] = name;
    });
    
    let groupRanking = [];
    points.forEach((point, index) => {
      var group = {
        "groupId": point[0],
        "groupname": groupNames[point[0]],
        "rank": index + 1,
        "totalPoint": point[1]
      };
      const prePoint = groupRanking.slice(-1)[0]
      // console.log(group, prePoint)
      if (groupRanking.length !== 0 && group.totalPoint === prePoint.totalPoint){
        group.rank = prePoint.rank
      }
      groupRanking.push(group);
    });
    response.body = JSON.stringify({ groupRanking });
    
  } catch(e) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString()
    });
  }
  
  return response;
};