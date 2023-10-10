const express = require('express');
const axios = require('axios');
const _ = require('lodash');

const app = express();
const port = 3000; // You can change this to your desired port.

app.use(express.json());

// Middleware for making the API request and performing data analysis
app.get('/api/blog-stats', async (req, res) => {
  try {
    // Make the HTTP request to the third-party blog API
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
      },
    });

    const blogData = response.data;

    // Calculate the total number of blogs
    const totalBlogs = blogData.length;

    // Find the blog with the longest title
    const longestBlog = _.maxBy(blogData, (blog) => blog.title.length);

    // Determine the number of blogs with titles containing the word "privacy"
    const privacyBlogs = _.filter(blogData, (blog) => blog.title.toLowerCase().includes('privacy'));

    // Create an array of unique blog titles
    const uniqueTitles = _.uniqBy(blogData, 'title');

    // Respond to the client with the JSON object containing statistics
    res.json({
      totalBlogs,
      longestBlog: longestBlog.title,
      privacyBlogs: privacyBlogs.length,
      uniqueTitles: uniqueTitles.map((blog) => blog.title),
    });
  } catch (error) {
    // Handle errors and respond with an appropriate error message
    res.status(500).json({ error: 'An error occurred while fetching and analyzing blog data.' });
  }
});

// Blog search endpoint
app.get('/api/blog-search', (req, res) => {
  const query = req.query.query.toLowerCase(); // Convert query to lowercase for case-insensitive search

  if (!query) {
    return res.status(400).json({ error: 'Please provide a search query.' });
  }

  try {
    // Implement search functionality
    const searchResults = blogData.filter((blog) => blog.title.toLowerCase().includes(query));

    res.json(searchResults);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: 'An error occurred during the search.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
