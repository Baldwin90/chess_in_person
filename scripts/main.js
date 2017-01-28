const View = require('./view');

document.addEventListener('DOMContentLoaded', function(){
  let mainEl = document.getElementsByClassName('main')[0];
  new View(mainEl);
});
