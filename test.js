require("dotenv").config();
const axios = require("axios");

const PORT = process.env.PORT;
const ROOT_URL = "https://slack.com/api/";
const usersEndpoint = "users.info";
const headers = {
  "Content-Type": "application/x-www-form-urlencoded"
};

const data = [{
    client_msg_id: 'd3f143be-2cfa-4296-bbd1-004932a51c46',
    type: 'message',
    text: ':20',
    user: 'UL3U3EUPQ',
    ts: '1565279523.000400',
    team: 'T029KGL8E'
  },
  {
    client_msg_id: 'afb8e3e9-dba7-4843-8d5f-2b3d72cd1a27',
    type: 'message',
    text: '1:12',
    user: 'UL3U3EUPQ',
    ts: '1565279419.000200',
    team: 'T029KGL8E'
  },
  {
    client_msg_id: '46c30c45-3556-4128-8e16-4a7048c7daa6',
    type: 'message',
    text: '1:10',
    user: 'UL3U3EUPQ',
    ts: '1565230520.000700',
    team: 'T029KGL8E'
  },
  {
    client_msg_id: 'be8686ad-6a4b-4e36-aa01-ed8aa8b90040',
    type: 'message',
    text: '1:20fasd\\',
    user: 'UL3U3EUPQ',
    ts: '1565230516.000400',
    team: 'T029KGL8E'
  },
  {
    client_msg_id: '4d1480d2-7771-4283-a6b2-4c71e9d43f10',
    type: 'message',
    text: '1:41',
    user: 'UL3U3EUPQ',
    ts: '1565230509.000200',
    team: 'T029KGL8E'
  },
  {
    client_msg_id: '3439d05c-da39-4d72-bb54-d8f39303b3ec',
    type: 'message',
    text: ':56',
    user: 'UL3U3EUPQ',
    ts: '1565151127.000900',
    team: 'T029KGL8E'
  },
  {
    client_msg_id: '852b225f-ea07-48d0-8e4b-1f8be5928838',
    type: 'message',
    text: '1:12',
    user: 'UL3U3EUPQ',
    ts: '1565151123.000700',
    team: 'T029KGL8E',
    edited: {
      user: 'UL3U3EUPQ',
      ts: '1565185222.000000'
    }
  },
  {
    client_msg_id: '86747180-aa46-4257-b46c-f1514087fb22',
    type: 'message',
    text: '2:43',
    user: 'UL3U3EUPQ',
    ts: '1565151116.000400',
    team: 'T029KGL8E',
    edited: {
      user: 'UL3U3EUPQ',
      ts: '1565185229.000000'
    }
  },
  {
    client_msg_id: '171e81ed-c70e-4c79-821e-82144b42e6c9',
    type: 'message',
    text: '1:45',
    user: 'UL3U3EUPQ',
    ts: '1565151114.000200',
    team: 'T029KGL8E'
  },
  {
    client_msg_id: 'e6696ab5-06d2-4702-afce-b40b4f456808',
    type: 'message',
    text: '1:23',
    user: 'UL3U3EUPQ',
    ts: '1565123564.000200',
    team: 'T029KGL8E'
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
      id: item.user,
      text: item.text,
      time: convertTextToNum(item.text),
      day_of_year: getDayofYear(item.ts)
    }))
    .filter(item => item.time !== "")
    .sort((a, b) => (a.day_of_year > b.day_of_year) ? 1 : -1);
}

const getDayofYear = inp => {
  let ts = new Date(inp * 1000);
  let start = new Date(ts.getFullYear(), 0, 0);
  let diff = ts - start;
  let oneDay = 1000 * 60 * 60 * 24;
  let day = Math.floor(diff / oneDay);
  return day;
};

const groupBy = (arr, property) => {
  return arr.reduce((memo, x) => {
    if (!memo[x[property]]) {
      memo[x[property]] = [];
    }
    memo[x[property]].push(x);
    return memo;
  }, []);
}

const myData = sortObjects(data)
const newData = groupBy(myData, "day_of_year")

// console.log(newData)
const assignPoints = data => {
  return data.map(item => {
    let newItem = item.sort((a, b) => (a.time > b.time ? 1 : -1));
    let num = 5 || newItem.length;
    const topFive = newItem.slice(0, num).reverse();
    const newTopFive = topFive
      .map((i, index) => ({
        ...i,
        points: 5 - index
      }))
      .reverse();
    return newTopFive
  })
}

console.log(assignPoints(newData))