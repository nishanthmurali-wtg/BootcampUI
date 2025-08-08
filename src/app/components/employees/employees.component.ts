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
  nonMandatoryDepartments: Department[] = [];
  loading = true;
  error: string | null = null;
  editMode = false;
  currentEmployeeId: number | null = null;

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

  openModal(employee?: Employee) {
    if (employee) {
      this.editMode = true;
      this.currentEmployeeId = employee.id;

      this.employeeForm.patchValue({
        nameFirst: employee.nameFirst,
        nameLast: employee.nameLast,
        departments: employee.departments.map(d => d.id)
      });
    } else {
      this.editMode = false;
      this.currentEmployeeId = null;
      this.employeeForm.reset();
    }
    const modal = document.getElementById('EmployeeModal');
    if (modal) modal.style.display = 'block';
  }

  closeModal() {
    const modal = document.getElementById('EmployeeModal');
    if (modal) modal.style.display = 'none';
  }

  fetchDepartments() {
    this.departmentService.getAllDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.nonMandatoryDepartments = data.filter(d => !d.mandatory);
      },
      error: () => {
        console.error('Failed to load departments');
      }
    });
  }

  getDepartmentNames(departments: Department[]): string {
    return departments.map(d => d.name).join(', ');
  }

  onSave() {
    if (this.employeeForm.invalid) {
      alert('Please fill all required fields.');
      return;
    }

    const formValue = this.employeeForm.value;
    const payload = {
      nameFirst: formValue.nameFirst,
      nameLast: formValue.nameLast,
      departments: formValue.departments.map((id: number) => ({ id }))
    };

    if (this.editMode && this.currentEmployeeId !== null) {
      this.employeeService.updateEmployee(this.currentEmployeeId, payload).subscribe({
        next: (updatedEmployee) => {
          const index = this.employees.findIndex(emp => emp.id === this.currentEmployeeId);
          if (index > -1) {
            this.employees[index] = updatedEmployee;
          }
          this.closeModal();
          this.employeeForm.reset();
        },
        error: (err) => {
          console.error('Failed to update employee', err);
          alert('Failed to update employee');
        }
      });
    } else {
      this.employeeService.addEmployee(payload).subscribe({
        next: (newEmployee) => {
          this.employees.push(newEmployee);
          this.closeModal();
          this.employeeForm.reset();
        },
        error: (err) => {
          console.error('Failed to add employee', err);
          alert('Failed to add employee');
        }
      });
    }
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
