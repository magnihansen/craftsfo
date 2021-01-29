import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Contact } from '../../../interfaces/contact';

@Component({
  selector: 'app-contactedit',
  templateUrl: './contactedit.component.html',
  styleUrls: ['./contactedit.component.scss']
})
export class ContacteditComponent {
  contacts: Contact[] = [];
  date: Date | null = null;

  constructor(
    private af: AngularFireDatabase
  ) {
    this.af.list('/contacts', ref => ref.orderByChild('timestamp')).valueChanges().subscribe(snapshots => {
      this.contacts = snapshots as Contact[];
    });
  }
}
