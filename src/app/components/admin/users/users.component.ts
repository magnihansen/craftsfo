import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { DataColumn } from '../../table/data-column';
import { DataRow } from '../../table/data-row';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    @Input() public userRows: DataRow[] = [];

    constructor(
        private router: Router,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.loadUsers();
    }

    private loadUsers(): void {
        this.userService.getUsers().subscribe({
            next: (users: User[]) => {
                const _allowDelete = true;
                const _showContextMenu = true;

                this.userRows = users.map((dataUser: User, index: number) => {
                    return {
                        rowIndex: index,
                        rowIdentifier: dataUser.id.toString(),
                        showContextMenu: _showContextMenu,
                        allowDelete: _allowDelete,
                        dataColumns: [
                            {
                            name: 'Navn',
                            value: dataUser.firstname + ' ' + dataUser.lastname
                            } as DataColumn,
                            {
                            name: 'Brugernavn',
                            value: dataUser.username
                            } as DataColumn
                        ]
                    } as DataRow
                });
            },
            error: (err: any) => {
                console.log(err);
            }
        });
    }

    public rowClicked(dataRow: DataRow): void {
        this.router.navigate(['/admin/user/' + dataRow.rowIdentifier]);
    }

    public deleteRow(dataRow: DataRow): void {
        const userId: number = parseInt(dataRow.rowIdentifier, undefined);
        alert('Not implemented yet');
    }
}
