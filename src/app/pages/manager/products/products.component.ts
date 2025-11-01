import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService, Product, Category } from '../../../services/data.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  productForm!: FormGroup;
  showForm = false;
  editingId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private notificationService: NotificationService
  ) {}

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
    });
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.name : 'Sem categoria';
  }

  openForm(): void {
    this.showForm = true;
    this.editingId = null;
    this.productForm.reset();
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.productForm.reset();
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.notificationService.error('Por favor, preencha todos os campos');
      return;
    }

    const formValue = this.productForm.value;

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
  }

  editProduct(product: Product): void {
    this.editingId = product.id;
    this.productForm.patchValue(product);
    this.showForm = true;
  }

  deleteProduct(id: string): void {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
      this.dataService.deleteProduct(id);
      this.notificationService.success('Produto deletado com sucesso!');
    }
  }
}

