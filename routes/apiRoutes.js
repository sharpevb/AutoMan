var db = require("../models");

module.exports = function (app) {
  // Get all car
  app.get("/api/cars", function (req, res) {
    db.Car.findAll({}).then(function (dbCars) {
      res.json(dbCars);
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

  // Delete an car by id
  app.delete("/api/cars/:id", function (req, res) {
    db.Car.destroy({ where: { id: req.params.id } }).then(function (dbCars) {
      res.json(dbCars);
    });
  });
};
