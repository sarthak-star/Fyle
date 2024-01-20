const repositoriesList = document.getElementById('repositories-list');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
let currentPage = 1;
let maxRepositoriesPerPage = 9;

// Initial setup: Attach event listeners for pagination buttons
prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchRepositories();
    }
});

nextButton.addEventListener('click', () => {
    currentPage++;
    fetchRepositories();
});

function fetchRepositories() {
    const username = document.getElementById('username').value;
    const container = document.getElementById('container');
    const userContainer = document.getElementById('user-info');
    const repositoriesList = document.getElementById('repositories-list');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    // Clear previous results
    userContainer.innerHTML = '';
    repositoriesList.innerHTML = '';

    // Show loader
    const loader = document.createElement('p');
    loader.textContent = 'Loading user information and repositories...';
    userContainer.appendChild(loader);

    // Fetch user information using the GitHub API
    const userApiUrl = `https://api.github.com/users/${username}`;
    const repositoriesApiUrl = `https://api.github.com/users/${username}/repos?page=${currentPage}&per_page=${maxRepositoriesPerPage}`;

    // Fetch user information and repositories concurrently using Promise.all
    Promise.all([
        fetch(userApiUrl).then(response => response.json()),
        fetch(repositoriesApiUrl).then(response => response.json())
    ])
        .then(([user, repositories]) => {
            // Remove loader
            console.log(user);
            console.log(repositories);
            userContainer.removeChild(loader);

            // Display user information
            const userElement = document.createElement('div');
            userElement.className = "user-content";
            userElement.innerHTML = `
        <img src=${user?.avatar_url} alt="">
        <div>
        <h2>${user?.login}</h2>
        <p>Bio: ${user?.bio}</p>
        <p>Location: ${user?.location}</p>
        <p>Followers: ${user?.followers}</p>
        </div>
        <!-- Add more user information as needed -->
      `;
            userContainer.appendChild(userElement);

            // Display repositories
            repositories.forEach(repo => {
                const repoElement = document.createElement('div');
                repoElement.className = 'repository-item';
                repoElement.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description ? repo.description : 'No description'}</p>
                    <a href=${repo.html_url} target="_blank">${repo.html_url}</a>
                `;

                // Check if the repo has a 'topic' property and it is an array
                if (repo.topics && Array.isArray(repo.topics)) {
                    const topicsList = document.createElement('ul');
                    topicsList.className = 'topiclist';

                    // Loop through each topic and create a list item
                    repo.topics.forEach(topic => {
                        const topicElement = document.createElement('li');
                        topicElement.className = 'topicelement';
                        topicElement.textContent = topic;
                        topicsList.appendChild(topicElement);
                    });

                    // Append the topics list under the repository element
                    repoElement.appendChild(topicsList);
                }

                repositoriesList.appendChild(repoElement);
            });

            // Add pagination controls
            const canGoPrev = currentPage > 1;
            const canGoNext = repositories.length >= maxRepositoriesPerPage;
            prevButton.disabled = !canGoPrev;
            nextButton.disabled = !canGoNext;
        })
        .catch(error => {
            console.error('Error fetching user information or repositories:', error);
            userContainer.innerHTML = '<p>Error fetching data. Please check the username.</p>';
        });
}

function updateMaxRepositoriesPerPage() {
    maxRepositoriesPerPage = document.getElementById('max-repositories').value;
    // Optionally, you can also fetch repositories immediately after updating max repositories per page
    currentPage = 1;
    fetchRepositories();
}

