import {Component, OnInit} from '@angular/core';
import {Employee} from "./employee";
import {EmployeeService} from "./employee.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
// OnInit is used to run methods on the initializing of this component
export class AppComponent implements OnInit{
  public employees: Employee[];
  public editEmployee: Employee;
  public deleteEmployee: Employee;

  // Importing the service
  constructor(private employeeService: EmployeeService){}

  // Runs on init
  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees(): void {
      // Subscribe is used, so we get 'notified' when we get an answer from the backend
      this.employeeService.getEmployees().subscribe((response: Employee[]) => {
          this.employees = response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
  }

  public onAddEmployee (addForm: NgForm): void {
    // Click the close button of the form
    document.getElementById('close-employee-form')!.click();

    // addForm.value is sent as a JSON
    // Subscribe is there so that we get notified when we get a response from the server
    this.employeeService.addEmployee(addForm.value).subscribe(
      // Wait for a response
      (response: Employee) => {
        console.log(response);
        // Reload all the employees + the newly added one
        this.getEmployees();
        // Clear the form
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        addForm.reset();
        alert(error.message);
      },
    );
  }

  public onUpdateEmployee (employee: Employee): void {
    // addForm.value is sent as a JSON
    // Subscribe is there so that we get notified when we get a response from the server
    this.employeeService.updateEmployee(employee).subscribe(
      // Wait for a response
      (response: Employee) => {
        console.log(response);
        // Reload all the employees + the newly added one
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }

  public onDeleteEmployee (employeeId: number): void {
    // addForm.value is sent as a JSON
    // Subscribe is there so that we get notified when we get a response from the server
    this.employeeService.deleteEmployee(employeeId).subscribe(
      // Wait for a response
      // deleteEmployee does not give a response so the return type is void
      (response: void) => {
        console.log(response);
        // Reload all the employees + the newly added one
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
    );
  }

  public searchEmployees(key: string): void {
    const results: Employee[] = [];
    // For every employee in employees
    for (const employee of this.employees) {
      // Take the firstName,lastName or the email and check if the indexOf method does not return -1
      // indexOf returns -1 when it can't find the given element
      // Extra info: Because we call indexOf on a string and not an array it checks the key with every letter in that string
      if (employee.firstName.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        employee.lastName.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(employee);
      }
    }
    // Set the employees to the newly filtered list
    this.employees = results;
    // If the result array is empty or there has nothing been entered in the search box
    if(results.length === 0 || !key) {
      // Get all the employees back (reset the search result)
      this.getEmployees();
    }
  }

  // An employee can also be null (For adding a new one)
  public onOpenModal(employee: Employee | null, mode: string): void {
    const container = document.getElementById('main-container');
    // Creating a bootstrap modal button
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    // Set the data-target to the correct modal for adding, editing and deleting
    if (mode == 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    } else if (mode == 'edit') {
      // Set the employee, so we can edit it and use it in the app.component.html file
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    } else if (mode == 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }

    // The ! is a Non-null assertion (Otherwise we get a message telling that button is 'possibly' null).
    container!.appendChild(button);
    // Open the modal
    button.click();
   }
}
