import { Route } from '@angular/router';
import { MhsMontazhQuestionsComponent } from './components/mhs-montazh-questions/mhs-montazh-questions.component';
import { MhsToQuestionsComponent } from './components/mhs-to-questions/mhs-to-questions.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RpoQuestionsComponent } from './components/rpo-questions/rpo-questions.component';
import { AdminAreaComponent } from './components/admin-area/admin-area.component';
import { authenticationGuard } from './guard/authentication.guard';

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
    },
    {
        path: 'login',
        component: LoginPageComponent,
    },
    {
        path: 'admin',
        component: AdminAreaComponent,
        canActivate: [authenticationGuard],
    },
    {
        path: '',
        component: MainPageComponent,
    },
];
