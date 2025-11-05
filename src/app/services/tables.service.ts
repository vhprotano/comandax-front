import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Table } from '../models';

// ==================== GRAPHQL QUERIES ====================

const GET_TABLES = gql`
  query GetTables {
    tables {
      id
      code
      status
    }
  }
`;

const CREATE_TABLE = gql`
  mutation CreateTable {
    createTable {
      id
      code
      status
    }
  }
`;

// ==================== SERVICE ====================

@Injectable({
  providedIn: 'root',
})
export class TablesService {
  private tables$ = new BehaviorSubject<Table[]>([]);

  constructor(private apollo: Apollo) {
    this.loadTables();
  }



  getTables(): Observable<Table[]> {
    return this.tables$.asObservable();
  }

  getAvailableTables(): Observable<Table[]> {
    return this.tables$.asObservable().pipe(
      map((tables) => tables.filter((t) => t.status === 'FREE'))
    );
  }

  createTable(): Observable<any> {
    return this.apollo
      .mutate({
        mutation: CREATE_TABLE,
      })
      .pipe(
        map((result: any) => result.data?.createTable),
        tap((newTable) => {
          const table: Table = {
            id: newTable.id,
            number: newTable.code.toString(),
            status: newTable.status,
          };
          const current = this.tables$.value;
          this.tables$.next([...current, table]);
        })
      );
  }

  addTable(table: Table) {
    return this.apollo
      .mutate({
        mutation: CREATE_TABLE,
        variables: {
          code: table.number,
          status: table.status,
        },
      })
      .pipe(
        map((result: any) => result.data?.createTable),
        tap((newTable) => {
          const addedTable: Table = {
            id: newTable.id,
            number: newTable.code.toString(),
            status: newTable.status,
          };
          const current = this.tables$.value;
          this.tables$.next([...current, addedTable]);
        })
      );
  }

  updateTable(id: string, table: Partial<Table>): void {
    const current = this.tables$.value;
    const updated = current?.map((t) => (t.id === id ? { ...t, ...table } : t));
    this.tables$.next(updated);
  }

  deleteTable(id: string): void {
    const current = this.tables$.value;
    this.tables$.next(current.filter((t) => t.id !== id));
  }



  private loadTables(): void {
    this.apollo
      .watchQuery<any>({
        query: GET_TABLES,
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(
        map((result: any) => {
          console.log('GraphQL getTables result:', result);
          if (result.errors) {
            console.error('GraphQL errors:', result.errors);
          }
          return result.data?.tables || [];
        })
      )
      .subscribe({
        next: (tables) => {
          const mappedTables: Table[] = tables?.map((t: any) => ({
            id: t.id,
            number: t.code.toString(),
            status: t.status,
          }));
          this.tables$.next(mappedTables);
        },
        error: (err) => console.error('Error loading tables:', err),
      });
  }
}

