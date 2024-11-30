import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  PutItemCommandInput,
  PutItemCommand,
  UpdateItemCommand,
  UpdateItemCommandInput,
  DeleteItemCommandInput,
  DeleteItemCommand,
  DeleteResourcePolicyCommandOutput,
  DeleteItemCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Book, UpdateBook } from "../../domain/entities/Book";
import { BookRepository } from "../../domain/repositories/BookRepository";

const TABLE_NAME = process.env.TABLE_NAME || "";

export class DynamoDBBookRepository implements BookRepository {
  private client: DynamoDBClient;

  constructor(client: DynamoDBClient) {
    this.client = client;
  }

  async getBookById(id: string): Promise<Book | null> {
    const params: GetItemCommandInput = {
      TableName: TABLE_NAME,
      Key: marshall({ id }),
    };

    try {
      const { Item } = await this.client.send(new GetItemCommand(params));
      console.log("getBookById Item", Item);

      if (!Item) {
        return null;
      }

      return unmarshall(Item) as Book;
    } catch (error) {
      console.log("getBook error", error);
      throw new Error("Internal Server Error - getBook");
    }
  }

  async updateBookById(id: string, book: UpdateBook): Promise<Book | null> {
    const { author, title, year } = book;

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

    const params: UpdateItemCommandInput = {
      TableName: TABLE_NAME,
      Key: marshall({ id }),
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: marshall(expressionAttributeValues),
      ReturnValues: "ALL_NEW" as const,
    };

    try {
      const { Attributes } = await this.client.send(
        new UpdateItemCommand(params)
      );
      console.log("updateBook Attributes", Attributes);
      if (!Attributes) {
        return null;
      }

      const book = unmarshall(Attributes) as Book;
      return book;
    } catch (error) {
      console.log("updateBook error", error);
      throw new Error("Internal Server Error - updateBook");
    }
  }

  async createBook(book: Book): Promise<Book | null> {
    const params: PutItemCommandInput = {
      TableName: TABLE_NAME,
      Item: marshall(book),
    };

    try {
      const createdItem = await this.client.send(new PutItemCommand(params));
      console.log("createBook createdItem", createdItem);
      if (!createdItem) {
        return null;
      }
      const createdBook = book;
      return createdBook;
    } catch (error) {
      console.log("createBook Error", error);
      throw new Error("Internal Server Error - createBook");
    }
  }

  async deleteBookById(id: string): Promise<boolean> {
    const params: DeleteItemCommandInput = {
      TableName: TABLE_NAME,
      Key: marshall({ id }),
      ReturnValues: "ALL_OLD" as const,
    };

    try {
      const success: DeleteItemCommandOutput = await this.client.send(
        new DeleteItemCommand(params)
      );
      console.log("deleteBookById success", success);
      if (!success.Attributes) {
        console.log("Deletion not successful");
        return false;
      }

      return true;
    } catch (error) {
      console.log("deleteBook error", error);
      throw new Error("Internal Server Error - deleteBook");
    }
  }
}
