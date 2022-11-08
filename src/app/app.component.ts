import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { filter } from 'rxjs/internal/operators/filter';
import { map } from 'rxjs/internal/operators/map';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss']
})
export class AppComponent implements OnInit {
  public environment = environment
  public activeRoute = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private router: Router
  ) {
    this.activeRoute = this.router.url;
  }

  ngOnInit(): void {
    this.setPageTitle();
  }

  private setPageTitle(): void {
    const defaultPageTitle = this.environment.brandName;
  
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.activatedRoute.firstChild;
  
        if (!child) {
          return this.activatedRoute.snapshot.data.title || defaultPageTitle;
        }
  
        while (child.firstChild) {
          child = child.firstChild;
        }
  
        if (child.snapshot.data.title) {
          return child.snapshot.data.title || defaultPageTitle;
        }

        return defaultPageTitle;
      })
    ).subscribe((title: string) => {
      this.title.setTitle(title);
    });
  }
}
