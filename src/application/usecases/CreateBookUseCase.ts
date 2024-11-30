import { Book } from "../../domain/entities/Book";
import { BookRepository } from "../../domain/repositories/BookRepository";

export class CreateBookUseCase {
  private bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(book: Book): Promise<Book | null> {
    return this.bookRepository.createBook(book);
  }
}
