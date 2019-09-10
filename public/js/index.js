
// Get references to page elements
var $carYear = $("#car-year");
var $carMake = $("#car-make");
var $carModel = $("#car-model");
var $carColor = $("#car-color");
var $carMileage = $("#car-mileage");
var $carPrice = $("#car-price");
var $carDate = $("#car-date");
//this contains the list of customers for selection.
var customerSelect = $("#car-customer");
//this is whether to display those in inventory, or those sold, or all
var inventorySelect = $("input[name='radio1']:checked").val();

//this will be used for setting to the sold customer.
var selectedCustomer = 0;

// The API object contains methods for each kind of request we'll make
var API = {
  saveCar: function (car) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/cars",
      data: JSON.stringify(car)
    });
  },

  deleteCar: function (id) {
    return $.ajax({
      url: "api/cars/" + id,
      type: "DELETE"
    });
  },
  updateCar: function (car) {
    return $.ajax({
      url: "api/cars",
      type: "PUT",
      data: car
    });
  }
};

function refreshCars() {
  //location.reload(); daw
  console.log("inventoryselect " + inventorySelect)
  if (inventorySelect === 'I') {
    //load up inventory only
    document.location = '/';
  }
  else if (inventorySelect === 'S') {
    //this is just the sold vehicles
    document.location = '/sold';
  }
  else {
    document.location = '/customers';
  }
};

// Remove the car from the db and refresh the list
function deleteCar(carID) {
  // console.log("id " + carID);
  API.deleteCar(carID).then(function () {
    refreshCars();
  });
};

// This section will populate the list of customers
function getCustomers() {
  $.get("/api/customers", renderCustomerList);
};
// Function to either render a list of authors, or if there are none, direct the user to the page
// to create an author first
function renderCustomerList(data) {
  console.log("customers " + JSON.stringify(data))
  if (!data.length) {
    window.location.href = "/customers";
  }
  $(".hidden").removeClass("hidden");
  var rowsToAdd = [];
  for (var i = 0; i < data.length; i++) {
    rowsToAdd.push(createCustomerRow(data[i]));
  }
  customerSelect.empty();
  customerSelect.append(rowsToAdd);
  customerSelect.val(selectedCustomer);
}

// Creates the author options in the dropdown
function createCustomerRow(customer) {
  var listOption = $("<option>");
  listOption.attr("value", customer.id);
  listOption.text(`${customer.name}, ${customer.address}, ${customer.phone}`);
  return listOption;
}

function initialize() {
//inventory select I is current inventory, S is sold stuff, C is Customer
  if (inventorySelect === "I") {
    $('#soldInventory').prop('checked', false);
    $('#currentInventory').prop('checked', true);
    $('#customer').prop('checked', false);
  }
  else if (inventorySelect === "S") {
    $('#soldInventory').prop('checked', true);
    $('#currentInventory').prop('checked', false);
    $('#customer').prop('checked', false);
  }
  else {
    $('#soldInventory').prop('checked', false);
    $('#currentInventory').prop('checked', false);
    $('#customer').prop('checked', true);
  }
};

