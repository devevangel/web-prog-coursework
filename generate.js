import uuid from "uuid-random";

for (let i = 0; i <= 19; i++) {
  console.log(i, uuid());
}

process.exit();
