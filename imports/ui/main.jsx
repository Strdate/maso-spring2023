/* @refresh reload */
import { render } from 'solid-js/web';
import { App } from './App';
import { Meteor } from 'meteor/meteor';
import { Router } from "@solidjs/router";

Meteor.startup(() => {
  render(() =>
    <Router>
      <App/>
    </Router>, document.getElementById('root'));
})
