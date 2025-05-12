import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-area',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-area.component.html',
    styleUrl: './admin-area.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAreaComponent {}
