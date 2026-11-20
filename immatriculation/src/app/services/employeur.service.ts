import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PrsEmployeurDto {
  empSequence: number;
  empAffiliation: number;
  empNom?: string;
  empPrenom?: string;
  empAbrev?: string;
}

@Injectable({ providedIn: 'root' })
export class EmployeurService {
  private http = inject(HttpClient);
  private baseUrl = 'http://172.16.0.205:8083/api/employeurs';

  getByAffiliation(affiliation: number): Observable<PrsEmployeurDto> {
    return this.http.get<PrsEmployeurDto>(
      `${this.baseUrl}/by-affiliation/${affiliation}`
    );
  }
}