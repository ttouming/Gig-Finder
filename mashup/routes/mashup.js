const express = require('express');
const axios = require('axios');
const https = require('https');
const fs = require('fs');

const router = express.Router();

// ---venues n events4---
router.get('/venues_events_data4', async (req, res)=>{

    try{

        var options1 = {
            method: 'GET',
            url: 'https://api.seatgeek.com/2/events?taxonomies.name=concert',
            params: {client_id: process.env.SEATGEEK, per_page: '100'},
            headers: {
              cookie: '_pxhd=-LUuvX-ViCKgaydss3edeFCQXdddOh-eq%2FY5qaIp%2FCNWKVjEl%2F-QxPqqQHhSv963t8PpzZvv4FmjDqqP4oxjqg%3D%3D%3AOVJ2uAumtqIF7SRzkhIcv2mWqj95xaJJAlmGH9ncCrCldNa3KNbS6oBrdd10dulErkFxW2T4-thCSgGOAVSrSCvPhKo0MMICeGUUDB9jzf0%3D'
            }
        };

        // ---youtube---
        const options6 = (performer)=>{
            return{
                method: 'GET',
                url: 'https://www.googleapis.com/youtube/v3/search',
                params: {
                    key: process.env.YOUTUBE,
                    q: performer,
                    type: 'vid',
                    part: 'snippet',
                    maxResults: '3'
                }
            }
        }
        // ---youtube---

        fetchOneByKey()

        let response = await axios.request(options1).catch(function(err){
            console.log("err fetching options1", err);
        })

        let eventsAll = response.data.events;

        // ---get all venue id---
        let venuesIdList = response.data.events.map((d)=>{
            return d.venue.id
        })
        // ---get all venue id---

        // ---filter venue id for repeation---
        venuesIdList = venuesIdList.filter(function(element, index, arr){
            return arr.indexOf(element) === index;
        })
        // ---filter venue id for repeation---

        // ---group events by venue id---
        function groupBy(xs, f) {
            return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
        }
        // ---group events by venue id---

        // ---getting url from youtube---
        let link
        await Promise.all(
            eventsAll.map(async(item)=>{
                await axios.request(options6(item.performers[0].name+" band music festival")).then(function(rsp){
                    
                    let index = 0;
                    while(rsp.data.items[index].id.videoId == undefined || rsp.data.items[index].id.videoId == null){
                        index++
                    }
                    link = rsp.data.items[index].id.videoId
                    console.log("---")
                    console.log(link)
                    console.log(rsp.data.items[index].id)
                    console.log(item.performers[0].name)                        
                }).catch(function(error){
                    console.log("ddd")
                    console.log("error fecting events",error);
                })
                item.ytLink = link
                item.counter =  k+1
            })
        )
        // ---getting url from youtube---

        // ---group by venue id---
        const eventsData = groupBy(eventsAll, (temp) => temp.venue.id)
        // ---group by venue id---

        res.json(eventsData)
        // getting youtube url

    }
    catch(err){
        console.log("error fetching the page", err);
    }

    

})
// ---venues n events4---

// ---aws---
var AWS = require("aws-sdk");
let awsConfig = {
    "region": "",
    "endpoint": "",
    "accessKeyId": process.env.AWS_ACCESS_KEY_ID, "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY,
    "sessionToken":process.env.AWS_SESSION_TOKEN
};
// input your aws configuration here

AWS.config.update(awsConfig);

let k= 0; //store counter value
// ---read---
let docClient = new AWS.DynamoDB.DocumentClient();
let fetchOneByKey = function () {
    var params = {
        TableName: "",
        Key: {
        }
    };
    // input your dynamodb tablename and key here
    docClient.get(params, function (err, data) {
        if (err) {
            console.log("users::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
        }
        else {
            console.log("users::fetchOneByKey::success - " + JSON.stringify(data, null, 2));
            console.log("---dddd")
            console.log(JSON.stringify(data));
            let temp = data;
            k = temp["Item"]["counter"];
            console.log("k: ", k)
            modify(k);
        }
    })
}
// ---read---

// ---update---
let modify = function (k) {

    
    var params = {
        TableName: "",
        Key: {
        },
        // input your dynamodb tablename and key here
        UpdateExpression: 'SET #counter = :val',
        ExpressionAttributeValues: {
            ":val": k+1
        },
        ExpressionAttributeNames: {
            "#counter": "counter"
        },  
        ReturnValues: "UPDATED_NEW"

    };
    docClient.update(params, function (err, data) {

        if (err) {
            console.log("users::update::error - " + JSON.stringify(err, null, 2));
        } else {
            console.log("users::update::success "+JSON.stringify(data) );
        }
    });
}
// ---update---
// ---aws---

module.exports = router;




