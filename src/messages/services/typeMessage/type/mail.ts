import { IType } from "../interface/type.interface";

export class MailType implements IType {

    constructor() {
        // faire tout la connection a un service de mail
    }
    send(Message: any): string {
        return 'mail sent';
    }
    
}