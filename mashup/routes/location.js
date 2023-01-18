const express = require('express');
const axios = require('axios');
const https = require('https');
const fs = require('fs');

const router = express.Router();

// ---get location---
// ---yahoo weather api---
router.get('/:location', async(req, res)=>{
    try{
        const options4 = {
            method: 'GET',
            url: 'https://yahoo-weather5.p.rapidapi.com/weather',
            params: {location: req.params.location, format: 'json', u: 'f'},
            headers: {
                'X-RapidAPI-Key': process.env.WEATHER,
                'X-RapidAPI-Host': 'yahoo-weather5.p.rapidapi.com'
            }
        };

        let response = await axios.request(options4).catch(function (error) {
            console.log("yahoo weather api fetching options4", error);
        });

        res.json(response.data)
    }
    catch(err){
        console.log("error fetching the page", err);
    }
})
// ---get location---
// ---yahoo weather api---

module.exports = router;




