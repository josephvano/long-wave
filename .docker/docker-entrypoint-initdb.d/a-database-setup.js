db.createUser(
  {
  user: "longwave",
  pwd: "longwave",
  roles: [ { role: "readWrite", db: "longwave" } ]
  }
)

db.createCollection("users");
