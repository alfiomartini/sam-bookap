import { DynamoDBClient} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { CreateBookUseCase } from "../../application/usecases/CreateBookUseCase";
import { Book} from "../../domain/entities/Book";
import { DynamoDBBookRepository } from "../../infrastructure/repositories/DynamoDBRepository";

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});

const repository = new DynamoDBBookRepository(dynamoDBClient);
const createBookUseCase = new CreateBookUseCase(repository);

const TABLE_NAME = process.env.TABLE_NAME || "";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('AWS_REGION', process.env.AWS_REGION);

  const { title, author, year } = JSON.parse(event.body || "{}") ;

  const id = uuidv4();

  if (!title || !author || !year) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Book title, author and year are needed",
      }),
    };
  }
  const createBook = { id, title, author, year } as Book;
   

  try {
    const createdBook = await createBookUseCase.execute(createBook);
    console.log('createBook handler createdBook', createdBook);
    if (!createdBook) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal Server Error" }),
      };
    } 

    return {
      statusCode: 201,
      body: JSON.stringify(createdBook),
    }
  } catch (error) {
    console.log('createBook Error', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
