require("dotenv").config();
const axios = require("axios");
const express = require("express");
const fakeData = require("./fakedata");
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

app.get("/", (req, res) => {
  res.send("hello")
})

app.post("/", (req, res) => {
  getMessages(ROOT_URL).then(data => {
      const sortedArray = mapAndSort(data);
      const grouped = groupBy(sortedArray, "day_of_year").filter(item => item !== undefined)
      const pointsArray = assignPoints(grouped);
      const nowFlatten = [].concat(...pointsArray);
      const combinedScores = nowFlatten.reduce((acc, elem) => {
        if (acc.filter(el => el.id === elem.id)[0]) {
          acc.filter((el) => el.id == elem.id)[0].points += elem.points;
        } else acc.push(elem);
        return acc
      }, [])
      return combinedScores
    })
    .then(response => {
      let newRes = response.map(person => `*ID*: ${person.id} || *SCORE*: ${person.points}`)
      res.send(newRes)
    })
    .catch(err => {
      throw new Error(err)
    });

})

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
    prevMonday = d.setDate(d.getDate() - day);
  }
  return convertMillisToSecs(prevMonday);
};

const getDayofYear = inp => {
  let ts = new Date(inp * 1000);
  let start = new Date(ts.getFullYear(), 0, 0);
  let diff = ts - start;
  let oneDay = 1000 * 60 * 60 * 24;
  let day = Math.floor(diff / oneDay);
  return day;
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
      day_of_year: getDayofYear(item.ts),
    }))
    .filter(item => item.time !== "")
    .sort((a, b) => (a.day_of_year > b.day_of_year ? 1 : -1));
};

const convertTextToNum = input =>
  input.match(/\d/g) ? parseInt(input.match(/\d/g).join("")) : "";

const groupBy = (arr, property) => {
  return arr.reduce((memo, x) => {
    if (!memo[x[property]]) {
      memo[x[property]] = [];
    }
    memo[x[property]].push(x);
    return memo;
  }, []);
}

const assignPoints = data => {
  return data.map(item => {
    let newItem = item.sort((a, b) => (a.time > b.time ? 1 : -1));
    let num = 5 || newItem.length;
    const topFive = newItem.slice(0, num)
    const newTopFive = topFive
      .map((i, index) => ({
        ...i,
        points: 5 - index
      }))
      .reverse();
    return newTopFive
  })
}

///////////////////
// CALL FUNCTION //
///////////////////


app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));