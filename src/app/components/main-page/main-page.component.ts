import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';
import { RouterModule } from '@angular/router';
import { TuiBadgeModule } from '@taiga-ui/kit';

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
export class MainPageComponent {}
