const Role = require('../models/roles');
const Data = require('../models/datamodel');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const axios = require('axios');
require('dotenv').config();
const render_homepage=(req,res)=>{
    res.render('home.ejs')
}

const render_index = (req, res) => {
    Role.find()
        .then((roles) => {
            res.render('index', { roles: roles, title: 'SkillWind' }); // Passing title here
        })
        .catch((err) => {
            console.error('Error rendering index:', err);
            res.status(500).send('Internal Server Error');
        });
}

const render_ml_form=async(req,res)=>{
    res.render('jobform.ejs',{title:'SkillFit'});

}
const render_ml_response = async (req, res) => {
    try {
        
        const data = {
            skill1: req.body.skill1.toLowerCase(),
            skill2: req.body.skill2.toLowerCase(),
            skill3: req.body.skill3.toLowerCase(),
            skill4: req.body.skill4.toLowerCase(),
            skill5: req.body.skill5.toLowerCase()
        };

        // Send post req to url using axios
        const response = await axios.post(process.env.ML_API, data);

        // Log the response data
        //  console.log(response.data[0].percentage);
        //logic if invalid skills are entered the model give abrupt output if so then alert
        const firstPercentage = response.data[0].percentage 

        if (firstPercentage < 20) {
            res.send(`
            <script>
                alert("Please enter valid skills,for details refer to about section");
                window.history.back(); // This will navigate the user back to the previous page
            </script>
        `);
        } 
        else {
            res.render('recommender.ejs', { data: response.data ,title:'SkillFit'}); 
        }

     
    
    } catch (error) {
        console.error('Error making request:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

//here asyn and awit is used to chain the promises asyn return promises and make the section of code asynchronous and await waits until the promise is resolved and assign the promises resolved data is assign to object this helps is sequnece execution
const render_skillwind_charts = async (req, res) => {
    let roleName = decodeURIComponent(req.params.rolename);
    //   console.log(roleName);
    let locName = req.params.locname;
    // console.log(locName);
    //try and catch block

    try {
        locName = decodeURIComponent(locName);
        // console.log('Location Name:', locName);

        const locationCollection = mongoose.connection.db.collection(locName);

        if (!locationCollection) {
            console.error('Collection not found:', locName);
            return res.status(404).send('Page Not Found');
        }

        const locations = await locationCollection.find({}).toArray();
        if (!locations || locations.length === 0) {
            console.error('No data found in collection:', locName);
         return res.status(404).send('Page Not Found');
        }
        // console.log(locations)

        roleName = decodeURIComponent(roleName);
        // console.log('Role Name:', roleName);

        const projectCollection = mongoose.connection.db.collection(roleName);

        if (!projectCollection) {
            console.error('Collection not found:', roleName);
            return res.status(404).send('Page Not Found');
        }

        const projects = await projectCollection.find({}).toArray();
        if (!projects || projects.length === 0) {
            console.error('No projects found in collection:', roleName);
            return res.status(404).send('Page Not Found');
        }
       
        const roles = await Role.find();
        const data = {
            roleName: roleName,
            projects: projects,
            roles: roles ,
            locName: locName,
            locations: locations
        };

        //console.log(projects);
        res.render('details', {title:'SkillWind',data:data});
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal Server Error');
    }
};
const render_about=(req,res)=>{
    res.render('abouts.ejs',{title:'About'})
}




//modules exported to be used in routes 

module.exports = {
    render_index,
    render_skillwind_charts,
    render_ml_form,
    render_ml_response,
    render_homepage,
    render_about
};
