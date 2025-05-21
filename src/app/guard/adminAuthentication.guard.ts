import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { map, take } from 'rxjs';
import { TuiDialogService } from '@taiga-ui/core';

export const adminAuthenticationGuard: CanActivateFn = () => {
    const authService = inject(AuthenticationService);
    const dialog = inject(TuiDialogService);
    const router = inject(Router);

    return authService.getCurrentUser().pipe(
        map((currentUser) => {
            if (currentUser?.email === 'lspaio@btg.by') {
                return true;
            } else {
                dialog
                    .open('Войдите под учетной записью Администратора.', {
                        label: 'Доступ закрыт!',
                        size: 's',
                    })
                    .pipe(take(1))
                    .subscribe();
                return router.parseUrl('/login');
            }
        }),
        take(1),
    );
};
