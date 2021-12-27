import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Employee} from "./employee";
import {environment} from "../environments/environment";

/* Other method: Instead of @Injectable you can add the EmployeeService
  to the app.module.ts file in the 'providers' array */
// Root component of our application
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  // We get the base api url from the environment.ts file (http://localhost:8080)
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  /* Observable means that it provides support for passing
  messages between parts of your application */

  // Return type is an Employee array
  public getEmployees(): Observable<Employee[]> {
    // We make a GET call with the http client and return and array of employee(s)
    return this.http.get<Employee[]>(`${this.apiServerUrl}/employee/all`);
  }

  public addEmployee(employee: Employee): Observable<Employee> {
    // We make a POST call with the http client and return the employee that was added
    return this.http.post<Employee>(`${this.apiServerUrl}/employee/add`, employee);
  }

  public updateEmployee(employee: Employee): Observable<Employee> {
    // We make a PUT call with the http client and return the employee that was updated
    return this.http.put<Employee>(`${this.apiServerUrl}/employee/update`, employee);
  }

  public deleteEmployee(employeeId: number): Observable<void> {
    // We make an DELETE call with the http client and expect no return
    return this.http.delete<void>(`${this.apiServerUrl}/employee/delete/${employeeId}`);
  }
}

