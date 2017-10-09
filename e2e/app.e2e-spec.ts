import { AngularReduxChatPage } from './app.po';

describe('angular-redux-chat App', () => {
  let page: AngularReduxChatPage;

  beforeEach(() => {
    page = new AngularReduxChatPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
