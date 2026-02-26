import { inject, Injectable } from '@angular/core';
import {
    addDoc,
    collection,
    collectionData,
    Firestore,
} from '@angular/fire/firestore';
import { catchError, from, map, Observable, of, take } from 'rxjs';
import { QuestionDataFormInterface } from 'src/app/interfaces/question-data-form-interface';
import { QuestionInterface } from 'src/app/interfaces/question-interface';

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {
    private readonly firestore = inject(Firestore);
    private readonly mhsToQuestionsCollect = collection(
        this.firestore,
        'mhs-TO',
    );
    private readonly mhsMontazhQuestionsCollect = collection(
        this.firestore,
        'mhs-montazh',
    );
    private readonly rpoQuestionsCollect = collection(this.firestore, 'rpo');
    private readonly mvdQuestionsCollect = collection(this.firestore, 'mvd');

    getMhsTOQuestions(): Observable<QuestionInterface[]> {
        return collectionData(this.mhsToQuestionsCollect, {
            idField: 'id',
        }) as Observable<QuestionInterface[]>;
    }

    getMhsMontazhQuestions(): Observable<QuestionInterface[]> {
        return collectionData(this.mhsMontazhQuestionsCollect, {
            idField: 'id',
        }) as Observable<QuestionInterface[]>;
    }

    getRpoQuestions(): Observable<QuestionInterface[]> {
        return collectionData(this.rpoQuestionsCollect, {
            idField: 'id',
        }) as Observable<QuestionInterface[]>;
    }
    getMvdQuestions(): Observable<QuestionInterface[]> {
        return collectionData(this.mvdQuestionsCollect, {
            idField: 'id',
        }) as Observable<QuestionInterface[]>;
    }
    //Отправка одного вопроса
    addQuestions(
        questionData: QuestionDataFormInterface,
        collectionName: string,
    ): Observable<string | null> {
        let collection = this.rpoQuestionsCollect;
        switch (collectionName) {
            case 'МЧС-ТО':
                collection = this.mhsToQuestionsCollect;
                break;
            case 'МЧС-Монтаж':
                collection = this.mhsMontazhQuestionsCollect;
                break;
            case 'МВД':
                collection = this.mvdQuestionsCollect;
                break;
        }
        return from(addDoc(collection, questionData)).pipe(
            map((response) => response.id),
            catchError((err) => {
                console.log('Ошибка: ', err);
                return of(null);
            }),
            take(1),
        );
    }
}

//Отправка массива вопросов
// addMhsToQuestions(): Observable<string> {
//     for (const data of this.questionsDataTo) {
//         setTimeout(() => {
//             addDoc(this.mhsToQuestionsCollect, data).catch((err) =>
//                 console.log('Ошибка: ', err),
//             );
//         }, 500);
//     }
//     return of('Начало отправки');
// }
