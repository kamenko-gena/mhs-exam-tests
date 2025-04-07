import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { init } from '@sentry/angular';

init({
    dsn: 'https://36cdb8fee342b33eda1c968ea8f84075@o4508291284271104.ingest.de.sentry.io/4509111396335696',
});

bootstrapApplication(AppComponent, appConfig).catch((err) =>
    console.error(err),
);
