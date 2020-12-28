'use-strict';

let fullPage = new MyFullPage({dots: true, duration: 1.3});

fullPage.on('start', hi);
fullPage.on('end', bye);

setTimeout(()=> {
  fullPage.goto(3);
  console.log('fullPage.goto(3) after 5sec')
}, 5000)

function hi() {
  console.log('start sliding');
}

function bye() {
  console.log('end sliding');
}