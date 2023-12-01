
////////////////////////////////////////////////////////////
// Global Setup
document.addEventListener('DOMContentLoaded', function() {
    loadHomePage();
    document.getElementById("home-btn").addEventListener("click", loadHomePage);
    document.getElementById("about-btn").addEventListener("click", loadAboutPage);
    document.getElementById("price-list-btn").addEventListener("click", loadPriceList);
    document.getElementById("gallery-btn").addEventListener("click", loadGallery);
    document.getElementById("book-now-btn").addEventListener("click", loadBookingPage);
    document.getElementById("admin-btn").addEventListener("click", loadAdminPage);
});


// Home Page Functions
function loadHomePage() {
  document.getElementById("main-content").innerHTML = `
        <div class="welcome">
            <h2>Welcome The Barber Shop</h2>
            <p>Discover our world-class services and meet our talented team.</p>
        </div>
        <div class="opening-hours">
            <h3>Opening Hours</h3>
            <p>Mon-Fri: 9 AM - 7 PM</p>
            <p>Sat: 10 AM - 5 PM</p>
            <p>Sun: Closed</p>
            <p>Phone: +1 234 567 890</p>
            <p>Address: 123 Fashion Street, Style City</p>
        </div>
    `;
}

// About Page Functions
// ad about info here 
function loadAboutPage() {
  let aboutHtml = `
        <div class="about-section">

        </div>
    `;
  loadContent(aboutHtml);
}


/* Gallery Page Functions
function loadGallery() {
  fetchData("/api/gallery-endpoint", (data) => {
    let galleryHtml = '<div class="gallery">';
    data.forEach((image) => {
      galleryHtml += `<img src="${image.url}" alt="${image.description}"/>`;
    });
    galleryHtml += "</div>";
    loadContent(galleryHtml);
  });
}

// Price List Page Functions
function loadPriceList() {
  fetchData("/api/prices-endpoint", (data) => {
    let priceListHtml = '<ul class="price-list">';
    data.forEach((item) => {
      priceListHtml += `<li>${item.service}: ${item.price}</li>`;
    });
    priceListHtml += "</ul>";
    loadContent(priceListHtml);
  });
}
*/

// Booking Page Functions
function loadBookingPage() {
    let bookingHtml = `
        <form id="booking-form">
            <select id="barber-select"></select>
            <select id="service-select"></select>
            <input type="date" id="booking-date" placeholder="Booking Date"/>
            <input type="time" id="booking-time" placeholder="Booking Time"/>
            <input type="text" id="customer-name" placeholder="Name"/>
            <input type="email" id="customer-email" placeholder="Email"/>
            <input type="tel" id="customer-phone" placeholder="Phone"/>
            <button type="submit">Book Now</button>
        </form>
    `;
    loadContent(bookingHtml);
    populateBarbers();
    populateServices();
    setupBarberSelectionListener();
    document.getElementById("booking-form").addEventListener("submit", handleBookingSubmit);
}

function setupBarberSelectionListener() {
    const barberSelect = document.getElementById("barber-select");
    barberSelect.addEventListener('change', function() {
        updateDateAvailability(this.value);
    });
}
function populateBarbers() {
    fetchData("/api/barbers", (barbers) => {
        const barberSelect = document.getElementById("barber-select");
        barbers.forEach((barber) => {
            barberSelect.innerHTML += `<option value="${barber.id}">${barber.name}</option>`;
        });
    });
}

function populateServices() {
    fetchData("/api/services", (services) => {
        const serviceSelect = document.getElementById("service-select");
        services.forEach((service) => {
            serviceSelect.innerHTML += `<option value="${service.service_id}">${service.service_name}</option>`;
        });
    });
}

