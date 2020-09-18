import {Component} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-Firebase-upload';
  selectedFile: File = null;
  submitted = false;
  uploadProgress$: number;
  downloadURL$: Observable<string>;

  constructor(private http: HttpClient, private storage: AngularFireStorage) {
  }

  onFileSelected(event) {
    const n = Date.now();
    const file = event.target.files[0];
    const filePath = `QuestionImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task: AngularFireUploadTask = this.storage.upload(filePath, file);
    console.log(task);
    this.submitted = true;
    task.percentageChanges().subscribe((res) => {
      this.uploadProgress$ = res;
    });
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((res) => {
          console.log('[Download URL]', res);
          this.downloadURL$ = res;
        });
        fileRef.getMetadata().subscribe((res) => {
          console.log('[GetMetaData]', res);
        });
        console.log('[FileRef]', fileRef);
      })
    ).subscribe((res) => {
      console.log('[Subscribe]', res);
    });
  }
}
