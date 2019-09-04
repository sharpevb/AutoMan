module.exports = function(sequelize, DataTypes) {
  var Car = sequelize.define("Car", {
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      len: [4]
    },
    make: {
      type: DataTypes.STRING,
      allowNull: false
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mileage: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false
    },
    carimage: DataTypes.STRING,
    datesold: DataTypes.DATEONLY,
    price: DataTypes.INTEGER
  });

  Car.associate = function(models) {
    // We're saying that a Car should belong to an Customer, but only if sold so not required.
    Car.belongsTo(models.Customer, {
      foreignKey: {
        allowNull: true
      }
    });
  };
  return Car;
};
