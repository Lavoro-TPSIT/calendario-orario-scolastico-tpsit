import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select } from '@ngxs/store';
import { DataService } from '@services/data/data.service';
import { EditLesson } from '@state/timetable/timetable.actions';
import { TimetableState } from '@state/timetable/timetable.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-lesson',
  templateUrl: './edit-lesson.component.html',
  styleUrls: ['./edit-lesson.component.sass']
})
export class EditLessonComponent implements OnInit {

  lessonForm: FormGroup;
  weeks: string[];

  currentLesson: object;

  @Select(state => state.timetable.lessonEdit) lessonEdit$: Observable<TimetableState>;
  lessonEdit: any;

  constructor(
    private _DataService: DataService,
    private _Router: Router
  ) {
    this.lessonEdit$.subscribe(res => { this.lessonEdit = res; });
    this.lessonForm = new FormGroup({
      start_time: new FormControl('',Validators.required),
      finish_time: new FormControl('',Validators.required),
      lesson_name: new FormControl('', [Validators.required, Validators.maxLength(45)]),
      week: new FormControl('',Validators.required),
      day: new FormControl('',Validators.required),
      teacher_name: new FormControl(''),
      class_room: new FormControl(''),
    })
  }

  ngOnInit(): void {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    this.weeks = alphabet;

    this.lessonForm.controls.start_time.setValue(this.lessonEdit['lesson']['start_time']);
    this.lessonForm.controls.finish_time.setValue(this.lessonEdit['lesson']['finish_time']);
    this.lessonForm.controls.lesson_name.setValue(this.lessonEdit['lesson']['lesson_name']);
    this.lessonForm.controls.teacher_name.setValue(this.lessonEdit['lesson']['teacher_name']);
    this.lessonForm.controls.class_room.setValue(this.lessonEdit['lesson']['class_room']);
    this.lessonForm.controls.week.setValue(this.lessonEdit['week']);
    this.lessonForm.controls.day.setValue(this.lessonEdit['day']);
  }

  @Dispatch() editLesson = (originalLesson: any, modifiedLesson: any) => new EditLesson(originalLesson, modifiedLesson);

  get form() {
    return this.lessonForm.controls;
  }

  saveLesson() {
    this.editLesson(this.lessonEdit, this.lessonForm.value);
    this._Router.navigate(['/timetable']);
  }

}
