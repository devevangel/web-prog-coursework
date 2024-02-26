import dbConn from "../database-config.js";

export async function listCategories(req, res) {
  try {
    const db = await dbConn;
    const categories = await db.all("SELECT * FROM Category;");
    res.status(200).json({
      status: "success",
      length: categories.length,
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: "Unable to fetch category data.",
    });
  }
}
