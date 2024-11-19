import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";

// Initialize DynamoDB Client
const client = new DynamoDBClient({ region: "us-east-1" });

// Define the parameters for the put operation
const params = {
  TableName: "BooksTable",
  Item: {
    id: { S: "2" },
    title: { S: "Test Book 2" },
    author: { S: "Author" },
    year: { N: "2024" },
  },
};

// Execute the putItem command
async function testPutItem() {
  try {
    const data = await client.send(new PutItemCommand(params));
    console.log("Success:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

// Run the function
testPutItem();
