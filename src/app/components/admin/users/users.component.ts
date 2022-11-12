import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { I18nService } from 'src/app/localization/i18n.service';
import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { DataColumn } from '../../table/data-column';
import { DataRow } from '../../table/data-row';
import { TableComponent } from '../../table/table.component';

@Component({
    standalone: true,
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    imports: [ CommonModule, LocalLocalizationModule, TableComponent ]
})
export class UsersComponent implements OnInit {
    @Input() public userRows: DataRow[] = [];

    constructor(
        private router: Router,
        private userService: UserService,
        private i18nService: I18nService
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
                            name: this.i18nService.getTranslation('common.name'),
                            value: dataUser.firstname + ' ' + dataUser.lastname
                            } as DataColumn,
                            {
                            name: this.i18nService.getTranslation('common.username'),
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
