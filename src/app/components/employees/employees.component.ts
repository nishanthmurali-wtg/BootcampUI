import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { Employee } from '../../models/employee.model';
import { Department } from "../../models/department.model";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  departments: Department[] = [];
  loading = true;
  error: string | null = null;

  showModal = false;
  employeeForm: FormGroup;

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private fb: FormBuilder
  ) {
    this.employeeForm = this.fb.group({
      nameFirst: ['', Validators.required],
      nameLast: ['', Validators.required],
      departments: [[], Validators.required],
    });
  }

  ngOnInit() {
    this.fetchEmployees();
    this.fetchDepartments();
  }

  fetchEmployees() {
    this.loading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load employees.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  fetchDepartments() {
    this.departmentService.getAllDepartments().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: () => {
        console.error('Failed to load departments');
      }
    });
  }

  getDepartmentNames(departments: Department[]): string {
    return departments.map(d => d.name).join(', ');
  }

  onDelete(id: number) {
    if (!confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.employees = this.employees.filter(emp => emp.id !== id);
        console.log(`Employee with ID ${id} deleted`);
      },
      error: (err) => {
        console.error('Failed to delete employee', err);
        alert('Failed to delete employee');
      }
    });
  }
}
