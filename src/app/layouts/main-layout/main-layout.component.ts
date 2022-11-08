import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { NavigationComponent } from 'src/app/components/navigation/navigation.component';
import { environment } from 'src/environments/environment';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  imports: [CommonModule, NavigationComponent, FooterComponent, RouterModule]
})
export class MainLayoutComponent implements OnInit {
  public environment = environment;
  public showToTopButton = false;
  public bg_image_url: string = '';

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
    this.showToTopButton = this.hasScrollBar(this.document.body);
  }

  public ngOnInit(): void{
    this.bg_image_url = environment.bg_image_url;
    console.log("Hashed Filename:", this.bg_image_url)
  }

  hasScrollBar = (element: any) => {
    const {scrollTop} = element;
    if (scrollTop > 0) {
      return true;
    }
    element.scrollTop += 10;
    if (scrollTop === element.scrollTop) {
      return false;
    }
    // undoing the change
    element.scrollTop = scrollTop;
    return true;
  }
}
