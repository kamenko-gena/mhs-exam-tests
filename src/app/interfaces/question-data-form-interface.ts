type AnswerKey = 'a' | 'b' | 'c' | 'd' | 'e';
export interface QuestionDataFormInterface {
    question: string;
    answers: {
        a: string;
        b: string;
        c: string;
        d?: string | null;
        e?: string | null;
    };
    description: string;
    correctAnswer: AnswerKey | string;
}
