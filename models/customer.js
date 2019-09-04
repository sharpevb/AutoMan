module.exports = function(sequelize, DataTypes) {
  var Customer = sequelize.define("Customer", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  //on delete it should set car link to null
  Customer.associate = function(models) {
    // Associating Customer with Cars
    Customer.hasMany(models.Car);
  };
  return Customer;
};
