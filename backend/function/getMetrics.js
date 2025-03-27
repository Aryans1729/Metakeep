const AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-1" });
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Get timestamp 60 minutes ago
function getPastHourTimestamps() {
  const timestamps = [];
  for (let i = 0; i < 60; i++) {
    const date = new Date();
    date.setMinutes(date.getMinutes() - i, 0, 0);
    timestamps.push(date.toISOString().slice(0, 16)); // "YYYY-MM-DDTHH:MM"
  }
  return timestamps;
}

export const handler = async () => {
  try {
    const timestamps = getPastHourTimestamps();
    const data = await Promise.all(
      timestamps.map(async (minute) => {
        const result = await dynamoDB.get({
          TableName: "TelemetryData",
          Key: { minute },
        }).promise();
        return { minute, count: result.Item?.count || 0 };
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
  }
};
