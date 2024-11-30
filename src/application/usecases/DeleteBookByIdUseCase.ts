import { BookRepository } from "../../domain/repositories/BookRepository";

export class DeleteBookByIdUseCase {
  private bookRepository: BookRepository;

  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(id: string): Promise<boolean> {
    return this.bookRepository.deleteBookById(id);
  }
}
