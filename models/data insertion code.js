const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');

// Set up express app
const app = express();

// Connect to the database
const dbURI = 'mongodb+srv://shaun:amandubey123@nodetuts.eswobdi.mongodb.net/project?retryWrites=true&w=majority';
mongoose.connect(dbURI)
  .then(() => {
    // Read CSV file and insert data into MongoDB
    const jsonArray = [];
    fs.createReadStream('./datas/frontendskillandcount.csv')
      .pipe(csv())
      .on('data', (row) => {
        // Assuming CSV columns are 'skill' and 'count'
jsonArray.push({
  skill: row.skill,
  count: parseInt(row.count) || 0, // Convert to integer or default to 0 if not a valid number
  percentage: (parseInt(row.percentage) >= 0 && parseInt(row.percentage) <= 100) ? parseInt(row.percentage) : 0
        });
      })
      .on('end', async () => {
        // Define Mongoose schema for the data
        const dataSchema = new mongoose.Schema({
          skill: String,
          count: Number,
          percentage:Number
        });

        // Create Mongoose model based on the schema
        const DataModel = mongoose.model('frontend engineer', dataSchema);

        // Insert JSON data into MongoDB using Mongoose model
        await DataModel.insertMany(jsonArray);
        console.log('Data inserted into MongoDB');
      });
  })
  .then(() => {
    // Start the server
    app.listen(3000, () => {
      console.log('Server is listening on port 3000');
    });
  })
  .catch((err) => console.log(err));
