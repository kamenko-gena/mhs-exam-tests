type AnswerKey = 'a' | 'b' | 'c' | 'd' | 'e' | 'f';
export interface QuestionDataFormInterface {
    question: string;
    answers: {
        a: string;
        b: string;
        c?: string | null;
        d?: string | null;
        e?: string | null;
        f?: string | null;
    };
    description: string;
    correctAnswer: AnswerKey | string;
}
