var db = require("../models");

module.exports = function (app) {
  // Get all customers
  app.get("/api/customers", function (req, res) {
    db.Customer.findAll({}).then(function (dbCustomers) {
      res.json(dbCustomers);
    });
  });

  // Create a new customer
  app.post("/api/customers", function (req, res) {
    db.Customer.create(req.body).then(function (dbCustomers) {
      res.json(dbCustomers);
    });
  });

  // Update a customer
  app.put("/api/customers", function (req, res) {
    db.Customer.update(req.body, {
      where: {
        id: req.body.id
      }
    }).then(function (dbCustomers) {
      res.json(dbCustomers);
    });
  });

  // Delete a customer by id
  app.delete("/api/customers/:id", function (req, res) {
    db.Customer.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbCustomers) {
      res.json(dbCustomers);
    });
  });
};
