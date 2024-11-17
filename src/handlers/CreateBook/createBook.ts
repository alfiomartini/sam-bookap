import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";

const dynamoDB = new DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || "us-east-1",
});
const TABLE_NAME = process.env.TABLE_NAME || "";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { title, author, year } = JSON.parse(event.body || "{}");
  const id = uuidv4();

  if (!title || !author || !year) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Book title, author and year are needed",
      }),
    };
  }
  console.log('body', title, author, year);
  const params = {
    TableName: TABLE_NAME,
    Item: { id, title, author, year },
  };

  try {
    console.log('params', params);
    await dynamoDB.put(params).promise();
    console.log('accessed dynamoDB');
    return { statusCode: 201, body: JSON.stringify({ id, title, author, year }) };
  } catch (error) {
    console.log('Error', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
