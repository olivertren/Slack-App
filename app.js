require("dotenv").config();
const axios = require("axios");
const express = require("express");
const app = express();

const PORT = process.env.PORT
const ROOT_URL = "https://slack.com/api/";
const messagesEndpoint = "groups.history";
const usersEndpoint = "users.info";
const headers = {
  "Content-Type": "application/x-www-form-urlencoded"
};

// ROUTES
app.get("/", (req, res) => {
  res.send("hello!")
})

app.post("/", (req, res) => {
  getMessages(ROOT_URL)
    .then(response => {
      res.send(response)
    })
    .catch(err => console.log(err));
})


// API FUNCTIONS

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
      const filtered = messages.filter(
        item =>
        item.type === "message" && item.subtype !== "bot_add" &&
        (convertSecondsToDay(item.ts) !== 0 &&
          convertSecondsToDay(item.ts) !== 6)
      );
      return filtered;
    }).then(res => {
      return mapUserData(res);
    }).catch(err => {
      throw new Error(err)
    });
};


// GET USER BY ID
const getUserById = id => {
  axios
    .get(
      `${ROOT_URL}${usersEndpoint}`, {
        params: {
          token: process.env.USER_TOKEN,
          user: id
        }
      },
      headers
    ).then(res => {
      const realName = res.data.user.real_name;
      return realName;
    })
}

// OTHER HELPER FUNCTIONS
const mapUserData = data => {
  return data.map(item => ({
    id: item.user,
    text: item.text
  }))
};

// DATE FUNCTIONS
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

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));