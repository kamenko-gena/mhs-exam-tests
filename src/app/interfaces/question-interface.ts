type AnswerKey = 'a' | 'b' | 'c' | 'd' | 'e' | 'f';
export interface QuestionInterface {
    question: string;
    answers: {
        a: string;
        b: string;
        c?: string;
        d?: string;
        e?: string;
        f?: string;
    };
    description: string;
    correctAnswer: AnswerKey;
    id: string;
    image?: string;
}
