const { DynamoDBClient, PutItemCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");

const dynamoDb = new DynamoDBClient({ region: "us-east-1" });

// Function to get the current timestamp (rounded to the nearest minute)
const getCurrentTimestamp = () => {
    const date = new Date();
    date.setSeconds(0, 0); // Round down to nearest minute
    return date.toISOString();
};

exports.handler = async (event) => {
    const timestamp = getCurrentTimestamp();

    try {
        // Store raw event data
        const putParams = {
            TableName: "TelemetryData",
            Item: {
                timestamp: { S: new Date().toISOString() },
                event: { S: JSON.stringify(event) },
            },
        };
        await dynamoDb.send(new PutItemCommand(putParams));

        // Increment page load count
        const updateParams = {
            TableName: "TelemetryData",
            Key: { timestamp: { S: timestamp } },
            UpdateExpression: "ADD count :incr",
            ExpressionAttributeValues: { ":incr": { N: "1" } },
            ReturnValues: "UPDATED_NEW",
        };
        await dynamoDb.send(new UpdateItemCommand(updateParams));

        return { statusCode: 200, body: JSON.stringify({ message: "Data stored and page load recorded successfully!" }) };
    } catch (error) {
        console.error("Error storing data:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Error storing data" }) };
    }
};
