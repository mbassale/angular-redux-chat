
import {combineReducers, Reducer} from 'redux';
import {UsersReducer, UsersState} from './user/users.reducer';
import {ThreadsReducer, ThreadsState} from './thread/threads.reducer';

export interface AppState {
  users: UsersState;
  threads: ThreadsState;
}

const rootReducer: Reducer<AppState> = combineReducers<AppState>({
  users: UsersReducer,
  threads: ThreadsReducer
});

export default rootReducer;
