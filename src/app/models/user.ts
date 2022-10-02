export class User {
    constructor() {
        this.id = 0;
        this.username = '';
        this.password = '';
        this.firstname = '';
        this.lastname = '';
    }

    id: number;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    token?: string;
}
