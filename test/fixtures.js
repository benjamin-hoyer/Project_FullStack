export const serviceUrl = "http://localhost:4000";

/* *********************** Test Users *********************** */

export const darth = {
  firstName: "Darth",
  lastName: "Vader",
  email: "darth@vader.com",
  password: "password",
};

// for Api
export const darthCredentials = {
  email: "darth@vader.com",
  password: "password",
};

export const testUsers = [
  {
    firstName: "Darth",
    lastName: "Vader",
    email: "darthi@vader.com",
    password: "password",
  },
  {
    firstName: "Luke",
    lastName: "Skywalker",
    email: "Luke@skywalker.com",
    password: "password",
  },
  {
    firstName: "Obi-Wan",
    lastName: "Kenobi",
    email: "Obi@kenobi.com",
    password: "password",
  },
];

/* *********************** Test Categories *********************** */

export const level3 = {
  name: "Level3",
};

export const testCategories = [
  {
    name: "Level34",
  },
  {
    name: "LakeWalks",
  },
  {
    name: "Easy",
  },
];

/* *********************** Test Hikes *********************** */

export const bigHike = {
  name: "bigHike200",
  description: "This is a big hike",
  distance: 200,
  duration: 200,
  lat: 200,
  long: 200,
  latend: 200,
  longend: 200,
  visibility: "public",
  start: "start",
  end: "end",
};

export const testHikes = [
  {
    name: "bigHike",
    description: "This is a big hike",
    distance: 200,
    duration: 200,
    lat: 200,
    long: 200,
    latend: 200,
    longend: 200,
    start: "start",
    end: "end",
    visibility: "public",

  },
  {
    name: "Grouse Grind",
    description: "This is a little hike",
    distance: 2.9,
    duration: 90,
    lat: 49.3721,
    long: -123.0997,
    latend: 200,
    longend: 200,
    start: "start",
    end: "end",
    visibility: "public",

  },
  {
    name: "Dog Mountain",
    distance: 5.2,
    duration: 120,
    lat: 49.3721,
    long: -123.0997,
    latend: 200,
    longend: 200,
    start: "start",
    end: "end",
    visibility: "public",
  },
];
