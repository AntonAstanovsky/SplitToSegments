console.log("window yet to be loaded.");

  window.onload = function() {

    addClass(document.getElementById("sliderWrapper"),"sliderWrapper");
    addClass(document.getElementById("slider"),"slider");
    addClass(document.getElementById("navigator"),"navigator");

    let slider = new sliderClass(document.getElementById('slider'),'slide');
    let lastClickTime = new Date().getTime();

    /* ---- radio bullets ---- */
    for (i = 1; i <= slider.numberOfSlides; i++) {
      let bullet = document.querySelector("[data-slide='" + i +"']");
      if (bullet) { 
        bullet.addEventListener('click',() => { 
          let clickElement = event.target;
          while(!clickElement.getAttribute('data-slide')) {
            clickElement = clickElement.parentElement;
          }
          slider.goToSlide(parseInt(clickElement.getAttribute('data-slide')));
          lastClickTime = new Date().getTime();
        }); 
      }
    }
    let currentSlide = document.querySelector("[data-slide='" + slider.slideNumber +"']");
    currentSlide.click();
    let timerID = setInterval(function() { 
      if ((new Date().getTime() - lastClickTime) > 5 * 1000) {
        slider.slideRight();
        currentSlide = document.querySelector("[data-slide='" + slider.slideNumber +"']");
        currentSlide.click();
      }
    }, 5 * 1000); 
    /* ---- radio bullets ---- */

    /* ---- terms ---- */
    /*let titleElement = document.getElementById("tncSummary");
    let title = titleElement.innerHTML;
    let titleStyle = titleElement.getAttribute("style");
    titleElement.remove();

    let termContent = document.getElementById("tnc");
    
    document.getElementById("tnc").innerHTML = `<details><summary style="` + titleStyle + ` padding: 10px; outline: none;">` + title + `</summary>`+ termContent.innerHTML + `</details>`;*/
    /* ---- terms ---- */

  }

  function addClass(element,className) { 
    let currentClass = element.getAttribute('class');
    if (currentClass == null) {
       element.setAttribute('class',className);
    } else { 
      element.setAttribute('class',currentClass + ' ' + className); 
    }
  }

  function addEventListenersToArray (array,event,listenerFunction) {
    for (let item of array) {
      item.addEventListener(event, listenerFunction, false);
    }
  }