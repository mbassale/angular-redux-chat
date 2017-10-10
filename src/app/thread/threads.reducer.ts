import {Thread} from './thread.model';
import {Action} from 'redux';
import * as ThreadActions from './thread.actions';
import {createSelector} from 'reselect';
import {Message} from '../message/message.model';

export interface ThreadsEntities {
  [id: string]: Thread;
}

export interface ThreadsState {
  ids: string[];
  entities: ThreadsEntities;
  currentThreadId?: string;
}

const initialState: ThreadsState = {
  ids: [],
  currentThreadId: null,
  entities: {}
};

export const ThreadsReducer =
  function (state: ThreadsState = initialState, action: Action): ThreadsState {
    switch (action.type) {
      case ThreadActions.ADD_THREAD: {
        const thread = (<ThreadActions.AddThreadAction>action).thread;
        if (state.ids.includes(thread.id)) {
          return state;
        }

        return {
          ids: [...state.ids, thread.id],
          currentThreadId: state.currentThreadId,
          entities: Object.assign({}, state.entities, {
            [thread.id]: thread
          })
        };
      }
      case ThreadActions.ADD_MESSAGE: {
        const thread = (<ThreadActions.AddMessageAction>action).thread;
        const message = (<ThreadActions.AddMessageAction>action).message;

        // if message is sent to current thread, mark it as read
        const isRead = message.thread.id === state.currentThreadId ? true : message.isRead;
        const newMessage = Object.assign({}, message, {isRead: isRead});

        // get the old thread
        const oldThread = state.entities[thread.id];

        // create a new thread with this new message
        const newThread = Object.assign({}, oldThread, {
          messages: [...oldThread.messages, newMessage]
        });

        return {
          ids: state.ids,
          currentThreadId: state.currentThreadId,
          entities: Object.assign({}, state.entities, {
            [thread.id]: newThread
          })
        };
      }
      case ThreadActions.SELECT_THREAD: {
        const thread = (<ThreadActions.SelectThreadAction>action).thread;
        const oldThread = state.entities[thread.id];

        // mark messages as read
        const newMessages = oldThread.messages.map(
          (message) => Object.assign({}, message, {isRead: true})
        );

        // make a new thread
        const newThread = Object.assign({}, oldThread, {messages: newMessages});

        return {
          ids: state.ids,
          currentThreadId: thread.id,
          entities: Object.assign({}, state.entities, {
            [thread.id]: newThread
          })
        };
      }
      default:
        return state;
    }
  };

export const getThreadsState = (state): ThreadsState => state.threads;

export const getThreadsEntities = createSelector(
  getThreadsState,
  ( state: ThreadsState ) => state.entities );

export const getAllThreads = createSelector(
  getThreadsEntities,
  ( entities: ThreadsEntities ) => Object.keys(entities)
    .map((threadId) => entities[threadId]));

export const getUnreadMessagesCount = createSelector(
  getAllThreads,
  ( threads: Thread[] ) => threads.reduce(
    (unreadCount: number, thread: Thread) => {
      thread.messages.forEach((message: Message) => {
        if (!message.isRead) {
          ++unreadCount;
        }
      });
      return unreadCount;
    },
    0));

// This selector emits the current thread
export const getCurrentThread = createSelector(
  getThreadsEntities,
  getThreadsState,
  ( entities: ThreadsEntities, state: ThreadsState ) =>
    entities[state.currentThreadId] );

export const getAllMessages = createSelector(
  getAllThreads,
  ( threads: Thread[] ) =>
    threads.reduce( // gather all messages
      (messages, thread) => [...messages, ...thread.messages],
      []).sort((m1, m2) => m1.sentAt - m2.sentAt)); // sort them by time
