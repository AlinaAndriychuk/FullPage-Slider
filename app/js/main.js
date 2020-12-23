'use-strict';

let fullPage = new MyFullPage(true, 1.3);

fullPage.on('start', hi);
fullPage.on('end', bye);

setTimeout(()=> fullPage.goto(3), 5000)

function hi() {
  alert('start sliding');
}

function bye() {
  alert('end sliding');
}