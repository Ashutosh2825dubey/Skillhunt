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
 
    const jsonArray = [];
    fs.createReadStream('./datas/frontendskillandcount.csv')
      .pipe(csv())
      .on('data', (row) => {
        
jsonArray.push({
  skill: row.skill,
  count: parseInt(row.count) || 0, 
  percentage: (parseInt(row.percentage) >= 0 && parseInt(row.percentage) <= 100) ? parseInt(row.percentage) : 0
        });
      })
      .on('end', async () => {
       
        const dataSchema = new mongoose.Schema({
          skill: String,
          count: Number,
          percentage:Number
        });

      
        const DataModel = mongoose.model('frontend engineer', dataSchema);

       
        await DataModel.insertMany(jsonArray);
        console.log('Data inserted into MongoDB');
      });
  })
  .then(() => {
  
    app.listen(3000, () => {
      console.log('Server is listening on port 3000');
    });
  })
  .catch((err) => console.log(err));
