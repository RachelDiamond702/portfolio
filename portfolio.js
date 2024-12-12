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
                <img src="images/${projimg}" alt="${data.projects[i].name}">
            </div>
        </div>
    </a>`;

    // Ensure all images for the project are shown on the index page
    const projectImages = data.projects[i].images;
    if (projectImages && projectImages.length > 0) {
      projectImages.forEach(image => {
        // Dynamically add images for the project to the main portfolio page
        const imageContainer = document.getElementById("projects");
        const imgElement = document.createElement("img");
        imgElement.src = `images/${image}`;
        imgElement.alt = `${data.projects[i].name} image`;
        imgElement.classList.add("project-image");
        imageContainer.appendChild(imgElement);
      });
    }
  }

  // Store projects in localStorage
  localStorage.setItem('projectsData', JSON.stringify(data.projects));  // **New change to store all projects in localStorage**
}

// Event listener for category filter buttons
document.querySelectorAll("#buttons button").forEach(button => {
  button.addEventListener("click", e => {
    const category = e.target.value;
    sortProjects(category); // Filter projects based on category
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
  const project = getProjectBySubdomain(subdomain);  // Fetch the project data by subdomain
  localStorage.setItem('currentProject', JSON.stringify(project));  // Store the project in localStorage
}

// Get project data by subdomain
function getProjectBySubdomain(subdomain) {
  const projects = JSON.parse(localStorage.getItem('projectsData'));
  
  return projects ? projects.find(project => project.subdomain === subdomain) : null;  // Find the correct project from stored data
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

            // Add left and right buttons for the carousel
            const prevButton = document.createElement("button");
            prevButton.id = "prev-button";
            prevButton.classList.add("carousel-btn");
            prevButton.innerText = "←";
            carouselContainer.appendChild(prevButton);

            const imageContainer = document.createElement("div");
            imageContainer.id = "carousel-images";
            carouselContainer.appendChild(imageContainer);

            const nextButton = document.createElement("button");
            nextButton.id = "next-button";
            nextButton.classList.add("carousel-btn");
            nextButton.innerText = "→";
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

            // Carousel function
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
            // This ensures images appear on the index page, without carousel logic.
            const imageContainer = document.getElementById("project-images");
            project.images.forEach(image => {
                const img = document.createElement("img");
                img.src = `images/${image}`;
                img.alt = `${project.name} image`;
                img.classList.add("project-image");  // Add a separate class for non-carousel images
                imageContainer.appendChild(img);
            });
        }
    }
});

