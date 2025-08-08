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

  constructor(private departmentService: DepartmentService) {}

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

  onDelete(id: number): void {
    const dept = this.departments.find(d => d.id === id);
    if (!dept) return;

    if (dept.readonly) {
      alert("Readonly dept can't be deleted");
      return;
    }

    if (!confirm('Delete this department?')) return;

    this.departmentService.deleteDepartment(id).subscribe({
      next: () => {
        this.departments = this.departments.filter(d => d.id !== id);
      },
      error: (err: unknown) => {
        console.error(err);
        alert((err as any)?.error?.message || 'Failed to delete department');
      }
    });
  }
}
