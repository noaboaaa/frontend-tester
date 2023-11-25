// Function to load the home page
function loadHomePage() {
    document.getElementById('main-content').innerHTML = `
        <div class="welcome">
            <h2>Welcome to add salon name here</h2>
            <p>Discover our world-class hairdressing services and meet our talented team.</p>
            <button id="book-now-main" class="book-now-btn">Book Now</button>
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
    document.getElementById('book-now-main').addEventListener('click', loadBookingForm);
}

function loadBookingForm() {
  let content = `
        <div class="booking-container">
            <h2>Book an Appointment</h2>
            <form id="booking-form">
                <div class="form-group">
                    <label for="hairdresser">Hairdresser:</label>
                    <select id="hairdresser">
                        <option value="1">Alex</option>
                        <option value="2">Jordan</option>
                        <option value="3">Taylor</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="service">Service:</label>
                    <select id="service" onchange="updateServiceDetails()">
                        <option value="haircut">Haircut</option>
                        <option value="coloring">Coloring</option>
                        <option value="styling">Styling</option>
                    </select>
                </div>
                <div id="service-details" class="service-details">
                    <!-- Service details will be displayed here -->
                </div>
                <div class="form-group">
                    <label for="date">Date:</label>
                    <input type="date" id="date">
                </div>
                <div class="form-group">
                    <label for="time">Time:</label>
                    <select id="time">
                        <option value="09:00">09:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="13:00">01:00 PM</option>
                    </select>
                </div>
                <button type="submit" class="submit-btn">Book Now</button>
            </form>
        </div>
    `;
  document.getElementById("main-content").innerHTML = content;
}

// Function to update service details
function updateServiceDetails() {
  const service = document.getElementById("service").value;
  const details = {
    haircut: { price: "$40", description: "Includes a wash, cut, and dry." },
    coloring: { price: "$60", description: "Includes hair coloring and wash." },
    styling: { price: "$50", description: "Includes hair styling for events." },
  };

  document.getElementById("service-details").innerHTML = `
        <p><strong>Price:</strong> ${details[service].price}</p>
        <p><strong>Description:</strong> ${details[service].description}</p>
    `;
}
// Function to load the about page
function loadAboutPage() {
  document.getElementById("main-content").innerHTML = `
        <div class="about-page">
            <h2>About Elegant Locks</h2>
            <p>Welcome to Elegant Locks, where your hair is pampered and treated by professional stylists to maintain a healthy color and glow. We promise our services are worth the time and money, and once you experience what Elegant Locks has to offer, you'll dump your box dye in the trash and keep coming back!</p>
        </div>
    `;
}

// Function to load the meet us page
function loadMeetUsPage() {
  document.getElementById("main-content").innerHTML = `
        <div class="meet-us-page">
            <h2>Meet Our Team</h2>
            <div class="team-member">
                <img src="https://i.ibb.co/sgRmX3g/Screenshot-2023-11-07-at-21-36-00.png" alt="Alex">
                <h3>Alex - Senior Stylist</h3>
                <p>With over 10 years of experience, Alex specializes in modern styling techniques.</p>
            </div>
            <div class="team-member">
                <img src="https://i.ibb.co/sgRmX3g/Screenshot-2023-11-07-at-21-36-00.png" alt="Jordan">
                <h3>Jordan - Color Specialist</h3>
                <p>Jordan is an expert in color theory, providing vibrant and lasting color treatments.</p>
            </div>
            <div class="team-member">
                <img src="https://i.ibb.co/sgRmX3g/Screenshot-2023-11-07-at-21-36-00.png" alt="Taylor">
                <h3>Taylor - Styling Expert</h3>
                <p>Known for exquisite updos and event styling, Taylor brings your vision to life.</p>
            </div>
        </div>
    `;
}


// Event listeners for navigation buttons
document.getElementById("home-btn").addEventListener("click", loadHomePage);
document.getElementById("about-btn").addEventListener("click", loadAboutPage);
document
  .getElementById("meet-us-btn")
  .addEventListener("click", loadMeetUsPage);
document
  .getElementById("book-now-btn")
  .addEventListener("click", loadBookingForm);

// Initial load 
loadHomePage();
