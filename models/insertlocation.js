const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');


const app = express();


const dbURI = 'mongodb+srv://shaun:amandubey123@nodetuts.eswobdi.mongodb.net/project?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');


    const jsonArray = [];
 
    fs.createReadStream('./datas/dataengineerlocation2.csv')
      .pipe(csv())
      .on('data', (row) => {
        jsonArray.push({
          state: row.State,
          count: parseInt(row.Count) || 0,
          percentage: (parseFloat(row.percentage) >= 0 && parseFloat(row.percentage) <= 100) ? parseFloat(row.percentage) : 0 ,
          state_id:row.state_id,
          state_abbr:row.state_abbr

       
       
        });
      })
      .on('end', async () => {
        try {
      
          const dataSchema = new mongoose.Schema({
            state: String,
            count: Number,
            percentage: Number,
            state_id:String,
            state_abbr:String



          });


          const DataModel = mongoose.model('dataengineerlocations', dataSchema);

 
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

    app.listen(3000, () => {
      console.log('Server is listening on port 3000');
    });
  })
  .catch((err) => console.log('Error connecting to MongoDB:', err));
