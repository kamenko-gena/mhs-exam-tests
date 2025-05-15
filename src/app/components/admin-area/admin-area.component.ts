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
    TuiAlertModule,
    TuiAlertService,
    TuiButtonModule,
    TuiDialogModule,
    TuiDialogService,
    TuiErrorModule,
} from '@taiga-ui/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Subscription, take, tap } from 'rxjs';
import {
    TUI_PROMPT,
    TUI_VALIDATION_ERRORS,
    TuiDataListWrapperModule,
    TuiFieldErrorPipeModule,
    TuiInputModule,
    TuiPromptModule,
    TuiSelectModule,
    TuiTextareaModule,
} from '@taiga-ui/kit';
import { Router, RouterLink } from '@angular/router';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { tuiMarkControlAsTouchedAndValidate } from '@taiga-ui/cdk';
import { FirebaseService } from 'src/app/services/firebase-service/firebase.service';
import { QuestionDataFormInterface } from 'src/app/interfaces/question-data-form-interface';

type AnswerKey = 'a' | 'b' | 'c' | 'd' | 'e' | 'f';
const COLLECTIONS = ['МЧС-Монтаж', 'МЧС-ТО', 'Вопросы РПО'];
type CollectionsName = typeof COLLECTIONS;
type Collection = CollectionsName[number];

@Component({
    selector: 'app-admin-area',
    standalone: true,
    imports: [
        CommonModule,
        TuiButtonModule,
        TuiPromptModule,
        TuiDialogModule,
        ReactiveFormsModule,
        TuiTextareaModule,
        TuiFieldErrorPipeModule,
        TuiErrorModule,
        TuiInputModule,
        TuiAlertModule,
        TuiSelectModule,
        TuiDataListWrapperModule,
        RouterLink,
    ],
    providers: [
        {
            provide: TUI_VALIDATION_ERRORS,
            useValue: {
                required: 'Обязательное заполнение!',
                pattern: 'Возможные варианты: a,b,c,d,e,f',
            },
        },
    ],
    templateUrl: './admin-area.component.html',
    styleUrl: './admin-area.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAreaComponent implements OnInit, OnDestroy {
    private readonly alerts = inject(TuiAlertService);
    private readonly authService = inject(AuthenticationService);
    private readonly dialogs = inject(TuiDialogService);
    private readonly router = inject(Router);
    private readonly firebase = inject(FirebaseService);
    readonly setLoading = signal<boolean>(false);
    private subscription: Subscription = new Subscription();
    readonly currentUser = signal<string | null>(null);
    readonly answersKey: AnswerKey[] = ['a', 'b', 'c', 'd', 'e', 'f'];
    readonly collections = COLLECTIONS;
    readonly collectionFormControl = new FormControl<Collection>('Вопросы РПО');

    questionFormGroup = new FormGroup({
        question: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required],
        }),
        answers: new FormGroup({
            a: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            b: new FormControl<string>('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            c: new FormControl<string | null>(null),
            d: new FormControl<string | null>(null),
            e: new FormControl<string | null>(null),
            f: new FormControl<string | null>(null),
        }),
        description: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required],
        }),
        correctAnswer: new FormControl<AnswerKey | string>('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.pattern('^(?!.*(.).*\\1)[a-f]*$'),
            ],
        }),
    });

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

    getAnswersFormGroup(): FormGroup {
        return this.questionFormGroup.get('answers') as FormGroup;
    }

    addQuestion(): void {
        if (this.questionFormGroup.invalid) {
            tuiMarkControlAsTouchedAndValidate(this.questionFormGroup);
            return;
        }
        this.setLoading.set(true);

        const questionFormGroupData: QuestionDataFormInterface =
            this.questionFormGroup.getRawValue();
        if (!questionFormGroupData.answers.d) {
            delete questionFormGroupData.answers.d;
        }
        if (!questionFormGroupData.answers.e) {
            delete questionFormGroupData.answers.e;
        }
        this.firebase
            .addQuestions(
                { ...questionFormGroupData },
                this.collectionFormControl.value ?? 'Вопросы РПО',
            )
            .subscribe({
                complete: () => {
                    this.setLoading.set(false);
                    this.alerts
                        .open('Вопрос добавлен!', {
                            label: 'Готово!',
                            status: 'success',
                        })
                        .pipe(take(1))
                        .subscribe();
                },
            });
        this.questionFormGroup.reset();
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
