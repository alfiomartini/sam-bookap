import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const dynamoDB = new DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || "us-east-1",
});
const TABLE_NAME = process.env.TABLE_NAME || "";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { bookId } = event.pathParameters || {};

  console.log('bookId, tableName', bookId, TABLE_NAME);
  if (!bookId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Book ID is required" }),
    };
  }

  const params = {
    TableName: TABLE_NAME,
    Key: {
      bookId,
    },
  };

  try {
    const { Item } = await dynamoDB.get(params).promise();
    if (!Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Book not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(Item),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
