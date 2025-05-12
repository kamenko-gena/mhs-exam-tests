import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButtonModule } from '@taiga-ui/core';
import { ExamAreaComponent } from '../exam-area/exam-area.component';
import { RouterLink } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase-service/firebase.service';
import { QuestionInterface } from 'src/app/interfaces/question-interface';
import { take } from 'rxjs';

@Component({
    selector: 'app-rpo-questions',
    standalone: true,
    imports: [CommonModule, TuiButtonModule, ExamAreaComponent, RouterLink],
    templateUrl: './rpo-questions.component.html',
    styleUrl: './rpo-questions.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RpoQuestionsComponent implements OnInit {
    readonly sectionName = 'rpo';
    readonly showQuestions = signal<string | null>(null);
    readonly setLoading = signal<boolean>(false);
    private readonly firebase = inject(FirebaseService);
    allQuestions: QuestionInterface[] = [];
    examQuestions: QuestionInterface[] = [];

    ngOnInit(): void {
        this.setLoading.set(true);
        this.firebase
            .getRpoQuestions()
            .pipe(take(1))
            .subscribe({
                next: (next) => {
                    this.allQuestions = next;
                    this.examQuestions = this.arrayShuffle([...next]).splice(
                        0,
                        10,
                    );
                },
                complete: () => {
                    this.setLoading.set(false);
                },
            });
    }

    arrayShuffle(array: QuestionInterface[]): QuestionInterface[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    startQuestions(sectionType: string): void {
        this.showQuestions.set(sectionType);
    }
}
