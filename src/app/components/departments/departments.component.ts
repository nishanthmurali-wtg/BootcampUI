import { Component, OnInit } from '@angular/core';
import { DepartmentService, Department } from '../../services/department.service';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {
  departments: Department[] = [];
  loading = true;
  error: string | null = null;

  newDeptName = '';
  newDeptReadonly = false;
  newDeptMandatory = false;

  constructor(
    private departmentService: DepartmentService,
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.loading = true;
    this.departmentService.getAllDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load departments.';
        this.loading = false;
      }
    });
  }

  openModal() {
    const modal = document.getElementById('DepartmentModal');
    if (modal) modal.style.display = 'block';
  }

  closeModal() {
    const modal = document.getElementById('DepartmentModal');
    if (modal) modal.style.display = 'none';
  }

  onSave(): void {
    if (!this.newDeptName.trim()) {
      alert('Please enter department name.');
      return;
    }

    this.departmentService.addDepartment({
      name: this.newDeptName,
      readonly: this.newDeptReadonly,
      mandatory: this.newDeptMandatory
    }).subscribe({
      next: (dept) => {
        this.departments.push(dept);
        this.closeModal();
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to add department.');
      }
    });
  }

  private resetForm(): void {
    this.newDeptName = '';
    this.newDeptReadonly = false;
    this.newDeptMandatory = false;
  }

  onDelete(id: number): void {
    const dept = this.departments.find(d => d.id === id);
    if (!dept) return;

    if (dept.readonly) {
      alert("Readonly department cannot be deleted");
      return;
    }

    if (!confirm('Delete this department?')) return;

    this.departmentService.deleteDepartment(id).subscribe({
      next: () => {
        this.departments = this.departments.filter(d => d.id !== id);
      },
      error: (err) => {
        console.error(err);
        alert((err as any)?.error?.message || 'Failed to delete department');
      }
    });
  }
}
