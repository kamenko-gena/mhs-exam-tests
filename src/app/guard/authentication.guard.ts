import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { map, take } from 'rxjs';
import { TuiAlertService } from '@taiga-ui/core';

export const authenticationGuard: CanActivateFn = () => {
    const authService = inject(AuthenticationService);
    const alert = inject(TuiAlertService);
    const router = inject(Router);

    return authService.getCurrentUser().pipe(
        map((currentUser) => {
            if (currentUser) return true;
            alert
                .open('Необходимо войти в учетную запись.', {
                    label: 'Введите логин и пароль!',
                    status: 'info',
                })
                .pipe(take(1))
                .subscribe();

            return router.parseUrl('/login');
        }),
        take(1),
    );
};
