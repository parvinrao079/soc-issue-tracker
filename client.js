async function fetchAndDisplayCounts() {
    try {
        const response = await fetch('http://localhost:3000/project-status');
        const counts = await response.json();

        document.getElementById('app').innerHTML = `
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-blue-500">SOC Issue Dashboard</h1>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white shadow-lg rounded-lg p-6">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">In Progress</h2>
                    <p class="text-3xl text-blue-600">${counts.inProgress}</p>
                </div>
                <div class="bg-white shadow-lg rounded-lg p-6">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">Done</h2>
                    <p class="text-3xl text-green-600">${counts.done}</p>
                </div>
                <div class="bg-white shadow-lg rounded-lg p-6">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4">Open</h2>
                    <p class="text-3xl text-red-600">${counts.open}</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching project counts:', error);
    }
}

// Call the function initially
fetchAndDisplayCounts();

// Optionally refresh the data periodically
setInterval(fetchAndDisplayCounts, 5000);
