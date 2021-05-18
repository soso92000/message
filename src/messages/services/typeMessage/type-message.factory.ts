import { Injectable } from '@nestjs/common';
import { SmsType } from './type/sms';
import { MailType } from './type/mail';
import { IType } from './interface/type.interface';

@Injectable()
export class ServiceFactory {

    public getService(context: string) : IType {

        switch(context) {
            case 'sms': return new SmsType();
            case 'email': return new MailType();
            default: throw new Error(`No service defined for the context: "${context}"`);
        }
    }
}