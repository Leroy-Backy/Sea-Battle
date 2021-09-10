export class ChatMessage {
  user: string;
  message: string;
  image!: string;

  constructor(user: string, message: string) {
    this.user = user;
    this.message = message;
  }
}
