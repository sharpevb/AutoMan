var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Car.findAll({
      include: [db.Customer]
    }).then(function(dbCars) {
      res.render("index", {
        msg: "Welcome!",
        cars: dbCars
      });
    });
  });

  // Load example page and pass in an example by id
  app.get("/cars/:id", function(req, res) {
    db.Car.findOne({ where: { id: req.params.id } }).then(function(dbCars) {
      res.render("index", {
        example: dbCars
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
