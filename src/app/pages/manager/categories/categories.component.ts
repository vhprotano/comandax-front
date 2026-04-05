import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Category } from "../../../models";
import { CategoriesService } from "../../../services/categories.service";
import { NotificationService } from "../../../services/notification.service";
import { LucideAngularModule, Plus } from "lucide-angular";
import Swal from "sweetalert2";

@Component({
  selector: "app-categories",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"],
})
export class CategoriesComponent implements OnInit {
  @ViewChild("iconPickerContainer") iconPickerContainer!: ElementRef;
  @ViewChild("iconToggleButton") iconToggleButton!: ElementRef;

  readonly Plus = Plus;
  categories: Category[] = [];
  categoryForm!: FormGroup;
  showForm = false;
  editingId: string | null = null;
  showIconPicker = false;

  // Click outside listener
  @HostListener("document:mousedown", ["$event"])
  onGlobalClick(event: MouseEvent): void {
    if (!this.showIconPicker) {
      return;
    }

    const clickedInsidePicker =
      this.iconPickerContainer?.nativeElement.contains(event.target);
    const clickedOnToggleButton =
      this.iconToggleButton?.nativeElement.contains(event.target);

    if (!clickedInsidePicker && !clickedOnToggleButton) {
      this.showIconPicker = false;
    }
  }

  // Available icons (emojis são strings)
  availableIcons = [
    "🥤",
    "🍽️",
    "🍰",
    "🥗",
    "🌮",
    "☕",
    "🍕",
    "🍔",
    "🌭",
    "🥪",
    "🍜",
    "🍲",
    "🥘",
    "🍱",
    "🍛",
    "🍝",
    "🍣",
    "🍤",
    "🥩",
    "🍖",
    "🌭",
    "🥓",
    "🍗",
    "🥞",
    "🧇",
    "🥐",
    "🍞",
    "🥖",
    "🥨",
    "🥯",
    "🧀",
    "🍳",
    "🥚",
    "🍶",
    "🍺",
    "🍻",
    "🥂",
    "🍷",
    "🍸",
    "🍹",
    "🍾",
    "🥃",
    "🍲",
    "🥗",
    "🍿",
    "🍩",
    "🍪",
    "🎂",
    "🍮",
    "🍭",
    "🍬",
    "🍫",
    "🍿",
    "🍯",
  ];

  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      name: ["", [Validators.required]],
      icon: ["🍽️", [Validators.required]],
    });
  }

  loadCategories(): void {
    this.categoriesService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  openForm(): void {
    this.showForm = true;
    this.editingId = null;
    this.categoryForm.reset({ icon: "🍽️" });
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.categoryForm.reset();
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.notificationService.error("Por favor, preencha todos os campos");
      return;
    }

    const formValue = this.categoryForm.value;

    if (this.editingId) {
      this.categoriesService
        .updateCategory(this.editingId, formValue)
        .subscribe({
          next: () => {
            this.notificationService.success(
              "Categoria atualizada com sucesso!"
            );
            this.closeForm();
          },
          error: (err) => {
            console.error("Error updating category:", err);
            this.notificationService.error("Erro ao atualizar categoria");
          },
        });
    } else {
      this.categoriesService
        .createCategory(formValue.name, formValue.icon)
        .subscribe({
          next: () => {
            this.notificationService.success("Categoria criada com sucesso!");
            this.closeForm();
          },
          error: (err) => {
            console.error("Error creating category:", err);
            this.notificationService.error("Erro ao criar categoria");
          },
        });
    }
  }

  editCategory(category: Category): void {
    this.editingId = category.id;
    this.categoryForm.patchValue(category);
    this.showForm = true;
  }

  deleteCategory(id: string): void {
    Swal.fire({
      title: "Tem certeza que deseja deletar esta categoria?",
      text: "Esta ação não pode ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1d2d44",
      confirmButtonText: "Sim, remover",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriesService.deleteCategory(id).subscribe({
          next: () => {
            this.notificationService.success("Categoria deletada com sucesso!");
          },
          error: (err) => {
            console.error("Error deleting category:", err);
            this.notificationService.error("Erro ao deletar categoria");
          },
        });
      }
    });
  }

  toggleIconPicker(): void {
    this.showIconPicker = !this.showIconPicker;
  }

  selectIcon(icon: string): void {
    this.categoryForm.patchValue({ icon });
    this.showIconPicker = false;
  }
}
