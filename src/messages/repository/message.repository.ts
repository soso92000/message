import { Repository, EntityRepository, Transaction, TransactionManager, EntityManager, getConnection } from 'typeorm';
import { Message } from '../entities/message.entity';

@EntityRepository(Message)
export class MessageRepository extends Repository<Message> {
    async findAllMessagesReceived(user, orderby = 'DESC') : Promise<Message[]> {
        return this.find({ where: { to: user, deleted:false }, order: { createdAt: orderby.toUpperCase() === 'DESC' ? 'DESC' : 'ASC' }});
    }

    async findAllMessagesSend(user, orderby = 'DESC') : Promise<Message[]> {
        return this.find({ where: { from: user }, order: { createdAt: orderby.toUpperCase() === 'DESC' ? 'DESC' : 'ASC' }});
    }

    async findAllDeletedMessage(user, orderby: string = 'DESC') : Promise<Message[]>{
        return this.find({ where: { to: user, deleted:true }, order: { createdAt: orderby.toUpperCase() === 'DESC' ? 'DESC' : 'ASC' } });
    }

    async reply(messageFrom: Message, messageText: string) {
        const newMessage = await this.create({ from: messageFrom.to, to: messageFrom.from, type: messageFrom.type, message: messageText, parentMessage: messageFrom });
        return getConnection().transaction(async transactionEntityManaget => {
                const replyMessage = await transactionEntityManaget.save(newMessage);
                await transactionEntityManaget.update(Message, messageFrom.id, { reply: replyMessage });
                return replyMessage;
            })

    }
}

