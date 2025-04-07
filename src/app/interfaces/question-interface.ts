export interface QuestionInterface {
    question: string;
    answers: {
        a: string;
        b: string;
        c: string;
    };
    description: string;
    correctAnswer: string;
    id: string;
    image?: string;
}
