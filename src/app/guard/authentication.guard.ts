import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { map, take } from 'rxjs';

export const authenticationGuard: CanActivateFn = () => {
    const authService = inject(AuthenticationService);
    const router = inject(Router);

    return authService.getCurrentUser().pipe(
        map((currentUser) => {
            return currentUser ? true : router.parseUrl('/login');
        }),
        take(1),
    );
};
