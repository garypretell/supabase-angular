import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { AuthService } from '../auth/auth.service';
import { Todo } from '../todo.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  todo: Todo;
  actionLabel: string;
  todos = this.api.todos;
  data;
  cantidad;

  pageIndex: number;
  pageSize: number;
  dataCount: number;
  constructor(
    private api: ApiService,
    public router: Router,
    public route: ActivatedRoute,
    public authService: AuthService
  ) {
    this.pageIndex = 0;
    this.pageSize = 10;
  }

  async ngOnInit(): Promise<void> {
    let listen = this.api.listenAll();
    await this.api.loadTodos();
    this.data = await this.api.dataTable(0, this.pageSize - 1);
  }

  async createTodo(): Promise<any> {
    const task = Date.now().toString();
    this.api.addTodo(task);
  }

  delete(item: Todo): any {
    this.api.deleteTodo(item.id);
  }

  toggleDone(item: Todo): any {
    this.api.update(item.id, !item.is_complete);
  }

  signOut(): any {
    this.authService.signOut();
  }

  async pagination(p): Promise<any>{
    this.data = await this.api.dataTable(this.pageSize * this.pageIndex, this.pageSize * (this.pageIndex + 1) - 1);
  }
}