// Formatting mileage with commas
function numberWithCommas(number) {
  var parts = number.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

$(document).ready(function () {
  initialize();

  //if the car is sold, prompt for who is was sold to, price and date.
  $('#soldModal').on('submit', function (event) {
    event.preventDefault();
    //attribute indicates whether an add or update.
    var carID = $("#submitSold").attr("carID");
    var price = $carPrice.val();
    var dateSold = $carDate.val();
    var customerId = customerSelect.val();
    var car = {
      id: carID,
      price: price,
      datesold: dateSold,
      CustomerId: customerId,
      sold: true
    };

    if (!(car.price && car.datesold)) {
      return;
    }
    $("#car-price").val("");
    $("#car-date").val("");
    //will always be an update when sold.
    API.updateCar(car).then(function () {
      refreshCars();
    });
  });

  //record the sale
  $('#carModal').on('submit', function (event) {
    event.preventDefault();
    //attribute indicates whether an add or update.
    var carID = $("#submit-car").attr("carID");

    var car = {
      id: carID,
      year: $carYear.val().trim(),
      make: $carMake.val().trim(),
      model: $carModel.val().trim(),
      color: $carColor.val().trim(),
      mileage: $carMileage.val().trim()
    };
    
    //don't submit if anything is missing.
    if (!(car.year && car.make && car.model && car.color && car.mileage)) {
      return;
    }

    //reset
    $("#car-year").val("");
    $("#car-make").val("");
    $("#car-model").val("");
    $("#car-color").val("");
    $("#car-mileage").val("");
    //if a new record, then add, otherwise update
    if (carID === "") {
      API.saveCar(car).then(function () {
        refreshCars();
      });
    } else {
      API.updateCar(car).then(function () {
        refreshCars();
      });
    }
  });

  //format the fields that need commas
  $(".comma").each(function () {
    var num = $(this).text();
    var commaNum = numberWithCommas(num);
    $(this).text(commaNum);
  });

  // Add event listeners to the submit, edit, and delete buttons

  //make sure they want to delete the selected car.
  $("body").off().on('click', '.deleteButton', function (event) {
    event.preventDefault();

    //get the database key for the row
    var carID = $(this).attr("data-id");
    $("#submit-delete").attr("carID", carID);
    // Confirm modal to pop up
    $("#confirmModal").show();
  });

  //if they confirm they want to delete the car
  $('#confirmModal').off().on('submit', function (event) {
    event.preventDefault();
    //get the id to delete
    var carID = $("#submit-delete").attr("carID");
    deleteCar(carID);
  });

  //Closes modal on Cancel button click
  $("#modalCloseConfirm").on("click", function () {
    $("#confirmModal").hide();
  });

  //display modal for selling vehicle.
  $(".soldButton").off().on("click", function (event) {
    event.preventDefault();
    var carID = $(this).attr("data-id");
    $("#submitSold").attr("carID", carID);
    //set to their current values in case updating
    //need to take out the commas and $ to put in numeric field
    var price = $(`#price${carID}`).text().replace(/,/g, "").substr(1, 10).trim();
    $("#car-price").val(price);
    $("#car-date").val($(`#datesold${carID}`).text());

    //populate the customer list
    selectedCustomer = $(`#customer${carID}`).text();
    getCustomers();

    $("#soldModal").show();
  });

  $("#modalCloseCust").on("click", function () {
    $("#soldModal").hide();
  });

  //display modal for adding car
  $("#addCar").off().on("click", function () {
    $("#submit-car").attr("carID", "");
    //reset
    $("#car-year").val("");
    $("#car-make").val("");
    $("#car-model").val("");
    $("#car-color").val("");
    $("#car-mileage").val("");
    $("#carModal").show();
  });

  //display modal for editing car
  $(".editButton").off().on("click", function () {
    //set the carID attribute to the ID
    var carID = $(this).attr("data-id");
    $("#submit-car").attr("carID", carID);
    //set to their current values
    $("#car-year").val($(`#year${carID}`).text());
    $("#car-make").val($(`#make${carID}`).text());
    $("#car-model").val($(`#model${carID}`).text());
    $("#car-color").val($(`#color${carID}`).text());
    //need to take out the comma for storing in the database.
    $("#car-mileage").val($(`#mileage${carID}`).text().replace(/,/g, ""));

    $("#carModal").show();
  });

  $("#modalCloseCar").on("click", function () {
    $("#carModal").hide();
  });

  // search for the car table.
  $("#searchInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#car-table tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  //this will get the value of the inventory selection radio and display
  $("input[name='radio1']").on("click", function (event) {
    event.preventDefault();
    inventorySelect = $(this).val();
    refreshCars();
  });
});