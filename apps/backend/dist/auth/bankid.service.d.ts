import Redis from 'ioredis';
import { UserService } from '../user/user.service';
export declare class BankIdService {
    private redis;
    private userService;
    constructor(redis: Redis, userService: UserService);
    initiate(personNumber: string): Promise<string>;
    status(orderRef: string): Promise<{
        status: string;
    }>;
    cancel(orderRef: string): Promise<void>;
}
