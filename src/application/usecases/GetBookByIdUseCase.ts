import { Book } from "../../domain/entities/Book";
import { BookRepository } from "../../domain/repositories/BookRepository";

export class GetBookByUseCase {
  private bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(id: string): Promise<Book | null> {
    // any error thrown by bookRepository.getBookById will be caught by the handler
    return this.bookRepository.getBookById(id);
  }
}
