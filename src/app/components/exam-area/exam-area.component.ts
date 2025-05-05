import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    Input,
    OnInit,
    signal,
    ViewChild,
} from '@angular/core';
import { CommonModule, KeyValuePipe, NgClass } from '@angular/common';
import { QuestionInterface } from 'src/app/interfaces/question-interface';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
    TuiAlertService,
    TuiButtonModule,
    TuiDialogService,
    TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
    TuiBadgeModule,
    TuiCheckboxLabeledModule,
    TuiInputNumberModule,
    TuiProgressModule,
    TuiRadioLabeledModule,
} from '@taiga-ui/kit';
import { RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { RandomDataPipe } from '../pipes/random-data.pipe';

type AnswerKey = 'a' | 'b' | 'c' | 'd' | 'e';

@Component({
    selector: 'app-exam-area',
    standalone: true,
    imports: [
        CommonModule,
        TuiButtonModule,
        TuiRadioLabeledModule,
        TuiTextfieldControllerModule,
        TuiProgressModule,
        ReactiveFormsModule,
        TuiInputNumberModule,
        RouterLink,
        TuiCheckboxLabeledModule,
        TuiBadgeModule,
        NgClass,
        KeyValuePipe,
        RandomDataPipe,
        TuiCheckboxLabeledModule,
    ],
    templateUrl: './exam-area.component.html',
    styleUrl: './exam-area.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamAreaComponent implements OnInit {
    @Input() allQuestionsData: QuestionInterface[] = [];
    @Input() sectionName = '';
    @ViewChild('ExamFailed') examFailed: ElementRef | undefined;
    @ViewChild('ExamPassed') examPassed: ElementRef | undefined;
    private readonly dialogs = inject(TuiDialogService);
    private readonly alert = inject(TuiAlertService);
    readonly questionsForShow = signal<QuestionInterface | null>(null);
    readonly showErrorExpand = signal<boolean>(false);
    readonly showCorrectExpand = signal<boolean>(false);
    private showAnswer = false;
    private userQuestionNum = '';
    readonly answersKey: AnswerKey[] = ['a', 'b', 'c', 'd', 'e'];
    userClosedQuestions: string[] = [];
    userCorrectAnswers = 0;
    currentNum = 0;

    readonly userAnswer = new FormControl<string>('');
    readonly inputQuestionNumber = new FormControl<number | null>(null);

    readonly answersFormGroup = new FormGroup({
        a: new FormControl<boolean>(false, { nonNullable: true }),
        b: new FormControl<boolean>(false, { nonNullable: true }),
        c: new FormControl<boolean>(false, { nonNullable: true }),
        d: new FormControl<boolean>(false, { nonNullable: true }),
        e: new FormControl<boolean>(false, { nonNullable: true }),
    });

    ngOnInit(): void {
        this.shuffleAnswersKey();
        this.userQuestionNum =
            localStorage.getItem(`currentQuestion-${this.sectionName}`) ?? '';
        this.userClosedQuestions =
            localStorage
                .getItem(`closedQuestions-${this.sectionName}`)
                ?.split(',')
                .filter((elem) => elem !== '') ?? [];
        this.userCorrectAnswers = Number(
            localStorage.getItem(`correctAnswers-${this.sectionName}`),
        );
        if (this.userQuestionNum) {
            this.currentNum = Number(this.userQuestionNum);
        } else {
            localStorage.setItem(
                `currentQuestion-${this.sectionName}`,
                this.currentNum.toString(),
            );
        }
        if (this.sectionName.includes('exam')) {
            this.resetDataQuestions();
        }
        this.startExam();
    }

    shuffleAnswersKey(): void {
        for (let i = this.answersKey.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.answersKey[i], this.answersKey[j]] = [
                this.answersKey[j],
                this.answersKey[i],
            ];
        }
        console.log(this.answersKey);
    }

    startExam(): void {
        this.answersFormGroup.reset();
        this.questionsForShow.set(this.allQuestionsData[this.currentNum]);
        console.log('Ответы после set: ', this.questionsForShow()?.answers);
        this.userClosedQuestions.includes(
            this.allQuestionsData[this.currentNum].id,
        )
            ? this.answersFormGroup.disable()
            : this.answersFormGroup.enable();
    }

    answer(correctAnswer: string, questionNum: number): void {
        console.log(this.answersFormGroup.getRawValue());
        this.answersFormGroup.disable();
        this.showAnswer = true;
        if (this.userAnswer.value !== correctAnswer) {
            this.showErrorExpand.set(true);
        } else {
            this.showCorrectExpand.set(true);
            ++this.userCorrectAnswers;
            localStorage.setItem(
                `correctAnswers-${this.sectionName}`,
                this.userCorrectAnswers.toString(),
            );
        }

        this.userClosedQuestions = [
            ...this.userClosedQuestions,
            this.allQuestionsData[questionNum].id,
        ];
        localStorage.setItem(
            `closedQuestions-${this.sectionName}`,
            this.userClosedQuestions.toString(),
        );

        if (this.userClosedQuestions.length === this.allQuestionsData.length) {
            // Если ответили более чем на 80%
            (this.userCorrectAnswers * 100) / this.allQuestionsData.length >= 80
                ? this.openResultNotification(
                      this.examPassed ?? '<h1>Экзамен сдан!</h1>',
                  )
                : this.openResultNotification(
                      this.examFailed ?? '<h1>Экзамен не сдан!</h1>',
                  );
        }
    }

    getClass(itemName: string, correctAnswer: string): string {
        if (!this.showAnswer) {
            return '';
        }
        if (itemName === correctAnswer) {
            return 'correct-answer';
        }
        if (
            this.userAnswer.value !== correctAnswer &&
            this.userAnswer.value === itemName
        ) {
            return 'failed-answer';
        }
        return '';
    }

    openResultNotification(content: ElementRef | string): void {
        this.dialogs
            .open(content, {
                label: 'Результат',
                appearance: 'result',
                size: 's',
            })
            .subscribe();
    }

    showQuestionByNumber(questionNum: number): void {
        this.answersFormGroup.reset();
        this.showAnswer = false;
        this.showErrorExpand.set(false);
        this.showCorrectExpand.set(false);
        this.currentNum = questionNum;
        this.questionsForShow.set(this.allQuestionsData[this.currentNum]);
        console.log('Ответы после set: ', this.questionsForShow()?.answers);
        if (this.userQuestionNum) {
            localStorage.setItem(
                `currentQuestion-${this.sectionName}`,
                this.currentNum.toString(),
            );
        }
        this.userClosedQuestions.includes(
            this.allQuestionsData[this.currentNum].id,
        )
            ? this.answersFormGroup.disable()
            : this.answersFormGroup.enable();
    }

    resetDataQuestions(): void {
        this.answersFormGroup.reset();
        this.showAnswer = false;
        this.showErrorExpand.set(false);
        this.showCorrectExpand.set(false);
        this.currentNum = 0;
        this.userClosedQuestions = [];
        this.userCorrectAnswers = 0;
        localStorage.setItem(
            `correctAnswers-${this.sectionName}`,
            this.userCorrectAnswers.toString(),
        );
        localStorage.setItem(
            `currentQuestion-${this.sectionName}`,
            this.currentNum.toString(),
        );
        localStorage.setItem(
            `closedQuestions-${this.sectionName}`,
            this.userClosedQuestions.toString(),
        );
        this.startExam();
        if (!this.sectionName.includes('exam')) {
            this.alert
                .open('Список ваших ответов пуст.', {
                    label: 'Успешно!',
                    status: 'success',
                })
                .pipe(take(1))
                .subscribe();
        }
    }

    shuffleQuestions(): void {
        for (let i = this.allQuestionsData.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.allQuestionsData[i], this.allQuestionsData[j]] = [
                this.allQuestionsData[j],
                this.allQuestionsData[i],
            ];
        }

        this.alert
            .open('Порядок вопросов изменен!', {
                label: 'Успешно!',
                status: 'info',
            })
            .pipe(take(1))
            .subscribe();
        this.showQuestionByNumber(this.currentNum);
    }

    setQuestionNumber(): void {
        let question = this.inputQuestionNumber.value;
        if (!question) {
            return;
        }
        if (question - 1 <= 0) {
            question = 1;
        } else if (question - 1 >= this.allQuestionsData.length) {
            question = this.allQuestionsData.length;
        }
        this.showQuestionByNumber(question - 1);
    }

    progressPercent(): number {
        return Math.round(
            (this.userClosedQuestions.length * 100) /
                this.allQuestionsData.length,
        );
    }
}
