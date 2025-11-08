import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product, Category } from '../../../models';
import { ProductsService } from '../../../services/products.service';
import { CategoriesService } from '../../../services/categories.service';
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
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
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
    this.productsService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

  loadCategories(): void {
    this.categoriesService.getCategories().subscribe((categories) => {
      this.categories = categories;
      this.filteredCategories = categories;
    });
  }

  getCategoryName(categoryId: string): string {
    // Normaliza os IDs (remove hifens e compara em lowercase) para
    // lidar com formatos diferentes (ex: "2455e6c1-..." vs "2455e6c14311...")
    const normalize = (id?: string) => (id || '').replace(/-/g, '').toLowerCase();
    const category = this.categories.find((c) => normalize(c.id) === normalize(categoryId));

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
      this.categoriesService.createCategory(this.pendingNewCategory, '🍽️').subscribe({
        next: (newCategory) => {
          formValue = { ...formValue, category_id: newCategory.id };
          this.pendingNewCategory = null;
          this.submitProductWithFormValue(formValue);
        },
        error: (err) => {
          console.error('Error creating category:', err);
          this.notificationService.error('Erro ao criar categoria');
        }
      });
      return;
    }

    this.submitProductWithFormValue(formValue);
  }

  private submitProductWithFormValue(formValue: any): void {
    if (this.editingId) {
      this.productsService.updateProduct(this.editingId, {
        name: formValue.name,
        price: formValue.price,
        productCategoryId: formValue.category_id
      }).subscribe({
        next: () => {
          this.notificationService.success('Produto atualizado com sucesso!');
          this.loadProducts();
          this.closeForm();
        },
        error: (err) => {
          console.error('Error updating product:', err);
          this.notificationService.error('Erro ao atualizar produto');
        }
      });
    } else {
      this.productsService.createProduct(formValue?.name, formValue?.price, formValue?.category_id).subscribe({
        next: () => {
          this.notificationService.success('Produto criado com sucesso!');
          this.loadProducts();
          this.closeForm();
        },
        error: (err) => {
          console.error('Error creating product:', err);
          this.notificationService.error('Erro ao criar produto');
        }
      });
    }
  }

  editProduct(product: Product): void {
    this.editingId = product.id;
    this.productForm.patchValue(product);

    // Set selected category display
    // Normaliza antes de comparar para cobrir ids com/sem hifens
    const normalize = (id?: string) => (id || '').replace(/-/g, '').toLowerCase();
    const category = this.categories.find((c) => normalize(c.id) === normalize(product.category_id));
    if (category) {
      this.selectedCategoryName = category.name;
      this.selectedCategoryIcon = category.icon || '🍽️';
    }

    this.showForm = true;
  }

  deleteProduct(id: string): void {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
      this.productsService.deleteProduct(id);
      this.notificationService.success('Produto deletado com sucesso!');
    }
  }
}

