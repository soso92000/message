import { IType } from "../interface/type.interface";

export class SmsType implements IType {

    constructor() {
        // faire tout la connection a un service d'sms
    }
    send(Message: any): string {
        return 'sms sent';
    }
    
}