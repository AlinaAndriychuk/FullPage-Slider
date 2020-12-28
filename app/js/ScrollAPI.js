'use-strict';

class MyFullPage {

  constructor(config) {
    this.pages = document.querySelectorAll('.section');
    this.amountOfPages = this.pages.length;
    this.animationFinished = true;
    this.dots = config.dots;
    this.currentPage = 0;
    this.debounce = null;
    this.duration = config.duration;
    this.callback = {
      start: null,
      end: null,
    }

    this.init();
  }

  init() {
    this.readyToScroll();
    this.setSideNavigation();
    this.addScrollListener();
  }

  readyToScroll() {
    setTimeout(()=> window.scrollTo(0, 0), 35)
  }

  setSideNavigation() {
    if (!this.dots) {
      return;
    }

    const sideBar = document.createElement('div');
    sideBar.classList.add('js-sideBar');
    document.body.append(sideBar);

    this.pages.forEach( () => {
      const dot = document.createElement('div');
      dot.className = 'js-dot';
      sideBar.append(dot);
    })

    this.activeDot = sideBar.firstChild;
    this.activeDot.classList.add('is-active')
  }

  changeActiveButton(num) {
    const nextActiveDot = document.querySelectorAll('.js-dot')[num];
    
    this.activeDot.classList.remove('is-active');
    nextActiveDot.classList.add('is-active');
    this.activeDot = nextActiveDot;
  }

  on(event, f) {
    this.callback[event] = f;
  }

  debounceFunction(f, ms) {
  
    return function() {
      if (!this.animationFinished) return;
      f.apply(this, arguments);
  
      this.animationFinished = false;
  
      setTimeout(() => this.animationFinished = true, ms);
    };
  
  }

  goto(num) {
    let numberOfPage = num;

    if (num >= this.amountOfPages) {
      numberOfPage = this.amountOfPages - 1;
    } else if (num < 0) {
      numberOfPage = 0;
    }

    gsap.to('body', {position: 'relative', top: -100 * numberOfPage + 'vh', duration: this.duration});

    if (this.dots) {
      this.changeActiveButton(numberOfPage);
    }
    this.currentPage = numberOfPage;
  }

  addScrollListener(e) {
    window.addEventListener('mousewheel', e => {

      if (!this.animationFinished) {
        return;
      }

      // this.currentPage === 0 && e.deltaY > 0 && this.callback.start
      if (this.callback.start) {
        this.callback.start();
      }

      let previous = 1;
      if (e.deltaY < 0 && this.currentPage === 0) {
        return;
      } else if (e.deltaY < 0) {
        previous = -1;
      } else if (this.currentPage >= this.amountOfPages - 1|| e.deltaY === 0) {
        return;
      }

      this.debounce = this.debounceFunction(
        ()=> {
          this.goto(this.currentPage + previous);
      }, 1300);
      this.debounce();

      // this.currentPage >= this.amountOfPages - 1 && e.deltaY > 0 && this.callback.end
      setTimeout(()=> {
        if(this.callback.end) {
          this.callback.end();
        }
      }, 1300);

    });
  };

}
