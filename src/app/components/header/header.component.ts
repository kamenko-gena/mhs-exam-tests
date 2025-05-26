import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnDestroy,
    OnInit,
    signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
    TuiAlertModule,
    TuiButtonModule,
    TuiDialogService,
    TuiLinkModule,
} from '@taiga-ui/core';
import { TUI_PROMPT, TuiPromptModule } from '@taiga-ui/kit';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Subscription, take, tap } from 'rxjs';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        CommonModule,
        TuiLinkModule,
        TuiPromptModule,
        TuiAlertModule,
        RouterLink,
        TuiButtonModule,
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
    private readonly authService = inject(AuthenticationService);
    private readonly router = inject(Router);
    private authServiceSub: Subscription = new Subscription();
    private readonly dialogs = inject(TuiDialogService);

    readonly currentUser = signal<string | null>(null);

    ngOnInit(): void {
        this.authServiceSub = this.authService.getCurrentUser().subscribe({
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
        this.authServiceSub.unsubscribe();
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
