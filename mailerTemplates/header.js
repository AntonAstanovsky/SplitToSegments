class sliderClass {
    constructor(sliderDomElement,slideClassName) {
      this.slideNumber = 1;
      this.left = 0;
      this.sliderElementsMaxHeight = 0;
      this.direction = {
        right: "+",
        left: "-",
      }
      this.slideClassName = slideClassName;
      this.sliderElements = null;
      this.numberOfSlides = 0;
      this.sliderElement = sliderDomElement;
      this.setHeightLength();
    }
    setHeightLength() {
      let slides = this.sliderElement.getElementsByClassName(this.slideClassName);
      this.sliderElements = Array.from(this.sliderElement.getElementsByClassName(this.slideClassName));
      this.numberOfSlides = this.sliderElements.length;
      this.sliderElement.style.width = (100 * this.numberOfSlides) + '%';
      this.sliderElements.forEach((element,index) => { 
        let width = 100 / this.numberOfSlides;
        element.style.width = width + '%';
        element.style.left = (index * width) +  '%';
        if (element.offsetHeight > this.sliderElementsMaxHeight) { 
          this.sliderElementsMaxHeight = element.offsetHeight; 
        } 
      });
      this.sliderElement.style.height = this.sliderElementsMaxHeight + 'px';
    }
    slide(direction) {
      if(direction == this.direction.right) {
        this.left -= 100;
        this.slideNumber++;
        if(this.slideNumber > this.numberOfSlides) { 
          this.slideNumber = 1; 
          this.left = 0;
        }
      }
      else if(direction == this.direction.left) {
        this.left += 100;
        this.slideNumber--;
        if(this.slideNumber < 1) { 
          this.slideNumber = this.numberOfSlides; 
          this.left = 100 - this.numberOfSlides * 100;
        }
      }
      this.sliderElement.style.left = this.left + '%';
    }
    slideRight() {
      this.slide(this.direction.right);
    }
    slideLeft() {
      this.slide(this.direction.left);
    }
    goToSlide(number) {
      let attempt = 0;
      while(this.slideNumber != number) {
        this.slideRight();
        attempt++;
        if(attempt > 10) { console.log('too many attempts!'); break; }
      }
    }
  }