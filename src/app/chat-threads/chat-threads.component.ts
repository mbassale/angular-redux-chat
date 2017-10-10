import {Component, Inject, OnInit} from '@angular/core';
import {Thread} from '../thread/thread.model';
import {AppStore} from '../app.store';
import * as Redux from 'redux';
import {AppState} from '../app.reducer';
import {getAllThreads, getCurrentThread} from '../thread/threads.reducer';
import * as ThreadActions from '../thread/thread.actions';

@Component({
  selector: 'app-chat-threads',
  templateUrl: './chat-threads.component.html',
  styleUrls: ['./chat-threads.component.css']
})
export class ChatThreadsComponent implements OnInit {

  threads: Thread[];
  currentThreadId: string;

  constructor(@Inject(AppStore) private store: Redux.Store<AppState>) {
    store.subscribe(() => this.updateState());
    this.updateState();
  }

  ngOnInit() {
  }

  updateState() {
    const state = this.store.getState();
    this.threads = getAllThreads(state);
    this.currentThreadId = getCurrentThread(state).id;
  }

  handleThreadClicked(thread: Thread) {
    this.store.dispatch(ThreadActions.selectThread(thread));
  }

}
