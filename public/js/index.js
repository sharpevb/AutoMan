//$(document).ready(function () {

// Get references to page elements
var $carYear = $("#car-year");
var $carMake = $("#car-make");
var $carModel = $("#car-model");
var $carColor = $("#car-color");
var $carMileage = $("#car-mileage");
var $carPrice = $("#car-price");
var $carDate = $("#car-date");
//var $submitBtn = $("#submit-car");
//var $carList = $("#car-list");
var customerSelect = $("#car-customer");

var $customerName = $("#customer-name");
var $customerEmail = $("#input-email");
var $customerPhone = $("#input-phone");
var $customerAddress = $("#input-address");

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
  getCars: function () {
    return $.ajax({
      url: "api/cars",
      type: "GET"
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
  },
  newCustomer: function (customer) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/customers",
      data: JSON.stringify(customer)
    });
  }
};
getCustomers();

//if the car is sold, prompt for who is was sold to, price and date.
$('#soldModal').on('submit', function (event) {
  //event.preventDefault();
  //attribute indicates whether an add or update.
  var carID = $("#submitSold").attr("carID");
  var price = $carPrice.val();
  var dateSold = $carDate.val();
  var customerId = customerSelect.val();
  var car = {
    id: carID,
    price: price,
    datesold: dateSold,
    CustomerId: customerId
  };
  console.log("car " + JSON.stringify(car))
  alert("updating sold")
  /*    if (!(car.price && car.datesold)) {
        return;
      }*/
  //reset
  $("#car-price").val("");
  $("#car-date").val("");
  //will always be an update when sold.
  API.updateCar(car).then(function () {
  });
  //refreshCars();

  //$("#soldModal").hide();
  //$submitBtn.val("");
  //$carList.val("");
});

//record the sale
$('#carModal').on('submit', function (event) {
  //event.preventDefault();
  //attribute indicates whether an add or update.
  var carID = $("#submit-car").attr("carID");
  var output = "";
  if (carID === null) { output = "null" }
  else if (carID === undefined) { output = "undefined" }
  else if (carID === "") { output = "empty" };
  console.log("save output " + output)
  console.log("save carID " + carID)
  var car = {
    id: carID,
    year: $carYear.val().trim(),
    make: $carMake.val().trim(),
    model: $carModel.val().trim(),
    color: $carColor.val().trim(),
    mileage: $carMileage.val().trim()
  };
  console.log("car " + JSON.stringify(car))
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
    });
  } else {
    console.log("updating")
    API.updateCar(car).then(function () {
    });
  }
  //refreshCars();
  // $("#carModal").hide();

});

function refreshCars() {
  location.reload();
}

// handleDeleteBtnClick is called when an car's delete button is clicked
// Remove the car from the db and refresh the list
//var handleDeleteBtnClick = function() {
function handleDeleteBtnClick(carID) {
  console.log("id " + carID);
  API.deleteCar(carID).then(function () {
    refreshCars();
  });
};

// Add event listeners to the submit, edit, and delete buttons
//$submitBtn.on("click", handleFormSubmit);

//delete the selected row.
$("#car-table").on('click', '.deleteButton', function () {
  event.preventDefault();

  //get the database key for the row
  var carID = $(this).attr("data-id");
  var response = confirm("Are you sure you want to delete this vehicle? " + carID);
  if (response === true) {
    handleDeleteBtnClick(carID);
  }
});

//$deleteButton.on("click", ".delete", handleDeleteBtnClick);

//display modal for selling vehicle.
//$("#soldButton").on("click", function () {
$(".soldButton").on("click", function () {
  //$(".editButton").on("click", function () {
  //set the carID attribute to the ID
  var carID = $(this).attr("data-id");
  console.log("sold trigger year " + $(`#year${carID}`).text());
  console.log("sold trigger ID " + carID);
  $("#submitSold").attr("carID", carID);
  //set to their current values in case updating
  $("#car-price").val($(`#price${carID}`).text());
  $("#car-date").val($(`#date${carID}`).text());
  $("#car-customer").val($(`#car-customer${carID}`).text());
  $("#soldModal").show();
});

$("#modalCloseCust").on("click", function () {
  $("#soldModal").hide();
});

//display modal for adding car
$("#addCar").on("click", function () {
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
$(".editButton").on("click", function () {
  //set the carID attribute to the ID
  var carID = $(this).attr("data-id");
  console.log("edit trigger year " + $(`#year${carID}`).text());
  console.log("edit trigger ID " + carID);
  $("#submit-car").attr("carID", carID);
  //set to their current values
  $("#car-year").val($(`#year${carID}`).text());
  $("#car-make").val($(`#make${carID}`).text());
  $("#car-model").val($(`#model${carID}`).text());
  $("#car-color").val($(`#color${carID}`).text());
  $("#car-mileage").val($(`#mileage${carID}`).text());

  $("#carModal").show();
});

$("#modalCloseCar").on("click", function () {
  $("#carModal").hide();
});

// This is the same search function listed already //
$("#searchInput").on("keyup", function () {
  var value = $(this).val().toLowerCase();
  $("#car-table tr").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});

// Displays modal for adding customer
$("#addCustomer").on("click", function () {
  $("#submit-customer").attr("customerId", ""); // <-- carID
  //reset
  $("#customer-name").val("");
  $("#input-email").val("");
  $("#input-phone").val("");
  $("#input-price").val("");
  $("#customer-date").val("");
  $("#customerModal").show();
});
// Closes modal on Cancel button click
$("#modalCloseCustomer").on("click", function () {
  $("#customerModal").hide();
});

// 
$("#customerModal").on("submit", function (event) {
  var customerId = $("#submit-customer").attr("customerId");
  var output = "";
  if (customerId === null) { output = "null" }
  else if (customerId === undefined) { output = "undefined" }
  else if (customerId === "") { output = "empty" };
  console.log("save output " + output)
  console.log("save carID " + customerID)
  var customer = {
    CustomerId: customerId,
    name: $customerName.val().trim(),
    address: $customerAddress.val().trim(),
    email: $customerEmail.val().trim(),
    phone: $customerPhone.val().trim()
  };
  console.log("customer " + JSON.stringify(customer))
  if (!(car.year && car.make && car.model && car.color && car.mileage)) {
    return;
  }
  if (customerID === "") {
    API.newCustomer(customer).then(function () {
    });
  } else {
    console.log("did not work")
  }
});

// Search bar to scroll through vehicle data
$("#searchInput").on("keyup", function () {
  var value = $(this).val().toLowerCase();
  $("#car-table tr").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});



// This section will populate the list of customers
function getCustomers() {
  console.log("getcustomers")
  $.get("/api/customers", renderCustomerList);
}
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
  console.log(rowsToAdd);
  console.log(customerSelect);
  customerSelect.append(rowsToAdd);
  //customerSelect.val(customerId);
}

// Creates the author options in the dropdown
function createCustomerRow(customer) {
  var listOption = $("<option>");
  listOption.attr("value", customer.id);
  listOption.text(`${customer.name}, ${customer.address}, ${customer.phone}`);
  return listOption;
}
//});