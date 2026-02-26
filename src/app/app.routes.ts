import { Route } from '@angular/router';
import { MhsMontazhQuestionsComponent } from './components/mhs-montazh-questions/mhs-montazh-questions.component';
import { MhsToQuestionsComponent } from './components/mhs-to-questions/mhs-to-questions.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RpoQuestionsComponent } from './components/rpo-questions/rpo-questions.component';
import { AdminAreaComponent } from './components/admin-area/admin-area.component';
import { authenticationGuard } from './guard/authentication.guard';
import { adminAuthenticationGuard } from './guard/adminAuthentication.guard';
import { HomePageComponent } from './components/home-page/home-page.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { MvdQuestionComponent } from './components/mvd-question/mvd-question.component';

export const appRoutes: Route[] = [
    {
        path: 'mhs-montazh',
        component: MhsMontazhQuestionsComponent,
    },
    {
        path: 'mhs-to',
        component: MhsToQuestionsComponent,
    },
    {
        path: 'rpo',
        component: RpoQuestionsComponent,
        canActivate: [authenticationGuard],
    },
    {
        path: 'mvd',
        component: MvdQuestionComponent,
        canActivate: [authenticationGuard],
    },
    {
        path: 'login',
        component: LoginPageComponent,
    },
    {
        path: 'admin',
        component: AdminAreaComponent,
        canActivate: [adminAuthenticationGuard],
    },
    {
        path: 'exams',
        component: MainPageComponent,
    },
    {
        path: '',
        component: HomePageComponent,
    },
    {
        path: '**',
        component: NotFoundPageComponent,
    },
];
