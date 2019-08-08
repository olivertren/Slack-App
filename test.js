require("dotenv").config();
const axios = require("axios");

const PORT = process.env.PORT;
const ROOT_URL = "https://slack.com/api/";
const usersEndpoint = "users.info";
const headers = {
  "Content-Type": "application/x-www-form-urlencoded"
};

const data = [{
    id: 'UL3U3EUPQ',
    text: 'asgasd jfladsk  1:30 fasdgasdg',
    time: 130,
    name: 'Connor Barley'
  },
  {
    id: 'UL3U3EUPQ',
    text: 'asgasd 1:01 jfladsk  fasdgasdg',
    time: 101,
    name: 'Connor Barley'
  },
  {
    id: 'UL3U3EUPQ',
    text: '2:01',
    time: 201,
    name: 'Connor Barley'
  },
  {
    id: 'UL3U3EUPQ',
    text: ':48',
    time: 48,
    name: 'Connor Barley'
  },
  {
    id: 'UL3U3EUPQ',
    text: '0:55',
    time: 55,
    name: 'Connor Barley'
  },
  {
    id: 'UL3U3EUPQ',
    text: 'dfdsffasdgasdg',
    time: "",
    name: 'Connor Barley'
  }
]

// const extractTimeFromText = data => {
//   const newData = data.map(item => ({
//     id: item.id,
//     time: item.text.match(/\d/g) ? parseInt(item.text.match(/\d/g).join("")) : "",
//     name: item.name
//   }))
//   console.log(newData)
//   return newData;
// }

// extractTimeFromText(data)

const convertTextToNum = input =>
  input.match(/\d/g) ? parseInt(input.match(/\d/g).join("")) : "";

const sortObjects = data => {
  return data.map(item => ({
    id: item.id,
    text: item.text,
    time: convertTextToNum(item.text)
  })).filter(item => item.time !== "")
}

console.log(sortObjects(data))