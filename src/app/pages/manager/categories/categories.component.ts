import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService, Category } from '../../../services/data.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  categoryForm!: FormGroup;
  showForm = false;
  editingId: string | null = null;
  showIconPicker = false;

  // Available icons (emojis são strings)
  availableIcons = [
    '🥤', '🍽️', '🍰', '🥗', '🌮', '☕',
    '🍕', '🍔', '🌭', '🥪', '🍜', '🍲',
    '🥘', '🍱', '🍛', '🍝', '🍣', '🍤',
    '🥩', '🍖', '🌭', '🥓', '🍗', '🥞',
    '🧇', '🥐', '🍞', '🥖', '🥨', '🥯',
    '🧀', '🍳', '🥚', '🍶', '🍺', '🍻',
    '🥂', '🍷', '🍸', '🍹', '🍾', '🥃',
    '🍲', '🥗', '🍿', '🍩', '🍪', '🎂',
    '🍮', '🍭', '🍬', '🍫', '🍿', '🍯',
  ];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      icon: ['🍽️', [Validators.required]],
    });
  }

  loadCategories(): void {
    this.dataService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  openForm(): void {
    this.showForm = true;
    this.editingId = null;
    this.categoryForm.reset({ icon: '🍽️' });
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.categoryForm.reset();
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.notificationService.error('Por favor, preencha todos os campos');
      return;
    }

    const formValue = this.categoryForm.value;

    if (this.editingId) {
      this.dataService.updateCategory(this.editingId, formValue);
      this.notificationService.success('Categoria atualizada com sucesso!');
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        ...formValue,
      };
      this.dataService.addCategory(newCategory);
      this.notificationService.success('Categoria criada com sucesso!');
    }

    this.closeForm();
  }

  editCategory(category: Category): void {
    this.editingId = category.id;
    this.categoryForm.patchValue(category);
    this.showForm = true;
  }

  deleteCategory(id: string): void {
    if (confirm('Tem certeza que deseja deletar esta categoria?')) {
      this.dataService.deleteCategory(id);
      this.notificationService.success('Categoria deletada com sucesso!');
    }
  }

  toggleIconPicker(): void {
    this.showIconPicker = !this.showIconPicker;
  }

  selectIcon(icon: string): void {
    this.categoryForm.patchValue({ icon });
    this.showIconPicker = false;
  }
}

