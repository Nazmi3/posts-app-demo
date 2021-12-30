import React from 'react';
import { describe } from 'riteway';
import render from 'riteway/render-component';
import match from 'riteway/match';
import MyHeader from './pages/templates/MyHeader';
describe('Demo component', async assert => {
  const userName = 'Spiderman';
  const $ = render(<MyHeader loggedin = {false} updateState={()=>{console.log('receive update state from child')}} />);
  const contains = match($('.testclass').html());
  assert({
    given: 'Login state',
    should: 'Have',
    actual: contains("Login"),
    expected: "Login"
  });
});