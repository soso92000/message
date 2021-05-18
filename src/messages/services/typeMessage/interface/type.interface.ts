import { Message } from "src/messages/entities/message.entity";

export interface IType {
    send(Message) : string;
}