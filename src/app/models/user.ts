export class User {
    constructor() {
        this.id = 0;
        this.username = '';
        this.password = '';
        this.firstName = '';
        this.lastName = '';
    }

    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    token?: string;
}
