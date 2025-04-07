import { inject, Injectable } from '@angular/core';
import {
    Auth,
    signInWithEmailAndPassword,
    user,
    UserCredential,
} from '@angular/fire/auth';
import { catchError, from, map, Observable, of, take } from 'rxjs';
import { UserInterface } from 'src/app/interfaces/user-interface';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    private readonly firebaseAuth = inject(Auth);
    private readonly user$ = user(this.firebaseAuth);

    login(email: string, password: string): Observable<UserCredential | null> {
        return from(
            signInWithEmailAndPassword(this.firebaseAuth, email, password),
        ).pipe(
            catchError(() => {
                return of(null);
            }),
            take(1),
        );
    }

    getCurrentUser(): Observable<UserInterface | null> {
        return this.user$.pipe(
            map((currentUser) => {
                return currentUser && currentUser.email
                    ? {
                          email: currentUser.email,
                      }
                    : null;
            }),
        );
    }
}
