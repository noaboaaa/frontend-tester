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
  document
    .getElementById("booking-form")
    .addEventListener("submit", handleBookingSubmit);
}

function setupBarberSelectionListener() {
  const barberSelect = document.getElementById("barber-select");
  barberSelect.addEventListener("change", function () {
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
      // Assume you allow booking up to 60 days in advance
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
      date.setDate(date.getDate() + 1); // Increment the date
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
    preferred_haircut:
      document.getElementById("service-select").options[
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
