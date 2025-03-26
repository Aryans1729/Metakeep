const AWS = require("aws-sdk");


AWS.config.update({ region: "us-east-1" });
const dynamoDB = new AWS.DynamoDB();

const params = {
  TableName: "TelemetryData",
  KeySchema: [{ AttributeName: "minute", KeyType: "HASH" }],
  AttributeDefinitions: [{ AttributeName: "minute", AttributeType: "S" }],
  BillingMode: "PAY_PER_REQUEST", // Serverless pricing
};

// Create the table
dynamoDB.createTable(params, (err, data) => {
  if (err) console.error("Error creating table:", err);
  else console.log("Table created successfully:", data);
});
