import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../../services/auth.service';
import { Page } from '../../interfaces/page';
import { Contact } from '../../interfaces/contact';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  dbPath = '/contacts';
  page: Page | null = null;
  content = '';
  contact: Contact | null = null;
  name = '';
  phone = '';
  email = '';
  message = '';
  messageStatus = '';

  constructor(
    private db: AngularFireDatabase,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    const path: string = this.route.routeConfig?.path ?? '';
    this.loadPage(path);
  }

  loadPage(url: string): void {
    this.db.database.ref('/pages').orderByChild('link').equalTo(url).once('value')
    .then(snapshot => {
      this.content = (Object.values(snapshot.val())[0] as Page).content;
    });
  }
  onSubmit(): void {
    const now = new Date();
    this.contact = {
      uid: '',
      name: this.name,
      phone: this.phone,
      email: this.email,
      message: this.message,
      done: false,
      timestamp: now.toString()
    };

    if (this.name && this.email && this.message) {
      const newGuid = this.db.list(this.dbPath).push(this.contact).key ?? '';
      this.contact.uid = newGuid;
      this.update(newGuid, this.contact);
      this.messageStatus = 'Beskeden sendt';
    } else {
      this.messageStatus = 'Beskeden kunne ikke sendes.';
    }
  }

  update(key: string, contact: Contact): void {
    this.db.object<Contact>(this.dbPath + '/' + contact.uid).update({
      uid: contact.uid
    })
    .then(msg => this.handleSuccess(msg))
    .catch(error => this.handleError(error));
  }

  handleSuccess(msg: any): void {
    console.log(msg);
  }

  handleError(error: any): void {
    console.log(error);
  }
}
