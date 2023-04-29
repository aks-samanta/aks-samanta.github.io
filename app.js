const sections = document.querySelectorAll(".section");
const sectBtns = document.querySelectorAll(".controls");
const sectBtn = document.querySelectorAll(".control");
const allSections = document.querySelectorAll(".main-content");

function PageTransitions() {
  //Button click active class

  for (let i = 0; i < sectBtn.length; i++) {
    sectBtn[i].addEventListener("click", function () {
      let currBtn = document.querySelectorAll(".active-btn");
      currBtn[0].className = currBtn[0].className.replace("active-btn", "");
      this.className += " active-btn";
    });

    
  }
  //toggle theme
  const themeBtn = document.querySelector(".theme-btn");
  themeBtn.addEventListener("click", () => {
    let element = document.body;
    element.classList.toggle("light-mode");
  });
}

PageTransitions();

const navLinks = document.querySelectorAll('.navbar a');

window.addEventListener('scroll', () => {
  const currentSection = sections.length - [...sections].reverse().findIndex((section) => window.scrollY >= section.offsetTop - 30) - 1;
  const activeLink = document.querySelector(`.navbar a[href="#${sections[currentSection].id}"]`);

  navLinks.forEach((link) => {
    link.classList.remove('active');
    link.querySelector('.control').classList.remove('active-btn');
  });

  activeLink.classList.add('active');
  activeLink.querySelector('.control').classList.add('active-btn');
});

function downloadResume() {
  // Replace the URL below with the direct download link to your resume
  const downloadLink = "./pdf/Akash_Samanta_Resume.pdf";
  
  // Create a temporary link element and set its attributes
  const link = document.createElement("a");
  link.setAttribute("href", downloadLink);
  link.setAttribute("download", "Akash Samanta Resume");
  
  // Click the link to start the download
  link.click();
  
  // Open the Google Drive link in a new tab
  window.open("https://drive.google.com/file/d/1Y8Mof5D-2E3QAmG0Gd3En6l_rySZUmhD/view?usp=sharing", "_blank");
}
