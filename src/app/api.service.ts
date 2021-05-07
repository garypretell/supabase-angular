import { Todo } from './todo.model';
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private _todos: BehaviorSubject<Todo[]> = new BehaviorSubject([]);
  supabaseUrl = 'https://paxcjjuywdpsukqfnfkz.supabase.co';
  supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxOTgyMzA3OCwiZXhwIjoxOTM1Mzk5MDc4fQ.01dpHBE0Na-u5vwmwei2fF2QDk53RcoJOrIvy6q1qXk';
  supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  get todos(): Observable<Todo[]> {
    return this._todos.asObservable();
  }

  async loadTodos(): Promise<any> {
    const query = await this.supabase.from<Todo>('todos').select('*');
    return this._todos.next(query.data);
  }

  async addTodo(task: string): Promise<any> {
    const newTodo = {
      user_id: this.supabase.auth.user().id,
      task,
    };
    const { data, error } = await this.supabase
      .from<Todo>('todos')
      .insert(newTodo);
    return { data, error };
  }

  async getTodos(): Promise<any> {
    const { data: todos, error } = await this.supabase
      .from<Todo>('todos')
      .select('*')
      .limit(10);
    return { todos, error };
  }

  async dataTable(init: number, end: number): Promise<any> {
    const { data: todos, error } = await this.supabase
    .from<Todo>('todos')
    .select('*')
    .range(init, end);
    return { todos, error };
  }

  async deleteTodo(id: string): Promise<any> {
    const data = await this.supabase.from('todos').delete().match({ id });
    return data;
  }

  async update(id, is_complete: boolean): Promise<any> {
    const { data, error } = await this.supabase
      .from('todos')
      .update({ is_complete })
      .match({ id });
  }

  listenAll(): any {
    return this.supabase
      .from('todos')
      .on('*', (payload) => {
        console.log('Todos changed: ', payload);
        if (payload.eventType === 'DELETE') {
          // Filter out the removed item
          const oldItem: Todo = payload.old;
          const newValue = this._todos.value.filter(
            (item) => oldItem.id !== item.id
          );
          this._todos.next(newValue);
        } else if (payload.eventType === 'INSERT') {
          // Add the new item
          const newItem: Todo = payload.new;
          this._todos.next([...this._todos.value, newItem]);
        } else if (payload.eventType === 'UPDATE') {
          // Update one item
          const updatedItem: Todo = payload.new;
          const newValue = this._todos.value.map((item) => {
            if (updatedItem.id === item.id) {
              item = updatedItem;
            }
            return item;
          });
          this._todos.next(newValue);
        }
      })
      .subscribe();
  }
}
