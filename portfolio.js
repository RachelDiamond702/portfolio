// Fetch the JSON data containing project details 
fetch('portfolio.json')
  .then(response => response.json())
  .then(projects => {
    console.log(projects);
    parsedata(projects);
  })
  .catch(err => {
    console.log(`Error: ${err}`);
  });

// Loop through each project and display it on the main page
function parsedata(data) {
  for (let i = 0; i < data.projects.length; i++) {
    const projimg = data.projects[i].mainimage;
    const categories = Array.isArray(data.projects[i].category) ? data.projects[i].category : [data.projects[i].category];

    // Add each project to the page
    document.getElementById("projects").innerHTML += `
    <a href="project-detail.html" onclick="saveProjectToLocalStorage('${data.projects[i].subdomain}')">
        <div class="row project ${categories.join(' ')}" id="${data.projects[i].subdomain}">
            <div class="description">
                <h2>${data.projects[i].name}</h2>
                <p>${data.projects[i].abstract}</p>
            </div>
            <div class="projimg">
                <img src="images/${projimg}" alt="${data.projects[i].name} main image">
            </div>
        </div>
    </a>`;
  }

  // Store projects in localStorage
  localStorage.setItem('projectsData', JSON.stringify(data.projects));
}

// Event listener for category filter buttons
document.querySelectorAll("#buttons button").forEach(button => {
  button.addEventListener("click", e => {
    const category = e.target.value;
    sortProjects(category);
  });
});

// Function to filter projects based on selected category
function sortProjects(category) {
  const projects = document.querySelectorAll("#projects .project");

  if (category === "clear") {
    projects.forEach(project => project.style.display = "flex");
  } else {
    projects.forEach(project => {
      if (project.classList.contains(category)) {
        project.style.display = "flex";
      } else {
        project.style.display = "none";
      }
    });
  }
}

// Function to store project details
function saveProjectToLocalStorage(subdomain) {
  const project = getProjectBySubdomain(subdomain);
  localStorage.setItem('currentProject', JSON.stringify(project));
}

// Get project data by subdomain
function getProjectBySubdomain(subdomain) {
  const projects = JSON.parse(localStorage.getItem('projectsData'));

  // Find the correct project from stored data
  return projects ? projects.find(project => project.subdomain === subdomain) : null;
}

// Event listener for project-detail page
document.addEventListener("DOMContentLoaded", function() {
    // Retrieve the project data from localStorage
    const project = JSON.parse(localStorage.getItem('currentProject'));

    if (project) {
        // Update the project name
        document.getElementById("project-name").innerText = project.name;
        
        // Update the project description
        document.getElementById("project-description").innerText = project.description;

        // Check if we are on the project-detail page
        if (window.location.pathname.includes("project-detail.html")) {
            // Create the carousel container
            const carouselContainer = document.createElement("div");
            carouselContainer.id = "carousel-container";
            document.getElementById("project-images").appendChild(carouselContainer);

            // Add buttons for the carousel
            const prevButton = document.createElement("button");
            prevButton.id = "prev-button";
            prevButton.classList.add("carousel-btn");
            prevButton.innerText = "<";
            carouselContainer.appendChild(prevButton);

            const imageContainer = document.createElement("div");
            imageContainer.id = "carousel-images";
            carouselContainer.appendChild(imageContainer);

            const nextButton = document.createElement("button");
            nextButton.id = "next-button";
            nextButton.classList.add("carousel-btn");
            nextButton.innerText = ">";
            carouselContainer.appendChild(nextButton);

            // Display all the images for the project in the carousel
            const images = project.images;
            images.forEach((image, index) => {
                const img = document.createElement("img");
                img.src = `images/${image}`;
                img.alt = `${project.name} Image ${index + 1}`;
                img.classList.add("carousel-image");
                imageContainer.appendChild(img);
            });

            // Carousel function to update image position
            let currentImageIndex = 0;
            const carouselImages = document.querySelectorAll("#carousel-images .carousel-image");

            function updateCarousel() {
                const offset = -currentImageIndex * 100;
                imageContainer.style.transform = `translateX(${offset}%)`;
            }

            // Event listeners for next and previous buttons
            prevButton.addEventListener("click", function() {
                if (currentImageIndex > 0) {
                    currentImageIndex--;
                } else {
                    currentImageIndex = carouselImages.length - 1;
                }
                updateCarousel();
            });

            nextButton.addEventListener("click", function() {
                if (currentImageIndex < carouselImages.length - 1) {
                    currentImageIndex++;
                } else {
                    currentImageIndex = 0;
                }
                updateCarousel();
            });

            updateCarousel();
        } else {
            const imageContainer = document.getElementById("project-images");
            const mainImage = project.mainimage;
            const img = document.createElement("img");
            img.src = `images/${mainImage}`;
            img.alt = `${project.name} main image`;
            img.classList.add("project-image");
            imageContainer.appendChild(img);
        }
    }
});

