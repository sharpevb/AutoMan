var $customerName = $("#customer-name");
var $customerEmail = $("#input-email");
var $customerPhone = $("#input-phone");
var $customerAddress = $("#input-address");

// The API object contains methods for each kind of request we'll make
var API = {
  deleteCustomer: function (id) {
    return $.ajax({
      url: "api/customers/" + id,
      type: "DELETE"
    });
  },
  updateCustomer: function (customer) {
    return $.ajax({
      url: "api/customers",
      type: "PUT",
      data: customer
    });
  },
  addCustomer: function (customer) {
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

// Remove the car from the db and refresh the list
function deleteCustomer(customerID) {
  // console.log("id " + carID);
  API.deleteCustomer(customerID).then(function () {
    refreshCars();
  });
};

$(document).ready(function () {
  initialize();

  // Add event listeners to the submit, edit, and delete buttons

  //delete the selected row.
  $("body").off().on('click', '.deleteCustomer', function (event) {
    event.preventDefault();

    //get the database key for the row
    var customerID = $(this).attr("data-id");
    $("#submit-delete").attr("customerID", customerID);
    // Confirm modal to pop up
    $("#confirmModal").show();

  });


  //if they confirm they want to delete the car
  $('#confirmModal').off().on('submit', function (event) {
    event.preventDefault();
    //get the id to delete
    var customerID = $("#submit-delete").attr("customerID");
    deleteCustomer(customerID);
  });


  //Closes modal on Cancel button click
  $("#modalCloseConfirm").on("click", function () {
    $("#confirmModal").hide();
  });


  //display modal for editing car
  $(".editCustomer").off().on("click", function () {
    //set the carID attribute to the ID
    var customerID = $(this).attr("data-id");
    $("#submit-customer").attr("customerID", customerID);
    //set to their current values
    $("#customer-name").val($(`#customer${customerID}`).text());
    $("#input-address").val($(`#address${customerID}`).text());
    $("#input-email").val($(`#email${customerID}`).text());
    $("#input-phone").val($(`#phone${customerID}`).text());

    $("#customerModal").show();
  });

  // This is the search functionality
  $("#searchInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#customer-table tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });


  // Displays modal for adding customer
  $("#addCustomer").on("click", function () {
    $("#submit-customer").attr("customerId", "");
    //initialize values
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
      id: customerId,
      name: $customerName.val().trim(),
      address: $customerAddress.val().trim(),
      email: $customerEmail.val().trim(),
      phone: $customerPhone.val().trim()
    };

    //don't allow it to save if null
    if (!(customer.name && customer.address && customer.email && customer.phone)) {
      return;
    }
    //reset values
    $("#customer-name").val("");
    $("#input-email").val("");
    $("#input-phone").val("");
    $("#input-price").val("");
    //if ID is null, then it's an add, otherwise update
    if (customerId === "") {
      API.addCustomer(customer).then(function () {
        refreshCars();
      });
    } else {
      API.updateCustomer(customer).then(function () {
        refreshCars();
      });
    };
  });

});