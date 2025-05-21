import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnDestroy,
    OnInit,
    signal,
} from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FirebaseService } from 'src/app/services/firebase-service/firebase.service';
import { QuestionInterface } from 'src/app/interfaces/question-interface';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import {
    TuiLoaderModule,
    TuiPrimitiveTextfieldModule,
    TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { SectionNameService } from 'src/app/services/section-name/section-name.service';

type AnswerKey = 'a' | 'b' | 'c' | 'd' | 'e' | 'f';

@Component({
    selector: 'app-questions-data-list',
    standalone: true,
    imports: [
        CommonModule,
        TuiLoaderModule,
        TuiPrimitiveTextfieldModule,
        AsyncPipe,
        TuiTextfieldControllerModule,
    ],
    templateUrl: './questions-data-list.component.html',
    styleUrl: './questions-data-list.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionsDataListComponent implements OnInit, OnDestroy {
    private readonly firebase = inject(FirebaseService);
    private readonly sectionNameService = inject(SectionNameService);
    readonly contentLoader = signal<boolean>(false);
    readonly answersKey: AnswerKey[] = ['a', 'b', 'c', 'd', 'e', 'f'];
    allQuestions: QuestionInterface[] = [];
    readonly questionsToShow$ = new BehaviorSubject<QuestionInterface[]>([]);
    sectionName = '';
    private sectionNameSub: Subscription = new Subscription();
    ngOnInit(): void {
        this.sectionNameSub = this.sectionNameService.section$.subscribe(
            (section) => {
                this.sectionName = section;
                this.contentLoader.set(true);
                let methodName = this.firebase.getRpoQuestions();
                if (section === 'МЧС-Монтаж') {
                    methodName = this.firebase.getMhsMontazhQuestions();
                } else if (section === 'МЧС-ТО') {
                    methodName = this.firebase.getMhsTOQuestions();
                }
                methodName.pipe(take(1)).subscribe({
                    next: (value) => {
                        this.allQuestions = value;
                        this.questionsToShow$.next(value);
                    },
                    complete: () => {
                        this.contentLoader.set(false);
                    },
                });
            },
        );
    }
    ngOnDestroy(): void {
        this.sectionNameSub.unsubscribe();
    }

    searchQuestion(text: string): void {
        this.questionsToShow$.next(
            this.allQuestions.filter((item) =>
                item.question
                    .toLocaleLowerCase()
                    .includes(text.toLocaleLowerCase()),
            ),
        );
    }
}
