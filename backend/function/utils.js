const AWS = require("aws-sdk");

// Configure AWS
AWS.config.update({ region: "us-east-1" });
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Get the current timestamp rounded to the nearest minute
function getCurrentTimestamp() {
  const date = new Date();
  date.setSeconds(0, 0); // Round to the nearest minute
  return date.toISOString();
}

module.exports = { dynamoDB, getCurrentTimestamp };
