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
    fs.createReadStream('./roles.csv')
      .pipe(csv())
      .on('data', (row) => {
        // Assuming CSV columns are 'role', 'reference', and 'locdata'
        jsonArray.push({
          role: row.role,
          reference: row.reference,
          locdata: row.locdata
        });
      })
      .on('end', async () => {
        // Define Mongoose schema for the data
        const dataSchema = new mongoose.Schema({
          role: String,
          reference: String,
          locdata: String
        });

        // Create Mongoose model based on the schema
        const Role = mongoose.model('role', dataSchema);

        // Insert JSON data into MongoDB using Mongoose model
        await Role.insertMany(jsonArray);
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