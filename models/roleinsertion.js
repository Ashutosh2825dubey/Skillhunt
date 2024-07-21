const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');


const app = express();

const dbURI = 'mongodb+srv://shaun:amandubey123@nodetuts.eswobdi.mongodb.net/project?retryWrites=true&w=majority';
mongoose.connect(dbURI)
  .then(() => {
  
    const jsonArray = [];
    fs.createReadStream('./roles.csv')
      .pipe(csv())
      .on('data', (row) => {
       
        jsonArray.push({
          role: row.role,
          reference: row.reference,
          locdata: row.locdata
        });
      })
      .on('end', async () => {
      
        const dataSchema = new mongoose.Schema({
          role: String,
          reference: String,
          locdata: String
        });

     
        const Role = mongoose.model('role', dataSchema);

        
        await Role.insertMany(jsonArray);
        console.log('Data inserted into MongoDB');
      });
  })
  .then(() => {
   
    app.listen(3000, () => {
      console.log('Server is listening on port 3000');
    });
  })
  .catch((err) => console.log(err));