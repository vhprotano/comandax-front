import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService, Product, Category } from '../../../services/data.service';
import { NotificationService } from '../../../services/notification.service';
import { LucideAngularModule, Plus } from 'lucide-angular';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  readonly Plus = Plus;

  products: Product[] = [];
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  productForm!: FormGroup;
  showForm = false;
  editingId: string | null = null;

  // Category search
  categorySearch = '';
  showCategoryDropdown = false;
  selectedCategoryName = '';
  selectedCategoryIcon = '';
  pendingNewCategory: string | null = null; // Nome da categoria a ser criada

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
    this.loadCategories();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      category_id: ['', [Validators.required]],
    });
  }

  loadProducts(): void {
    this.dataService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

  loadCategories(): void {
    this.dataService.getCategories().subscribe((categories) => {
      this.categories = categories;
      this.filteredCategories = categories;
    });
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.name : 'Sem categoria';
  }

  filterCategories(): void {
    const search = this.categorySearch.toLowerCase().trim();
    this.filteredCategories = this.categories.filter((c) =>
      c.name.toLowerCase().includes(search)
    );
  }

  selectCategory(category: Category): void {
    this.productForm.patchValue({ category_id: category.id });
    this.categorySearch = '';
    this.selectedCategoryName = category.name;
    this.selectedCategoryIcon = category.icon || '🍽️';
    this.showCategoryDropdown = false;
  }

  clearCategory(): void {
    this.productForm.patchValue({ category_id: '' });
    this.categorySearch = '';
    this.selectedCategoryName = '';
    this.selectedCategoryIcon = '';
  }

  shouldShowCreateOption(): boolean {
    const search = this.categorySearch.trim();
    if (!search) return false;

    const exactMatch = this.categories.some(
      (c) => c.name.toLowerCase() === search.toLowerCase()
    );
    return !exactMatch;
  }

  createNewCategory(): void {
    // Marcar categoria como pendente ao invés de criar imediatamente
    this.pendingNewCategory = this.categorySearch.trim();
    this.selectedCategoryName = this.pendingNewCategory;
    this.selectedCategoryIcon = '🍽️';
    this.categorySearch = '';
    this.showCategoryDropdown = false;

    // Definir um ID temporário para o formulário
    this.productForm.patchValue({ category_id: 'PENDING_NEW_CATEGORY' });
  }

  openForm(): void {
    this.showForm = true;
    this.editingId = null;
    this.productForm.reset();
    this.clearCategory();
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.productForm.reset();
    this.clearCategory();
    this.pendingNewCategory = null;
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.notificationService.error('Por favor, preencha todos os campos');
      return;
    }

    let formValue = this.productForm.value;

    // Se há uma categoria pendente, criar agora
    if (this.pendingNewCategory && formValue.category_id === 'PENDING_NEW_CATEGORY') {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: this.pendingNewCategory,
        icon: '🍽️',
      };

      this.dataService.addCategory(newCategory);
      formValue = { ...formValue, category_id: newCategory.id };
      this.pendingNewCategory = null;
    }

    if (this.editingId) {
      this.dataService.updateProduct(this.editingId, formValue);
      this.notificationService.success('Produto atualizado com sucesso!');
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...formValue,
        active: true,
      };
      this.dataService.addProduct(newProduct);
      this.notificationService.success('Produto criado com sucesso!');
    }

    this.closeForm();
    this.loadCategories(); // Recarregar categorias para mostrar a nova
  }

  editProduct(product: Product): void {
    this.editingId = product.id;
    this.productForm.patchValue(product);

    // Set selected category display
    const category = this.categories.find((c) => c.id === product.category_id);
    if (category) {
      this.selectedCategoryName = category.name;
      this.selectedCategoryIcon = category.icon || '🍽️';
    }

    this.showForm = true;
  }

  deleteProduct(id: string): void {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
      this.dataService.deleteProduct(id);
      this.notificationService.success('Produto deletado com sucesso!');
    }
  }
}

