import fs from "fs";

export async function listAccounts(req, res) {
  try {
    const data = fs.readFileSync(
      "../web-prog-coursework/data/accounts.json",
      "utf8"
    );
    const jsonData = JSON.parse(data);
    res.status(200).json({
      status: "success",
      accounts: jsonData,
    });
  } catch (err) {
    console.error("Error reading file:", err);
    res.status(400).json({
      status: "error",
      message: "Unable to retrieve profiles",
    });
  }
}
