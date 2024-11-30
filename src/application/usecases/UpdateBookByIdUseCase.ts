import { BookRepository } from "../../domain/repositories/BookRepository";
import { Book, UpdateBook } from "../../domain/entities/Book";

export class UpdateBookByIdUseCase {
  private bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(id: string, book: UpdateBook): Promise<Book | null> {
    // any error thrown by bookRepository.UpdateBook will be caught by the handler
    return this.bookRepository.updateBookById(id, book);
  }
}
