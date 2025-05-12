import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnDestroy,
    OnInit,
    signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    TuiButtonModule,
    TuiDialogModule,
    TuiDialogService,
} from '@taiga-ui/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Subscription, take, tap } from 'rxjs';
import { TUI_PROMPT, TuiPromptModule } from '@taiga-ui/kit';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin-area',
    standalone: true,
    imports: [CommonModule, TuiButtonModule, TuiPromptModule, TuiDialogModule],
    templateUrl: './admin-area.component.html',
    styleUrl: './admin-area.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAreaComponent implements OnInit, OnDestroy {
    private readonly authService = inject(AuthenticationService);
    private readonly dialogs = inject(TuiDialogService);
    private readonly router = inject(Router);
    private subscription: Subscription = new Subscription();
    readonly currentUser = signal<string | null>(null);

    ngOnInit(): void {
        this.subscription = this.authService.getCurrentUser().subscribe({
            next: (receivedUser) => {
                if (!receivedUser) {
                    this.currentUser.set(null);
                    return;
                }
                this.currentUser.set(receivedUser.email);
            },
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    logout(): void {
        if (!this.currentUser()) {
            return;
        }
        this.dialogs
            .open<boolean>(TUI_PROMPT, {
                label: 'Выйти?',
                size: 's',
                data: {
                    content: `Выход из учетной записи.`,
                    yes: 'Да',
                    no: 'Нет',
                },
            })
            .pipe(
                tap((userAnswer) => {
                    if (userAnswer) {
                        this.authService.logout().pipe(take(1)).subscribe();
                        this.router.navigateByUrl('/');
                    }
                }),
                take(1),
            )
            .subscribe();
    }
}
