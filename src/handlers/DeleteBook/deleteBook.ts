import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBBookRepository } from "../../infrastructure/repositories/DynamoDBRepository";
import { DeleteBookByIdUseCase } from "../../application/usecases/DeleteBookByIdUseCase";

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1",
})

const repository = new DynamoDBBookRepository(client);
const deleteBookByIdUseCase = new DeleteBookByIdUseCase(repository);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('AWS_REGION', process.env.AWS_REGION);
  const { id } = event.pathParameters || {};

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Book ID is required" }),
    };
  }

  try {
    const isDeleted = await deleteBookByIdUseCase.execute(id);

    if (!isDeleted) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Book not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Book deleted successfully" }),
    };
  } catch (error) {
    console.log('deleteBook error', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
}