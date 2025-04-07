import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    inject,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    TuiButtonModule,
    TuiDialogService,
    TuiSvgModule,
} from '@taiga-ui/core';
import { RouterModule } from '@angular/router';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { TuiBadgeModule } from '@taiga-ui/kit';
import { take } from 'rxjs';

@Component({
    selector: 'app-main-page',
    standalone: true,
    imports: [
        CommonModule,
        TuiButtonModule,
        RouterModule,
        TuiBadgeModule,
        TuiSvgModule,
    ],
    templateUrl: './main-page.component.html',
    styleUrl: './main-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent implements AfterViewInit {
    private readonly dialogs = inject(TuiDialogService);
    private readonly showNotification: boolean = Boolean(
        sessionStorage.getItem('showNotification'),
    );
    @ViewChild(TemplateRef) template: PolymorpheusContent;

    ngAfterViewInit(): void {
        if (!this.showNotification) {
            this.dialogs
                .open(this.template, {
                    label: 'Приложение обновилось!',
                    appearance: 'notification',
                    size: 's',
                })
                .pipe(take(1))
                .subscribe();
            sessionStorage.setItem('showNotification', 'true');
        }
    }
}