function updateDateAvailability(barberId) {
  fetchData(`/api/barbers/${barberId}/availability`, (unavailableDates) => {
    const bookingDateInput = document.getElementById("booking-date");
    bookingDateInput.innerHTML = ""; // Clear previous options

    let date = new Date();
    for (let i = 0; i < 60; i++) {
      let dateString = date.toISOString().split("T")[0];
      let isUnavailable = unavailableDates.some((unavailableDate) => {
        return (
          new Date(unavailableDate.unavailable_date)
            .toISOString()
            .split("T")[0] === dateString
        );
      });

      if (!isUnavailable) {
        bookingDateInput.innerHTML += `<option value="${dateString}">${dateString}</option>`;
      }
      date.setDate(date.getDate() + 1); 
    }
  });
}


function handleBookingSubmit(event) {
  event.preventDefault();

  let bookingDate = document.getElementById("booking-date").value;

  // Convert date to YYYY-MM-DD format if necessary
  if (bookingDate.includes("/")) {
    const parts = bookingDate.split("/");
    bookingDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    console.log("Date being sent to backend:", bookingDate); // This should log in YYYY-MM-DD format
  }

  const bookingData = {
    customer_name: document.getElementById("customer-name").value,
    customer_email: document.getElementById("customer-email").value,
    customer_phone: document.getElementById("customer-phone").value,
    preferred_haircut:document.getElementById("service-select").options[
document.getElementById("service-select").selectedIndex
      ].text,
    booking_date: bookingDate,
    booking_time: document.getElementById("booking-time").value,
    barber_id: parseInt(document.getElementById("barber-select").value),
  };

  sendBookingData(bookingData);
}


function sendBookingData(bookingData) {
    fetch("http://localhost:3000/api/bookings/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(
              data.message || `HTTP error! status: ${response.status}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Booking successful", data);
        // Handle successful booking
      })
      .catch((error) => {
        console.error("Error during booking:", error);
        alert(error.message); // Display error message to the user
      });
}

// Admin Page Functions
function loadAdminPage() {
    let adminHtml = `
        <form id="admin-login-form">
            <input type="text" id="username" placeholder="Username"/>
            <input type="password" id="password" placeholder="Password"/>
            <button type="submit">Login</button>
        </form>
    `;
    document.getElementById("main-content").innerHTML = adminHtml;
    document.getElementById("admin-login-form").addEventListener("submit", handleAdminLogin);
}

////////////////////////////////////////////////////////////
//admins dashboard and log in
function loadAdminDashboard() {
  const dashboardHtml = `
        <h2>Admin Dashboard</h2>
        <button id="view-bookings-btn">View Bookings</button>
        <button id="edit-availabilities-btn">Edit Availabilities</button>
        <button id="update-opening-hours-btn">Update Opening Hours</button>
        <button id="logout-btn">Logout</button>
    `;
  document.getElementById("main-content").innerHTML = dashboardHtml;

  // Add event listeners for buttons
  document
    .getElementById("view-bookings-btn")
    .addEventListener("click", viewBookings);
  document
    .getElementById("edit-availabilities-btn")
    .addEventListener("click", editAvailabilities);
  document
    .getElementById("update-opening-hours-btn")
    .addEventListener("click", updateOpeningHours);
  document.getElementById("logout-btn").addEventListener("click", logoutAdmin);
}

function handleAdminLogin(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("http://localhost:3000/api/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Login failed");
      }
      return response.json();
    })
    .then((data) => {
      localStorage.setItem("adminToken", data.token);
      console.log("Logged in successfully");
      loadAdminDashboard(); // Load the admin dashboard after successful login
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Login failed: Invalid credentials");
    });
}


function fetchBarberName(barberId) {
    return fetch(`http://localhost:3000/api/barbers/${barberId}`)
        .then(response => response.json())
        .then(barberData => barberData.name) // Assuming the barber data includes a 'name' field
        .catch(error => console.error('Error fetching barber:', error));
}


function viewBookings() {
  console.log("Fetching bookings...");

  fetch("http://localhost:3000/api/bookings", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  })
    .then((response) => response.json())
    .then((bookings) => {
      const bookingsList = document.createElement("ul");
      bookingsList.className = "booking-list";

      bookings.forEach((booking) => {
        const listItem = document.createElement("li");
        listItem.className = "booking-list-item";
        listItem.innerHTML = `
                <div class="booking-detail"><strong>Customer Name:</strong> ${booking.customer_name}</div>
                <div class="booking-detail"><strong>Email:</strong> ${booking.customer_email}</div>
                <div class="booking-detail"><strong>Phone:</strong> ${booking.customer_phone}</div>
                <div class="booking-detail"><strong>Preferred Haircut:</strong> ${booking.preferred_haircut}</div>
                <div class="booking-detail"><strong>Date:</strong> ${booking.booking_date}</div>
                <div class="booking-detail"><strong>Time:</strong> ${booking.booking_time}</div>
                <div class="booking-detail"><strong>Barber ID:</strong> ${booking.barber_id}</div>
            `;
        bookingsList.appendChild(listItem);
      });

      const mainContent = document.getElementById("main-content");
      mainContent.innerHTML = "";
      mainContent.appendChild(bookingsList);
    })
    .catch((error) => console.error("Error fetching bookings:", error));
}


