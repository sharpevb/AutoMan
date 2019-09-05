var db = require("../models");

module.exports = function (app) {

  // Load index page
  app.get("/", function (req, res) {
    db.Car.findAll(
      {
        include: [db.Customer],
        order: ["make", "model"],
        where: {
          sold: false
        }
      }).then(function (dbCars) {
        res.render("index", {
          cars: dbCars
        });
      });
  });

  app.get("/sold", function (req, res) {
    db.Car.findAll(
      {
        include: [db.Customer],
        order: [["datesold", "DESC"]],
        where: {
          sold: true
        }
      }).then(function (dbCars) {
        res.render("sold", {
          cars: dbCars
        });
      });
  });

  // Create a new car
  app.post("/api/cars", function (req, res) {
    db.Car.create(req.body).then(function (dbCars) {
      res.json(dbCars);
    });
  });

  // Update a car
  app.put("/api/cars", function (req, res) {
    db.Car.update(req.body, {
      where: {
        id: req.body.id
      }
    }).then(function (dbCars) {
      res.json(dbCars);
    });
  });

  // Delete a car by id
  app.delete("/api/cars/:id", function (req, res) {
    db.Car.destroy({ where: { id: req.params.id } }).then(function (dbCars) {
      res.json(dbCars);
    });
  });
};
