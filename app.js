const sections = document.querySelectorAll('.section');
const sectBtns = document.querySelectorAll('.controls');
const sectBtn = document.querySelectorAll('.control');
const allSections = document.querySelectorAll('.main-content');
document.getElementById("dual_fn_res").addEventListener("click", dual_fn);
function dual_fn() {
    window.location.href = "https://drive.google.com/file/d/1Y8Mof5D-2E3QAmG0Gd3En6l_rySZUmhD/view?usp=sharing";
}

function PageTransitions(){
    //Button click active class

    for(let i = 0; i < sectBtn.length; i++){
        sectBtn[i].addEventListener("click", function(){
            let currBtn = document.querySelectorAll(".active-btn");
            currBtn[0].className = currBtn[0].className.replace("active-btn","");
            this.className += " active-btn";
        })
    }
    //toggle theme
    const themeBtn = document.querySelector(".theme-btn");
    themeBtn.addEventListener("click",()=>{
        let element = document.body;
        element.classList.toggle("light-mode");
    })
}

PageTransitions();

allSections.forEach(addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    if(id){
        //remove selected from the other button
        sectBtns.forEach((btn)=>{
            btn.classList.remove("active");
        })
        e.target.classList.add("active");

        //hide other sections

        sections.forEach((section) => {
            // section.classList.remove("active");

        })

        const element = document.getElementById(id);
        // element.classList.add("active");
    }
    
}))
