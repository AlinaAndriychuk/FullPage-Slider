'use-strict';

class MyFullPage {

  constructor(dots, duration) {
    this.amountOfPages = document.querySelectorAll('.section').length;
    this.animationFinished = true;
    this.dots = dots;
    this.currentPage = 0;
    this.debounce;
    this.duration = duration;

    this.readyToScroll();
    this.setSideNavigation();
    this.addScrollListener();
  }

  readyToScroll() {
    setTimeout(()=> window.scrollTo(0, 0), 30)
  }

  setSideNavigation() {
    if (!this.dots) {
      return;
    }

    const sideBar = document.createElement('div');
    sideBar.className = 'js-sideBar';
    document.body.append(sideBar);

    for (let i = 0; i < this.amountOfPages; i++) {
      const dot = document.createElement('div');
      dot.className = 'js-dot';
      sideBar.append(dot);
    }

    this.activeDot = sideBar.firstChild;
    this.activeDot.classList.add('is-active')
  }

  changeActiveButton(activeDot, num) {
    const nextActiveDot = document.querySelectorAll('.js-dot')[num];
    
    activeDot.classList.remove('is-active');
    nextActiveDot.classList.add('is-active');
    this.activeDot = nextActiveDot;
  }

  on(event, f) {
    if(event === 'end') {
      this.doEndFunction = true;
      this.endFunction = f;
    } else if (event === 'start'){
      this.doStartFunction = true;
      this.startFunction = f;
    }
  }

  debounceFunction(f, animationFinished, ms) {
  
    return function() {
      if (!animationFinished) return;
      f.apply(this, arguments);
  
      this.animationFinished = false;
  
      setTimeout(() => this.animationFinished = true, ms);
    };
  
  }

  goto(num, activeDot, amountOfPages, duration) {
    let numberOfPage = num;

    if (this.amountOfPages && num >= this.amountOfPages) {
      numberOfPage === this.amountOfPages - 1;
    } else if (num >= amountOfPages) {
      numberOfPage === amountOfPages - 1;
    }

    gsap.to('body', {position: 'relative', top: -100 * numberOfPage + 'vh', duration: duration});

    if (this.activeDot) {
      this.changeActiveButton(this.activeDot, numberOfPage);
    } else if (activeDot) {
      this.changeActiveButton(activeDot, numberOfPage);
    }

    this.currentPage = numberOfPage;
  }

  addScrollListener(e) {
    window.addEventListener('mousewheel', e => {

      if (!this.animationFinished) {
        return;
      }

      let previous = 1;
      if (e.deltaY < 0 && this.currentPage === 0) {
        return;
      } else if (e.deltaY < 0) {
        previous = -1;
      } else if (this.currentPage >= this.amountOfPages - 1|| e.deltaY === 0) {
        return;
      }
      
      setTimeout(()=> {
        if(this.currentPage >= this.amountOfPages - 1 && e.deltaY > 0 && this.endFunction) {
          this.endFunction();
        }
      }, 1300);

      if (this.currentPage === 0 && e.deltaY > 0 && this.startFunction) {
        this.startFunction();
      }

      this.debounce = this.debounceFunction(
        ()=> {
          this.goto(this.currentPage + previous, this.activeDot, this.amountOfPages, this.duration);
      }, this.animationFinished, 1300);
      this.debounce();

    });
  };

}
