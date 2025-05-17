import { BankIdService } from './bankid.service';
export declare class BankIdController {
    private readonly svc;
    constructor(svc: BankIdService);
    login(body: any): Promise<{
        orderRef: string;
    }>;
    status(orderRef: string): Promise<{
        status: string;
    }>;
    cancel(orderRef: string): Promise<{
        cancelled: boolean;
    }>;
}
