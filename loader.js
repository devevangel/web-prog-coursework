import fs from "fs";
import uuid from "uuid-random";
import dbConn from "./database-config.js";

const areas = [
  "Heart",
  "Cardiovascular System",
  "Muscles",
  "Strength",
  "Fat",
  "Calories",
  "Core Muscles",
  "Abdominals",
  "Obliques",
  "Lower Back",
  "Flexibility",
  "Range of Motion",
  "Joint Mobility",
  "Agility",
  "Balance",
  "Coordination",
  "Proprioception",
  "Muscular Endurance",
  "Cardiovascular Endurance",
  "Quadriceps",
  "Hamstrings",
  "Glutes",
  "Calves",
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
];

async function loadData(fileName) {
  try {
    const data = fs.readFileSync(`data/${fileName}.json`, "utf8");
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (err) {
    console.error("Error reading file:", err);
  }
}
