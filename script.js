require('dotenv').config(); // Load environment variables

const express = require('express');
const fetch = require('node-fetch'); // Use require for CommonJS
const app = express();

const airtableApiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.BASE_ID;
const tableName = process.env.TABLE_NAME;
const port = process.env.PORT || 3000; // Use PORT environment variable or default to 3000

async function deleteMessages() {
    const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;
    
    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${airtableApiKey}` }
        });
        const data = await response.json();
        
        const deletePromises = data.records.map(record => {
            return fetch(`https://api.airtable.com/v0/${baseId}/${tableName}/${record.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${airtableApiKey}`
                }
            });
        });
        
        await Promise.all(deletePromises);
        console.log('Messages deleted from Airtable');
    } catch (error) {
        console.error('Error deleting messages:', error);
    }
}

// Schedule the function to run every 12 hours
const interval = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
setInterval(deleteMessages, interval);

// Run immediately on script start
deleteMessages();

// Set up a basic HTTP server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
