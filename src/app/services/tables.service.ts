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
      number
      status
    }
  }
`;

const CREATE_TABLE = gql`
  mutation CreateTable {
    createTable {
      id
      number
      status
    }
  }
`;

const DELETE_TABLE = gql`
    mutation DeleteTable($id: UUID!) {
      deleteTable(id: $id)
    }
  `;

  const UPDATE_TABLE = gql`
    mutation UpdateTable($id: UUID!, $number: Int!) {
      updateTable(id: $id, number: $number) {
        id
        number
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
            number: newTable?.number?.toString() || '',
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
          number: table.number,
          status: table.status,
        },
      })
      .pipe(
        map((result: any) => result.data?.createTable),
        tap((newTable) => {
          const addedTable: Table = {
            id: newTable.id,
            number: newTable?.number?.toString() || '',
            status: newTable.status,
          };
          const current = this.tables$.value;
          this.tables$.next([...current, addedTable]);
        })
      );
  }

  updateTable(id: string, table: Partial<Table>): void {
    this.apollo
      .mutate({
        mutation: UPDATE_TABLE,
        variables: {
          id,
          number: parseInt(table.number + '' || '0', 10),
        },
      })
      .pipe(
        map((result: any) => result.data?.updateTable),
        tap((updatedTable) => {
          const current = this.tables$.value;
          const index = current.findIndex((t) => t.id === id);
          if (index !== -1) {
            const updated: Table = {
              id: updatedTable.id,
              number: updatedTable?.number?.toString() || '',
              status: updatedTable.status,
            };
            current[index] = updated;
            this.tables$.next([...current]);
          }
        })
      )
  }



  deleteTable(id: string): Observable<boolean> {
    return this.apollo
      .mutate({
        mutation: DELETE_TABLE,
        variables: { id },
      })
      .pipe(
        map((result: any) => result.data?.deleteTable),
        tap((deleted: boolean) => {
          if (deleted) {
            const current = this.tables$.value;
            this.tables$.next(current.filter((t) => t.id !== id));
          }
        })
      );
  }



  private loadTables(): void {
    this.apollo
      .watchQuery<any>({
        query: GET_TABLES,
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(
        map((result: any) => {
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
            number: t.number?.toString() || '',
            status: t.status,
          }));
          this.tables$.next(mappedTables);
        },
        error: (err) => console.error('Error loading tables:', err),
      });
  }
}

