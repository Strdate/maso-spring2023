/* @refresh reload */
import { render } from 'solid-js/web';
import { App } from './App';
import { Meteor } from 'meteor/meteor';
import { Router } from "@solidjs/router";
//import {autoTracker} from 'solid-meteor-data/autoTracker';

Meteor.startup(() => {
  //autoTracker()
  render(() =>
    <Router>
      <App/>
    </Router>, document.getElementById('root'));
})
