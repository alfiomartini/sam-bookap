import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});
const TABLE_NAME = process.env.TABLE_NAME || "";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('AWS_REGION', process.env.AWS_REGION);
  const { id } = event.pathParameters || {};
  const { title, author, year } = JSON.parse(event.body || "{}");

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Book ID is required" }),
    };
  }

  if (!title && !author && !year) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "At least one field (title, author, year) is required",
      }),
    };
  }

  // Construct the UpdateExpression dynamically
  let updateExpression = "set";
  const expressionAttributeNames: { [key: string]: string } = {};
  const expressionAttributeValues: { [key: string]: any } = {};

  if (title) {
    updateExpression += " #title = :title,";
    expressionAttributeNames["#title"] = "title";
    expressionAttributeValues[":title"] = title;
  }

  if (author) {
    updateExpression += " #author = :author,";
    expressionAttributeNames["#author"] = "author";
    expressionAttributeValues[":author"] = author;
  }

  if (year) {
    updateExpression += " #year = :year,";
    expressionAttributeNames["#year"] = "year";
    expressionAttributeValues[":year"] = year;
  }

  // Remove the trailing comma from the UpdateExpression
  updateExpression = updateExpression.slice(0, -1);

  const params = {
    TableName: TABLE_NAME,
    Key: marshall({ id }),
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: marshall(expressionAttributeValues),
    ReturnValues: "ALL_NEW" as const,
  };

  try {
    console.log('accessing dynamoDBClient');
    const { Attributes } = await client.send(new UpdateItemCommand(params));
    console.log('dynamicDBClient accessed');
    return { statusCode: 200, body: JSON.stringify(Attributes ? unmarshall(Attributes) : {}) };
  } catch (error) {
    console.log('updateBook error', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
