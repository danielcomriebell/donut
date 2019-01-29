import { Component, OnInit} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { TaskService } from './service/task.service';
import { Task } from './task';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  tasks: Task[];
  edit_state:boolean = false;
  taskEdit: Task;
  overlay:boolean = false;
  edit_overlay:boolean = false;
  eTask: Task = {
    title: '',
    description:'',
    due_on:'',
  }
  task: Task = {
    title: '',
    description:'',
    due_on:'',
  }

  constructor(private ts: TaskService) {}

  ngOnInit(){
    this.ts.getTasks().subscribe(tasks =>{
      this.tasks = tasks;
    })
  }

  editTask(event, task:Task){
    this.edit_state = !this.edit_state;
    this.eTask = task;
  }

  delete(event, task:Task){
    this.clearState();
    this.ts.delete(task);
    this.clearTaskObject();
    this.task.category = '';
  }

  updateTask(task: Task){
    this.ts.update(task);
    this.clearState();
  }

  clearState(){
    this.edit_state = false;
  }

  clearTaskObject(){
    this.task.title = '';
    this.task.description = '';
    this.task.due_on = '';
  }

  updateStatusToProgress(task: Task){
    task.category = "progress";
    this.ts.update(task);
  }

  updateStatusToBacklog(task: Task){
    task.category = "backlog";
    this.ts.update(task);
  }

  updateStatusToComplete(task: Task){
    task.category = "complete";
    task.date_complete = Date.now();
    this.ts.update(task);
  }

  toggleOverlay(){
    this.clearTaskObject();
    this.overlay = !this.overlay;
  }

  onSubmit(){
    if(this.task.title != '' && this.task.due_on != ''){
      this.task.category = 'progress';
      this.ts.add(this.task);
      this.clearTaskObject();
      this.overlay = !this.overlay;
    }
  }
}
