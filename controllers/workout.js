import fs from "fs";

export async function listWorkouts(req, res) {
  try {
    const data = fs.readFileSync(
      "../web-prog-coursework/data/workouts.json",
      "utf8"
    );
    const workouts = JSON.parse(data);
    const publicWorkouts = workouts.filter(
      (workout) => workout.is_public === true
    );
    res.status(200).json({
      status: "success",
      feeds: publicWorkouts,
    });
  } catch (err) {
    console.error("Error reading file:", err);
    res.status(400).json({
      status: "error",
      message: "Unable to retrieve profiles",
    });
  }
}

export async function listMyWorkouts(req, res) {
  try {
    const { id } = req.params;

    const data = fs.readFileSync(
      "../web-prog-coursework/data/workouts.json",
      "utf8"
    );
    const jsonData = JSON.parse(data);
    const userWorkouts = jsonData.filter((workout) => workout.owner.id === id);
    res.status(200).json({
      status: "success",
      feeds: userWorkouts,
    });
  } catch (err) {
    console.error("Error reading file:", err);
    res.status(400).json({
      status: "error",
      message: "Unable to retrieve profiles",
    });
  }
}
