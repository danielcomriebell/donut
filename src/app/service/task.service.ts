import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Task } from '../task';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  taskCollection:AngularFirestoreCollection<Task>;
  taskDocument:AngularFirestoreDocument<Task>;
  tasks: Observable<any[]>;

  constructor(public af: AngularFirestore) {
    this.taskCollection = this.af.collection('task');
    this.tasks = this.taskCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Task;
        data.id = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTasks(){
    return this.tasks;
  }

  delete(task: Task){
    this.taskDocument = this.af.doc(`task/${task.id}`);
    this.taskDocument.delete();
  }
  update(task: Task){
    this.taskDocument = this.af.doc(`task/${task.id}`);
    this.taskDocument.update(task);
  }
  add(task:Task){
    this.taskCollection.add(task);
  }

}
