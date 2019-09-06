//$(document).ready(function () {

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

function refreshCars() {
  //location.reload();
  console.log("inventoryselect " + inventorySelect)
  if (inventorySelect === 'I') {
    //load up inventory only
    document.location = '/';
  }
  else {
    //this is just the sold vehicles
    document.location = '/sold';
  }
}

// Remove the car from the db and refresh the list
function handleDeleteBtnClick(carID) {
  // console.log("id " + carID);
  API.deleteCar(carID).then(function () {
    refreshCars();
  });
};

// This section will populate the list of customers
function getCustomers() {
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
  customerSelect.append(rowsToAdd);
}

// Creates the author options in the dropdown
function createCustomerRow(customer) {
  var listOption = $("<option>");
  listOption.attr("value", customer.id);
  listOption.text(`${customer.name}, ${customer.address}, ${customer.phone}`);
  return listOption;
}

function initialize() {
  // $("[name=myRadio]").val(["I"]);
  if (inventorySelect === "I") {
    $('#soldInventory').prop('checked', false);
    $('#currentInventory').prop('checked', true);
  }
  else {
    $('#soldInventory').prop('checked', true);
    $('#currentInventory').prop('checked', false);
  }
};

  // Formatting mileage with commas
  function numberWithCommas(number) {
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
$(document).ready(function() {
  $(".comma").each(function() {
    var num = $(this).text();
    var commaNum = numberWithCommas(num);
    $(this).text(commaNum);
  });
});


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

    console.log("car " + JSON.stringify(car))

    if (!(car.price && car.datesold)) {
      return;
    }
    $("#car-price").val("");
    $("#car-date").val("");
    //will always be an update when sold.
    API.updateCar(car).then(function () {
    });
    $("#soldModal").hide();
    refreshCars();
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
      //   console.log("updating")
      API.updateCar(car).then(function () {
      });
    }
    $("#carModal").hide();
    refreshCars();
  });

  // Add event listeners to the submit, edit, and delete buttons

  //delete the selected row.
  $("#car-table").on('click', '.deleteButton', function (event) {
    event.preventDefault();

    //get the database key for the row
    var carID = $(this).attr("data-id");
    var response = confirm("Are you sure you want to delete this vehicle? " + carID);
    if (response === true) {
      handleDeleteBtnClick(carID);
    }
  });

  //display modal for selling vehicle.
  $(".soldButton").on("click", function (event) {
    event.preventDefault();
    var carID = $(this).attr("data-id");
    $("#submitSold").attr("carID", carID);
    //set to their current values in case updating
    $("#car-price").val($(`#price${carID}`).text());
    $("#car-date").val($(`#datesold${carID}`).text());

    //populate the customer list
    getCustomers();
    customerSelect.val($(`#customer${carID}`).text());

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

  //this will get the value of the inventory selection radio and display
  $("input[name='radio1']").on("click", function (event) {
    // alert("calling get cars "+$(this).val())
    //app.get(`/cars/`+$(this).val())
    //API.getCars($(this).val());
    event.preventDefault();
    inventorySelect = $(this).val();
    refreshCars();
  });

  // Displays modal for adding customer
  $("#addCustomer").on("click", function () {
    $("#submit-customer").attr("customerId", "");
    //set values
    $("#customer-name").val("");
    $("#input-email").val("");
    $("#input-phone").val("");
    $("#input-price").val("");
    $("#customerModal").show();
  });

  // Closes modal on Cancel button click
  $("#modalCloseCustomer").on("click", function () {
    $("#customerModal").hide();
  });

  // 
  $("#customerModal").on("submit", function (event) {
    event.preventDefault();
    //key is stored in the customerId field
    var customerId = $("#submit-customer").attr("customerId");
    //create the object for database insert/update
    var customer = {
      CustomerId: customerId,
      name: $customerName.val().trim(),
      address: $customerAddress.val().trim(),
      email: $customerEmail.val().trim(),
      phone: $customerPhone.val().trim()
    };
    console.log("customer " + JSON.stringify(customer))

    //don't allow it to save if null
    if (!(customer.name && customer.address && customer.email && customer.phone)) {
      return;
    }
    //reset
    $("#customer-name").val("");
    $("#input-email").val("");
    $("#input-phone").val("");
    $("#input-price").val("");
    //if ID is null, then it's an add, otherwise update
    if (customerId === "") {
      API.newCustomer(customer).then(function () {
      });
    } else {
      API.updateCustomer(customer).then(function () {
      });
    }
    $("#customerModal").hide();
  });

});