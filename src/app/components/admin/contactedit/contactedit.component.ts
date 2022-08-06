import { Component } from '@angular/core';
import { Contact } from '../../../interfaces/contact';

@Component({
  selector: 'app-contactedit',
  templateUrl: './contactedit.component.html',
  styleUrls: ['./contactedit.component.scss']
})
export class ContacteditComponent {
  contacts: Contact[] = [];

  constructor() { }
}
