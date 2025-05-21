import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SectionNameService {
    section$ = new Subject<string>();

    setSectionName(sectionName: string) {
        this.section$.next(sectionName);
    }
}
