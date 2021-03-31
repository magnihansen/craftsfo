import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Imageslide } from '../../../interfaces/imageslide';
import { NgForm } from '@angular/forms';
import * as uuid from 'uuid';

@Component({
  selector: 'app-slideedit',
  templateUrl: './slideedit.component.html',
  styleUrls: ['./slideedit.component.scss']
})
export class SlideeditComponent {
  slides: Imageslide[] = [];
  newSlide: Imageslide | null = null;
  guid = '';
  showAddSlide  = false;
  messageStatus = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // this.af.list('/slides', ref => ref.orderByChild('rank')).valueChanges().subscribe(snapshots => {
    //   this.slides = snapshots as Imageslide[];
    // });
  }

  newUid(): any {
    return uuid.v4();
  }

  toggleAddNewSlide(): void {
    this.showAddSlide = !this.showAddSlide;
    this.messageStatus = '';
  }

  addSlide(path: string, alttext: string, rank: string): void {
    // if (this.authService.isAuthenticated()) {
    //   const rankValue: number = parseInt(rank, 0);
    //   this.newSlide = {
    //     uid: this.newUid(),
    //     path,
    //     alttext,
    //     rank: rankValue
    //   };
    //   // this.af.list('/slides').push(this.newSlide);
    //   // this.messageStatus = 'Slide oprettet';
    //   // this.showAddSlide = false;
    // } else {
    //   this.messageStatus = 'Bruger har ikke rettigheder at oprette slide';
    // }
  }
}
