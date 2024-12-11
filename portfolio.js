fetch('/portfolio.json')
.then(response => {
    return response.json();
}).then(projects => {
    console.log(projects);
    parsedata(projects);
}).catch(err => {
    console.log(`error: ${err}`);
});

// loops through each project
function parsedata(data) {
  for (let i = 0; i < data.projects.length; i++) {
    const projimg = data.projects[i].mainimage;
    document.getElementById("projects").innerHTML += `<a href = "${data.projects[i].subdomain}.html">
    <div class="row project" id="${data.projects[i].subdomain}">
    <div class="description"><h2>${data.projects[i].name}</h2><p class="subtitle">${data.projects[i].subtitle}</p>
    <p>${data.projects[i].abstract}</p></div>
    <div class="projimg"><img src="images/${projimg}"></div>
    </div></a>`; //div for content

  }
}

// Event Listeners
document.querySelectorAll("#buttons button").forEach(button => {
    button.addEventListener("click", e => {
        const category = e.target.value;
        sortProjects(category);
    });
});

//Filter
function sortProjects(category){
    const projects = document.querySelectorAll("#projects.project");

    if (category === "clear"){
        projects.forEach(project => {
            project.computedStyleMap.display = "flex";
        });
    } else {
        project.style.display = "none";
    };
}

//carousel 
document.addEventListener('DOMContentLoaded', function() {
    const prevButton = document.querySelector('.carousel-control.prev');
    const nextButton = document.querySelector('.carousel-control.next');
    const carouselImages = document.querySelectorAll('.carousel-images img');
    let currentIndex = 0;

    function showImage(index) {
        carouselImages.forEach((img, i) => {
            img.style.display = i === index ? 'block' : 'none';
        });
    }

    showImage(currentIndex);

    // Event listener for the "next" button
    nextButton.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % carouselImages.length;
        showImage(currentIndex);
    });

    // Event listener for the "previous" button
    prevButton.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + carouselImages.length) % carouselImages.length;
        showImage(currentIndex);
    });
});
