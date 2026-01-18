import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Tab, Table } from "../../../models";
import { TablesService } from "../../../services/tables.service";
import { OrdersService } from "../../../services/orders.service";
import { NotificationService } from "../../../services/notification.service";
import { LucideAngularModule, Plus } from "lucide-angular";
import Swal from "sweetalert2";

@Component({
  selector: "app-table-view",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
  ],
  templateUrl: "./table-view.component.html",
  styleUrls: ["./table-view.component.scss"],
})
export class TableViewComponent implements OnInit {
  tables: Table[] = [];
  tabs: Tab[] = [];
  showAddForm = false;
  tableForm!: FormGroup;
  readonly Plus = Plus;

  constructor(
    private tablesService: TablesService,
    private ordersService: OrdersService,
    private notificationService: NotificationService,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTables();
    this.loadOrders();
  }

  initForm(): void {
    this.tableForm = this.fb.group({
      number: ["", [Validators.required]],
    });
  }

  loadTables(): void {
    this.tablesService.getTables().subscribe((tables) => {
      this.tables = tables;
      this.updateTableStatus();
    });
  }

  private loadOrders(): void {
    this.ordersService.getTabs().subscribe((tabs) => {
      this.tabs = tabs;
      this.updateTableStatus();
    });
  }

  private updateTableStatus(): void {
    this.tables.forEach((table) => {
      const tab = this.tabs?.find(
        (o) => o.table_number === table.number && o.status === "OPEN",
      );
      if (tab) {
        table.status = "BUSY";
        table.tab = tab;
      } else {
        table.status = "FREE";
        table.tab = undefined;
      }
    });
  }

  openAddTableForm(): void {
    this.showAddForm = true;
    this.tableForm.reset();
  }

  closeAddForm(): void {
    this.showAddForm = false;
    this.tableForm.reset();
  }

  onSubmit(): void {
    if (this.tableForm.invalid) {
      this.notificationService.error("Por favor, preencha o número da mesa");
      return;
    }

    const newTable: Table = {
      id: `table-${Date.now()}`,
      number: this.tableForm.value.number,
      status: "FREE",
    };

    this.tablesService.addTable(newTable).subscribe(() => this.loadTables());
    this.notificationService.success("Mesa adicionada com sucesso!");
    this.closeAddForm();
  }

  deleteTable(tableId: string, event: Event): void {
    event.stopPropagation(); // Prevenir click no card
    Swal.fire({
      title: "Tem certeza que deseja remover esta mesa?",
      text: "Esta ação não pode ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1d2d44",
      confirmButtonText: "Sim, remover",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.tablesService.deleteTable(tableId).subscribe({
          next: () => {
            this.notificationService.success("Mesa removida com sucesso!");
            this.loadTables();
          },
          error: (err) => {
            console.error("Erro ao remover mesa:", err);
            this.notificationService.error(
              "Erro ao remover mesa. Tente novamente.",
            );
          },
        });
      }
    });
  }

  handleTableClick(table: Table): void {
    if (table.status === "BUSY" && table.tab) {
      // Navegar para a comanda
      this.router.navigate(["/dashboard"], {
        queryParams: { orderId: table.tab.id },
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case "FREE":
        return "bg-green-100 border-green-300";
      case "BUSY":
        return "bg-red-100 border-red-300";
      case "reserved":
        return "bg-yellow-100 border-yellow-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case "FREE":
        return "Disponível";
      case "BUSY":
        return "Ocupada";
      case "reserved":
        return "Reservada";
      default:
        return "Desconhecido";
    }
  }
}
