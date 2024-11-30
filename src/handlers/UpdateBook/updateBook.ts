import { DynamoDBClient} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBBookRepository } from "../../infrastructure/repositories/DynamoDBRepository";
import { UpdateBookByIdUseCase } from "../../application/usecases/UpdateBookByIdUseCase";
import { UpdateBook, Book} from "../../domain/entities/Book";


const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});
const TABLE_NAME = process.env.TABLE_NAME || "";

const bookRepository = new DynamoDBBookRepository(client);
const updateBookByIdUseCase = new UpdateBookByIdUseCase(bookRepository);

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('AWS_REGION', process.env.AWS_REGION);
  const { id } = event.pathParameters || {};
  const book = JSON.parse(event.body || "{}") as UpdateBook;
  const {title, author, year} = book;

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

  
  try {
    const updatedBook:Book | null = await updateBookByIdUseCase.execute(id, book);
    if (!updatedBook) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Book not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(updatedBook),
    }
  } catch (error) {
    console.log('updateBook error', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
