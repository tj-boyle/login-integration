import { Injectable } from '@angular/core';


@Injectable()
export class ApiAuthService {
    constructor() {}

    async isAuthenticated(): Promise<boolean> {
        return false;
    }
}
