const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Set up express app
const app = express();

// Connect to the database
const dbURI = 'mongodb+srv://shaun:amandubey123@nodetuts.eswobdi.mongodb.net/project?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');

    // Read CSV file and insert data into MongoDB
    const jsonArray = [];
    // const filePath = path.join(__dirname, 'datas', 'analystlocations.csv');
    fs.createReadStream('./datas/dataengineerlocation2.csv')
      .pipe(csv())
      .on('data', (row) => {
        jsonArray.push({
          state: row.State,
          count: parseInt(row.Count) || 0, // Convert to integer or default to 0 if not a valid number
          percentage: (parseFloat(row.percentage) >= 0 && parseFloat(row.percentage) <= 100) ? parseFloat(row.percentage) : 0 ,// Validate percentage
          state_id:row.state_id,
          state_abbr:row.state_abbr

       
       
        });
      })
      .on('end', async () => {
        try {
          // Define Mongoose schema for the data
          const dataSchema = new mongoose.Schema({
            state: String,
            count: Number,
            percentage: Number,
            state_id:String,
            state_abbr:String



          });

          // Create Mongoose model based on the schema
          const DataModel = mongoose.model('dataengineerlocations', dataSchema);

          // Insert JSON data into MongoDB using Mongoose model
          await DataModel.insertMany(jsonArray);
          console.log('Location data inserted into MongoDB');
        } catch (error) {
          console.error('Error inserting data into MongoDB:', error);
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
      });
  })
  .then(() => {
    // Start the server
    app.listen(3000, () => {
      console.log('Server is listening on port 3000');
    });
  })
  .catch((err) => console.log('Error connecting to MongoDB:', err));
