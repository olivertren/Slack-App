require("dotenv").config();
const axios = require("axios");
const express = require("express");
const app = express();

const PORT = process.env.PORT;
const ROOT_URL = "https://slack.com/api/";
const messagesEndpoint = "groups.history";
const usersEndpoint = "users.info";
const headers = {
  "Content-Type": "application/x-www-form-urlencoded"
};

////////////
// ROUTES //
////////////

// app.get("/", (req, res) => {
//   res.send("hello!")
// })

// app.post("/", (req, res) => {
//   res.send("hi")
// })

///////////////////
// API FUNCTIONS //
///////////////////

// GET MESSAGES
const getMessages = url => {
  return axios
    .get(
      `${url}${messagesEndpoint}`, {
        params: {
          token: process.env.USER_TOKEN,
          channel: "GLJC58SFM",
          pretty: "1",
          oldest: getMonday()
        }
      },
      headers
    )
    .then(res => {
      const {
        messages
      } = res.data;
      return messages.filter(
        item =>
        item.type === "message" &&
        !item.subtype &&
        (convertSecondsToDay(item.ts) !== 0 &&
          convertSecondsToDay(item.ts) !== 6)
      );
    })
    .catch(err => {
      throw new Error(err);
    });
};

// GET USER BY ID
const getUserById = id => {
  return axios
    .get(
      `${ROOT_URL}${usersEndpoint}?token=${process.env.USER_TOKEN}&user=${id}`,
      headers
    )
    .then(res => {
      const {
        real_name,
        name
      } = res.data.user;
      return {
        realName: real_name,
        username: name
      };
    });
};

//////////////////////
// HELPER FUNCTIONS //
//////////////////////

const mapAndSort = data => {
  return data
    .map(item => ({
      id: item.user,
      text: item.text,
      time: convertTextToNum(item.text),
      dayOfYear: ""
    }))
    .filter(item => item.time !== "")
    .sort((a, b) => (a.time > b.time ? 1 : -1));
};

const convertTextToNum = input =>
  input.match(/\d/g) ? parseInt(input.match(/\d/g).join("")) : "";

////////////////////
// DATE FUNCTIONS //
////////////////////

const convertMillisToSecs = millis => millis / 1000;

const convertSecondsToDay = seconds => {
  let date = new Date(seconds * 1000);
  let localTime = date.toLocaleString();
  localTime = new Date(localTime);
  return localTime.getDay();
};

const getMonday = () => {
  let d = new Date();
  let day = d.getDay();
  d.setHours(0, 0, 0, 0);
  let prevMonday;
  if (day == 0) {
    prevMonday = d.setDate(d.getDate() - 6);
  } else {
    prevMonday = d.setDate(d.getDate());
  }
  return convertMillisToSecs(prevMonday);
};



///////////////////
// CALL FUNCTION //
///////////////////

getMessages(ROOT_URL).then(data => {
  console.log(data)
  const sortedArray = mapAndSort(data);
  const topFive = sortedArray.slice(0, 5).reverse();
  const newTopFive = topFive
    .map((item, index) => ({
      ...item,
      points: index + 1
    }))
    .reverse();
  console.log(newTopFive);
});

// app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));