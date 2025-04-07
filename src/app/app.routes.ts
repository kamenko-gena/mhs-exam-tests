import { Route } from '@angular/router';
import { MhsMontazhQuestionsComponent } from './components/mhs-montazh-questions/mhs-montazh-questions.component';
import { MhsToQuestionsComponent } from './components/mhs-to-questions/mhs-to-questions.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { authenticationGuard } from './guard/authentication.guard';

export const appRoutes: Route[] = [
    {
        path: 'mhs-montazh',
        canActivate: [authenticationGuard],
        component: MhsMontazhQuestionsComponent,
    },
    {
        path: 'mhs-to',
        canActivate: [authenticationGuard],
        component: MhsToQuestionsComponent,
    },
    {
        path: 'login',
        component: LoginPageComponent,
    },
    {
        path: '',
        component: MainPageComponent,
    },
];
