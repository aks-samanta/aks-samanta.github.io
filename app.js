const sections = document.querySelectorAll('.section');
const sectBtns = document.querySelectorAll('.controls');
const sectBtn = document.querySelectorAll('.control');
const allSections = document.querySelectorAll('.main-content');


function PageTransitions(){
    //Button click active class

    for(let i = 0; i < sectBtn.length; i++){
        sectBtn[i].addEventListener("click", function(){
            let currBtn = document.querySelectorAll(".active-btn");
            currBtn[0].className = currBtn[0].className.replace("active-btn","");
            this.className += " active-btn";
        })
    }
}


PageTransitions();