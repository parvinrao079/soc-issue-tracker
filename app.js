const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');  // Import the cors middleware
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const jiraUsername = process.env.JIRA_EMAIL;
const jiraApiToken = process.env.JIRA_API_TOKEN;
const jiraUrl = process.env.JIRA_URL; // Use the JIRA_URL environment variable

if (!jiraUsername || !jiraApiToken || !jiraUrl) {
    console.error("JIRA_EMAIL, JIRA_API_TOKEN, or JIRA_URL environment variable is not set.");
    process.exit(1);  // Exit the process with an error
}

const headers = {
    "Accept": "application/json"
};

const jqlInProgress = `filter=10034`;
const jqlDone = `filter=10035`;
const jqlOpen = `filter=10025`;
const certificateOverdue = `filter=10056`;
const certificateDueLess4 = `filter=10057`;
const certificateDueMore4 = `filter=10058`;

let projectCounts = {
    inProgress: 0,
    done: 0,
    open: 0,
    overdueCert: 0,
    DueLess4_cert: 0,
    DueMore4_cert: 0
};

let delay = 60000;  // Start with a 1-minute delay
const maxDelay = 300000; // Max delay set to 5 minutes

// Use the CORS middleware to handle cross-origin requests
app.use(cors());

async function fetchProjectCounts() {
    try {
        console.log('Starting API requests...');

        const [
            inProgressResponse,
            doneResponse,
            openResponse,
            overdueCertResponse,
            dueLess4CertResponse,
            dueMore4CertResponse
        ] = await Promise.all([
            axios.get(jiraUrl, {
                headers: {
                    ...headers,
                    "Authorization": `Basic ${Buffer.from(`${jiraUsername}:${jiraApiToken}`).toString('base64')}`
                },
                params: { jql: jqlInProgress }
            }),
            axios.get(jiraUrl, {
                headers: {
                    ...headers,
                    "Authorization": `Basic ${Buffer.from(`${jiraUsername}:${jiraApiToken}`).toString('base64')}`
                },
                params: { jql: jqlDone }
            }),
            axios.get(jiraUrl, {
                headers: {
                    ...headers,
                    "Authorization": `Basic ${Buffer.from(`${jiraUsername}:${jiraApiToken}`).toString('base64')}`
                },
                params: { jql: jqlOpen }
            }),
            axios.get(jiraUrl, {
                headers: {
                    ...headers,
                    "Authorization": `Basic ${Buffer.from(`${jiraUsername}:${jiraApiToken}`).toString('base64')}`
                },
                params: { jql: certificateOverdue }
            }),
            axios.get(jiraUrl, {
                headers: {
                    ...headers,
                    "Authorization": `Basic ${Buffer.from(`${jiraUsername}:${jiraApiToken}`).toString('base64')}`
                },
                params: { jql: certificateDueLess4 }
            }),
            axios.get(jiraUrl, {
                headers: {
                    ...headers,
                    "Authorization": `Basic ${Buffer.from(`${jiraUsername}:${jiraApiToken}`).toString('base64')}`
                },
                params: { jql: certificateDueMore4 }
            })
        ]);

        console.log('API requests successful');

        if (inProgressResponse.status === 200 && doneResponse.status === 200 && openResponse.status === 200 &&
            overdueCertResponse.status === 200 && dueLess4CertResponse.status === 200 && dueMore4CertResponse.status === 200) {

            projectCounts.inProgress = inProgressResponse.data.total || 0;
            projectCounts.done = doneResponse.data.total || 0;
            projectCounts.open = openResponse.data.total || 0;
            projectCounts.overdueCert = overdueCertResponse.data.total || 0;
            projectCounts.DueLess4_cert = dueLess4CertResponse.data.total || 0;
            projectCounts.DueMore4_cert = dueMore4CertResponse.data.total || 0;

            // Reset delay to initial value on successful request
            delay = 60000; // Reset to 1 minute
        } else {
            console.log('Failed to retrieve data.');
        }
    } catch (error) {
        handleRateLimitError(error);
    } finally {
        setTimeout(fetchProjectCounts, delay);
    }
}

function handleRateLimitError(error) {
    if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
        if (error.response.status === 429) {
            console.log('Rate limit exceeded. Increasing delay.');
            delay = Math.min(delay * 2, maxDelay); // Exponential backoff with max delay of 5 minutes
        }
    } else if (error.request) {
        console.error('No response received:', error.request);
    } else {
        console.error('Error setting up request:', error.message);
    }
    console.error('Config:', error.config);
}

// Serve the project counts via API endpoint
app.get('/project-status', (req, res) => {
    res.json(projectCounts);
});

// Serve the static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    fetchProjectCounts();
});
