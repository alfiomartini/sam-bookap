import { DynamoDBClient} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBBookRepository } from "../../infrastructure/repositories/DynamoDBRepository";
import { GetBookByUseCase } from "../../application/usecases/GetBookByIdUseCase";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});
const repository = new DynamoDBBookRepository(client);
const getBookByIdUseCase = new GetBookByUseCase(repository);

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('AWS_REGION', process.env.AWS_REGION);
  const { id } = event.pathParameters || {};

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Book ID is required" }),
    };
  }

   

  try {
    
    const book = await getBookByIdUseCase.execute(id);
     
    if (!book) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Book not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(book)
    };
  } catch (error) {
    console.log('getBook error', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
