import * as Redux from 'redux';
import {
  AppState
} from '../app.reducer';
import { Thread } from '../thread/thread.model';
import * as ThreadActions from '../thread/thread.actions';
import { User } from '../user/user.model';
import * as UserActions from '../user/user.actions';
import {UUID} from 'angular2-uuid';
import {getAllMessages} from '../thread/threads.reducer';
import {Md5} from "ts-md5/dist/md5";

/**
 * ChatExampleData sets up the initial data for our chats as well as
 * configuring the "bots".
 */

// the person using the app is Juliet
const me: User = {
  id: UUID.UUID(),
  isClient: true, // <-- notice we're specifying the client as this User
  name: 'Juliet',
  avatarSrc: 'assets/images/avatars/female-avatar-1.png'
};

const ladycap: User = {
  id: UUID.UUID(),
  name: 'Lady Capulet',
  avatarSrc: 'assets/images/avatars/female-avatar-2.png'
};

const echo: User = {
  id: UUID.UUID(),
  name: 'Echo Bot',
  avatarSrc: 'assets/images/avatars/male-avatar-1.png'
};

const rev: User = {
  id: UUID.UUID(),
  name: 'Reverse Bot',
  avatarSrc: 'assets/images/avatars/female-avatar-4.png'
};

const wait: User = {
  id: UUID.UUID(),
  name: 'Waiting Bot',
  avatarSrc: 'assets/images/avatars/male-avatar-2.png'
};

const wordCount: User = {
  id: UUID.UUID(),
  name: 'Counting Bot',
  avatarSrc: 'assets/images/avatars/male-avatar-3.png'
};

const md5Bot: User = {
  id: UUID.UUID(),
  name: 'MD5 Bot',
  avatarSrc: 'assets/images/avatars/male-avatar-4.png'
};

const tLadycap: Thread = {
  id: 'tLadycap',
  name: ladycap.name,
  avatarSrc: ladycap.avatarSrc,
  messages: []
};

const tEcho: Thread = {
  id: 'tEcho',
  name: echo.name,
  avatarSrc: echo.avatarSrc,
  messages: []
};

const tRev: Thread = {
  id: 'tRev',
  name: rev.name,
  avatarSrc: rev.avatarSrc,
  messages: []
};

const tWait: Thread = {
  id: 'tWait',
  name: wait.name,
  avatarSrc: wait.avatarSrc,
  messages: []
};

const tWordCount: Thread = {
  id: 'tWordCount',
  name: wordCount.name,
  avatarSrc: wordCount.avatarSrc,
  messages: []
};

const md5Thread: Thread = {
  id: 'md5Thread',
  name: md5Bot.name,
  avatarSrc: md5Bot.avatarSrc,
  messages: []
};

export function ChatExampleData(store: Redux.Store<AppState>) {

  // set the current User
  store.dispatch(UserActions.setCurrentUser(me));

  // create a new thread and add messages
  store.dispatch(ThreadActions.addThread(tLadycap));
  store.dispatch(ThreadActions.addMessage(tLadycap, {
    author: me,
    sentAt: new Date(),
    text: 'Yet let me weep for such a feeling loss.'
  }));
  store.dispatch(ThreadActions.addMessage(tLadycap, {
    author: ladycap,
    sentAt: new Date(),
    text: 'So shall you feel the loss, but not the friend which you weep for.'
  }));

  // create a few more threads
  store.dispatch(ThreadActions.addThread(tEcho));
  store.dispatch(ThreadActions.addMessage(tEcho, {
    author: echo,
    sentAt: new Date(),
    text: 'I\'ll echo whatever you send me'
  }));

  store.dispatch(ThreadActions.addThread(tRev));
  store.dispatch(ThreadActions.addMessage(tRev, {
    author: rev,
    sentAt: new Date(),
    text: 'I\'ll reverse whatever you send me'
  }));

  store.dispatch(ThreadActions.addThread(tWait));
  store.dispatch(ThreadActions.addMessage(tWait, {
    author: wait,
    sentAt: new Date(),
    text: `I\'ll wait however many seconds you send to me before responding.` +
      ` Try sending '3'`
  }));

  store.dispatch(ThreadActions.addThread(tWordCount));
  store.dispatch(ThreadActions.addMessage(tWordCount, {
    author: wordCount,
    sentAt: new Date(),
    text: `I\'ll count words for whatever you send me`
  }));

  store.dispatch(ThreadActions.addThread(md5Thread));
  store.dispatch(ThreadActions.addMessage(md5Thread, {
    author: md5Bot,
    sentAt: new Date(),
    text: `I\'ll calculate MD5 hash for whatever you send me`
  }));

  // select the first thread
  store.dispatch(ThreadActions.selectThread(tLadycap));

  // Now we set up the "bots". We do this by watching for new messages and
  // depending on which thread the message was sent to, the bot will respond
  // in kind.

  const handledMessages = {};

  store.subscribe( () => {
    getAllMessages(store.getState())
      // bots only respond to messages sent by the user, so
      // only keep messages sent by the current user
      .filter(message => message.author.id === me.id)
      .map(message => {

        // This is a bit of a hack and we're stretching the limits of a faux
        // chat app. Every time there is a new message, we only want to keep the
        // new ones. This is a case where some sort of queue would be a better
        // model
        if (handledMessages.hasOwnProperty(message.id)) {
          return;
        }
        handledMessages[message.id] = true;

        switch (message.thread.id) {
          case tEcho.id:
            // echo back the same message to the user
            store.dispatch(ThreadActions.addMessage(tEcho, {
              author: echo,
              text: message.text
            }));

            break;
          case tRev.id:
            // echo back the message reveresed to the user
            store.dispatch(ThreadActions.addMessage(tRev, {
              author: rev,
              text: message.text.split('').reverse().join('')
            }));

            break;
          case tWait.id:
            let waitTime: number = parseInt(message.text, 10);
            let reply: string;

            if (isNaN(waitTime)) {
              waitTime = 0;
              reply = `I didn\'t understand ${message}. Try sending me a number`;
            } else {
              reply = `I waited ${waitTime} seconds to send you this.`;
            }

            setTimeout(
              () => {
                store.dispatch(ThreadActions.addMessage(tWait, {
                  author: wait,
                  text: reply
                }));
              },
              waitTime * 1000);

            break;
          case tWordCount.id:
            const textWordCount = message.text.split(' ').length;
            store.dispatch(ThreadActions.addMessage(tWordCount, {
              author: wordCount,
              text: textWordCount
            }));
            break;
          case md5Thread.id:
            const hashedText = Md5.hashStr(message.text);
            store.dispatch(ThreadActions.addMessage(md5Thread, {
              author: md5Bot,
              text: hashedText
            }));
            break;
          default:
            break;
        }
      });
  });
}
