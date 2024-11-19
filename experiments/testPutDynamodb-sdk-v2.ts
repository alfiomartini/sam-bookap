import { DynamoDB } from "aws-sdk";

const dynamoDB = new DynamoDB.DocumentClient({ region: "us-east-1" });
const params = {
  TableName: "BooksTable",
  Item: { id: "1", title: "Test Book", author: "Author", year: 2024 },
};

dynamoDB
  .put(params)
  .promise()
  .then((data) => console.log("Success:", data))
  .catch((err) => console.error("Error:", err));
