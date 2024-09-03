async function fetchAndDisplayCounts() {
    try {
        // Use a relative path so that the correct backend URL is used, regardless of the environment
        const response = await fetch('/project-status');
        const counts = await response.json();

        document.getElementById('app').innerHTML = `
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-white">AGG SOC Dashboard</h1>
            </div>

            <hr class="border-t-2 border-gray-300 mb-8">

            <div class="mb-8">
                <h2 class="text-3xl font-bold text-left text-white">SOC Tickets</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div class="bg-red-600 text-white rounded-lg p-8 text-center">
                    <p class="text-6xl font-bold">${counts.open}</p>
                    <p class="text-3xl mt-4">Open</p>
                </div>
                <div class="bg-yellow-500 text-white rounded-lg p-8 text-center">
                    <p class="text-6xl font-bold">${counts.inProgress}</p>
                    <p class="text-3xl mt-4">In Progress</p>
                </div>
                <div class="bg-green-600 text-white rounded-lg p-8 text-center">
                    <p class="text-6xl font-bold">${counts.done}</p>
                    <p class="text-3xl mt-4">Done</p>
                </div>
            </div>

            <hr class="border-t-2 border-gray-300 mb-8">

            <div class="mb-8">
                <h2 class="text-3xl font-bold text-left text-white">Certificates</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Add content for the Certificates section here -->
                <div class="bg-red-600 text-white rounded-lg p-8 text-center">
                    <p class="text-6xl font-bold">${counts.overdueCert}</p>
                    <p class="text-3xl mt-4">Overdue</p>
                </div>
                <div class="bg-yellow-500 text-white rounded-lg p-8 text-center">
                    <p class="text-6xl font-bold">${counts.DueLess4_cert}</p>
                    <p class="text-3xl mt-4">Due Within <= 4 Weeks </p>
                </div>
                <div class="bg-green-600 text-white rounded-lg p-8 text-center">
                    <p class="text-6xl font-bold">${counts.DueMore4_cert}</p>
                    <p class="text-3xl mt-4">Due Within > 4 Weeks</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching project counts:', error);
    }
}

// Call the function initially to load data
fetchAndDisplayCounts();

// Optionally refresh the data periodically
setInterval(fetchAndDisplayCounts, 60000);  // Refresh data every 1 minute
