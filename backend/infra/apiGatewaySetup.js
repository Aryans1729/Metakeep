const AWS = require("aws-sdk");

const apiGateway = new AWS.APIGateway();

const params = {
  name: "PageLoadAPI",
  description: "API for tracking page loads",
  protocolType: "HTTP",
};

apiGateway.createApi(params, (err, data) => {
  if (err) console.error("Error creating API:", err);
  else console.log("API created successfully:", data);
});
