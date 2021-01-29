import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public ngZone: NgZone
  ) { }

  signinUser(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
    .then((response) => {
      this.ngZone.run(() => {
        const isLoggedIn = response?.user?.uid !== null;
        return isLoggedIn;
      });
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
  }

  signinGmail(provider: any): void {
    this.afAuth.signInWithPopup(provider)
      .then(
        response => {
          response?.user?.getIdToken()
          .then(
            (token: string) => {
              localStorage.setItem('token', token);
              localStorage.setItem('uid', response?.user?.uid ?? '');
              localStorage.setItem('email', response?.user?.email ?? '');
            }
          );
        }
      )
      .catch((error) => {
        this.clearLocalstorage();
        console.log(error);
      });
  }

  clearLocalstorage(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    localStorage.removeItem('email');

    this.afAuth.signOut();
  }

  logout(): void {
    this.afAuth.signOut();
    localStorage.clear();
  }

  isAuthenticated(): Promise<boolean> {
    return this.afAuth.currentUser.then(user => {
      return true;
    }).catch(_ => {
      return false;
    });
  }
}
