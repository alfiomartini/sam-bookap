import { Book, UpdateBook } from "../entities/Book";

export interface BookRepository {
  getBookById(id: string): Promise<Book | null>;
  updateBookById(id: string, book: UpdateBook): Promise<Book | null>;
  createBook(book: Book): Promise<Book | null>;
  deleteBookById(id: string): Promise<boolean>;
}
