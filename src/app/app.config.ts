import { provideAnimations } from '@angular/platform-browser/animations';
import {
    ApplicationConfig,
    ErrorHandler,
    importProvidersFrom,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { appRoutes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { TuiRootModule } from '@taiga-ui/core';
import { provideHttpClient } from '@angular/common/http';
import { createErrorHandler, TraceService } from '@sentry/angular';

const firebaseConfig = {
    apiKey: 'AIzaSyCY43rSuMF90TIkTS_brS2RpUvWeQyjEsg',
    authDomain: 'mvd-mhs-tests-app.firebaseapp.com',
    projectId: 'mvd-mhs-tests-app',
    storageBucket: 'mvd-mhs-tests-app.firebasestorage.app',
    messagingSenderId: '1004524785744',
    appId: '1:1004524785744:web:bf918245254c94208a8155',
};

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(appRoutes),
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        importProvidersFrom([TuiRootModule]),
        provideHttpClient(),
        {
            provide: ErrorHandler,
            useValue: createErrorHandler(),
        },
        {
            provide: TraceService,
            deps: [Router],
        },
    ],
};
