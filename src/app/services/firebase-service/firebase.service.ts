import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
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
}

//Отправка вопросов
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