function fetchAndDisplayBarberAvailabilities() {
  fetch("http://localhost:3000/api/barbers")
    .then((response) => response.json())
    .then((barbers) => {
      const availabilitiesSection = document.createElement("section");
      availabilitiesSection.innerHTML = "<h2>Barber Availabilities</h2>";

      barbers.forEach((barber) => {
        const barberDiv = document.createElement("div");
        barberDiv.innerHTML = `<h3>Barber ${barber.id}</h3>`;
        fetch(`http://localhost:3000/api/barbers/${barber.id}/availability`)
          .then((response) => response.json())
          .then((availabilities) => {
            const availabilityList = document.createElement("ul");
            availabilities.forEach((availability) => {
              const listItem = document.createElement("li");
              listItem.textContent = availability.unavailable_date;
              availabilityList.appendChild(listItem);
            });
            barberDiv.appendChild(availabilityList);
          })
          .catch((error) =>
            console.error("Error fetching availability for barber:", error)
          );

        availabilitiesSection.appendChild(barberDiv);
      });

      const mainContent = document.getElementById("main-content");
      mainContent.innerHTML = "";
      mainContent.appendChild(availabilitiesSection);
    })
    .catch((error) => console.error("Error fetching barbers:", error));
}


function displayEditAvailabilityForm() {
  const formHtml = `
        <form id="edit-availability-form">
            <label for="barber-select">Select Barber:</label>
            <select id="barber-select"></select>

            <label for="unavailable-date">Unavailable Date:</label>
            <input type="date" id="unavailable-date">

            <button type="submit">Update Availability</button>
        </form>
    `;

  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML += formHtml;

  populateBarberSelect(); // Populate the select dropdown with barber options
}

document
  .getElementById("edit-availability-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const barberId = document.getElementById("barber-select").value;
    const unavailableDate = document.getElementById("unavailable-date").value;

    // Assuming you have a backend route to add/update availability
    fetch(`http://localhost:3000/api/barbers/${barberId}/availability`, {
      method: "POST", // Use the correct HTTP method as per your backend implementation
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
      body: JSON.stringify({ unavailable_date: unavailableDate }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update availability");
        }
        return response.json();
      })
      .then(() => {
        alert("Availability updated successfully");
        fetchAndDisplayBarberAvailabilities(); // Refresh the list of availabilities
      })
      .catch((error) => {
        console.error("Error updating availability:", error);
        alert("Error updating availability");
      });
  });


// Utility Functions
function loadContent(contentHtml) {
    document.getElementById("main-content").innerHTML = contentHtml;
}

function fetchData(url, callback) {
    const backendBaseUrl = "http://localhost:3000";
    const fullUrl = backendBaseUrl + url;

    fetch(fullUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => callback(data))
        .catch((error) => console.error("Error fetching data:", error));
}















