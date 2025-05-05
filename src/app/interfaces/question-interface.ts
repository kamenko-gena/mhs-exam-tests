export interface QuestionInterface {
    question: string;
    answers: {
        a: string;
        b: string;
        c: string;
        d?: string;
        e?: string;
    };
    description: string;
    correctAnswer: string;
    id: string;
    image?: string;
}
