db.createUser({
  user: "uecomitram",
  pwd: "pecomitram",
  roles: [
    {
      role: "readWrite",
      db: "ecomitram",
    },
  ],
});

db = new Mongo().getDB("ecomitram");

// use('ecomitram');
// db = db.getSiblingDB('ecomitram');
// db.createCollection('users');
// db.users.insert({
//   is_enable: true,
//   email: 'shyam@readybytes.in',
//   name: 'Shyam Verma',
//   is_platform_admin: true,
// });
