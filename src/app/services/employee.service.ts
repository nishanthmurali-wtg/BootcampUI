import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import {Department} from "./department.service";

export interface AddEmployeeRequest {
  nameFirst: string;
  nameLast: string;
  departments: Department[];
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = '/api/employees';

  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addEmployee(req: AddEmployeeRequest): Observable<any> {
    return this.http.post(this.apiUrl, req);
  }

  updateEmployee(id: number, req: AddEmployeeRequest): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, req);
  }


}
