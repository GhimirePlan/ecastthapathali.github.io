import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import "./EventRegistration.css";

interface Event {
  id: string;
  title: string;
  rules: string;
  description: string;
}
const showAlert = (message: string) => {
  // Create background overlay
  const bgOverlay = document.createElement("div");
  bgOverlay.className = "fixed inset-0 bg-black bg-opacity-50 z-50";

  // Create alert box
  const alertBox = document.createElement("div");
  alertBox.className =
    "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black p-6 rounded shadow-lg z-50 max-w-xs w-full text-center";

  // Create close button
  const closeButton = document.createElement("button");
  closeButton.className = "absolute top-0 right-0 mt-2 mr-2 text-black";
  closeButton.innerHTML = "&times;";
  closeButton.onclick = () => {
    document.body.removeChild(alertBox);
    document.body.removeChild(bgOverlay);
  };

  // Append close button to alert box
  alertBox.appendChild(closeButton);

  // Create message paragraph
  const messageParagraph = document.createElement("p");
  messageParagraph.innerText = message;

  // Append message paragraph to alert box
  alertBox.appendChild(messageParagraph);

  // Append alert box and background overlay to the body
  document.body.appendChild(bgOverlay);
  document.body.appendChild(alertBox);
};
const EventRegistration: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [college, setCollege] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [chosenYear, setChosenYear] = useState<string>("");
  const [confirmation, setConfirmation] = useState<boolean>(false);
  const [agreement, setAgreement] = useState<boolean>(false);
  const [document, setDocument] = useState<File | null>(null);
  const [howDidYouHear, setHowDidYouHear] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [experience, setExperience] = useState<string>("");

  useEffect(() => {
    const events: Event[] = [
      {
        id: "backend-workshop",
        title: "Django: A 7-Day Backend Workshop",
        rules: "https://bit.ly/ecast-backend-guidelines",
        description:
          "A 7-day intensive workshop to master Django and build powerful backend applications with hands-on projects and expert guidance.",
      },
      // Add more events as needed
      
    ];

    const selectedEvent = events.find((e) => e.id === eventId);
    setEvent(selectedEvent || null);
  }, [eventId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("college_name", college);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("year", chosenYear);
    formData.append("experience", experience);
    formData.append("reason", reason);
    formData.append("howDidYouHear", howDidYouHear);
    formData.append("confirmation", confirmation ? "true" : "false");
    formData.append("agreement", agreement ? "true" : "false");
    if (document) {
      formData.append("article_file", document);
    }

    try {
      const response = await fetch(
        "https://ecast.pythonanywhere.com/api/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.status !== 201) {
        const responseData = await response.json();
        console.log("Error response:", responseData);

        if (
          responseData.error &&
          responseData.error.includes("email must make a unique set")
        ) {
          showAlert(
            "Error: The email is already used. Please use a unique email."
          );
        } else if (
          responseData.error &&
          responseData.error.includes("Enter a valid email address.")
        ) {
          showAlert("Error: Please enter a valid email adress");
        } else if (responseData.error) {
          showAlert(`Error: ${responseData.error}`);
        } else {
          showAlert("Failed to submit form. Please try again.");
        }
        return;
      }

      const responseData = await response.json();
      console.log("Success:", responseData);
      setFormSubmitted(true);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-black text-white pt-5 pb-5">
      <div className="card text-white bg-black mr-8 ml-8 mt-10 pt-4 p-6 relative flex items-center justify-center overflow-hidden sm:w-full md:w-96 lg:w-[80%] xl:w-[60%] shadow-outline-red rounded-2xl shadow-custom">
        <div className="content flex flex-col items-center gap-5 w-full text-center">
          {formSubmitted ? (
            <TypeAnimation
              sequence={["Your registration was successful!", 1000]}
              speed={50}
              wrapper="p"
              className="success-message "
              repeat={1}
              cursor={false}
            />
          ) : event ? (
            <>
              <h2 className="event-title text-2xl font-bold">{event.title}</h2>
              <p className="event-rules">
                Read the Guidelines:{" "}
                <a
                  href={event.rules}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="highlight-link"
                >
                  HERE
                </a>
              </p>
              <TypeAnimation
                sequence={[event.description, 1000]}
                speed={50}
                wrapper="p"
                className="event-description"
                repeat={1}
                cursor={false}
              />
              <form onSubmit={handleSubmit} className="rsvp-form w-full">
                <label className="input-label">
                  Full Name
                  <span className="required-field"> *</span>
                </label>
                <input
                  type="text"
                  placeholder="Your Name Here"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input-field"
                />
                <div className="form-gap" />
                <label className="input-label">
                  College/University Name
                  <span className="required-field"> *</span>
                </label>
                <input
                  type="text"
                  placeholder="Your Campus Name Here"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  required
                  className="input-field"
                />
                <div className="form-gap" />
                <label className="input-label">
                  Email
                  <span className="required-field"> *</span>
                </label>
                <input
                  type="email"
                  placeholder="ramshyam@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field"
                />
                <div className="form-gap" />
                <label className="input-label">
                  Contact
                  <span className="required-field"> *</span>
                </label>
                <input
                  type="tel"
                  placeholder="+977 9800000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="input-field"
                />
                <div className="form-gap" />
                <label className="input-label">
                  Year of Study
                  <span className="required-field"> *</span>
                </label>
                <select
                  className="input-field"
                  value={chosenYear}
                  onChange={(e) => setChosenYear(e.target.value)}
                  required
                >
                  <option className="text-black" value="">
                    Select Year
                  </option>
                  <option className="text-black" value="1st Year">
                    1st Year
                  </option>
                  <option className="text-black" value="2nd Year">
                    2nd Year
                  </option>
                  <option className="text-black" value="3rd Year">
                    3rd Year
                  </option>
                  <option className="text-black" value="4th Year">
                    4th Year
                  </option>
                  <option className="text-black" value="School / +2 Level">
                    School / +2 Level
                  </option>
                </select>
                <div className="form-gap" />
                <label className="input-label">
                  Prior Experience with Python or Django
                  <span className="required-field"> *</span>
                </label>
                <div className="radio-group">
                  <label className="radio-container">
                    Yes
                    <input
                      type="radio"
                      value="yes"
                      checked={experience === "yes"}
                      onChange={(e) => setExperience(e.target.value)}
                      required
                    />
                    <span className="checkmark"></span>
                  </label>
                  <label className="radio-container">
                    No
                    <input
                      type="radio"
                      value="no"
                      checked={experience === "no"}
                      onChange={(e) => setExperience(e.target.value)}
                      required
                    />
                    <span className="checkmark"></span>
                  </label>
                </div>

                <div className="form-gap" />
                <label className="input-label">
                  Why do you want to join this Workshop?
                  <span className="required-field"> *</span>
                </label>
                <textarea
                  placeholder="Your brief explanation here"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="input-field"
                />
                <div className="form-gap" />
                <label className="input-label">
                  How did you hear about the Workshop?
                  <span className="required-field"> *</span>
                </label>
                <select
                  className="input-field"
                  value={howDidYouHear}
                  onChange={(e) => setHowDidYouHear(e.target.value)}
                  required
                >
                  <option className="text-black" value="">
                    Select an option
                  </option>
                  <option className="text-black" value="Social Media">
                    Social Media
                  </option>
                  <option
                    className="text-black"
                    value="Recommended by a Professor"
                  >
                    Recommended by a Professor
                  </option>
                  <option className="text-black" value="A Friend or Classmate">
                    A Friend or Classmate
                  </option>
                  <option className="text-black" value="Others">
                    Others
                  </option>
                </select>
                <div className="form-gap" />
                <label className="input-label">Upload your CV ( .pdf )</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  required
                  className="input-field"
                  accept=".pdf"
                />
                <div className="form-gap" />
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={confirmation}
                    onChange={(e) => setConfirmation(e.target.checked)}
                    required
                  />
                  &nbsp; I confirm my participation in the Django 7-Day Backend Workshop.
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={agreement}
                    onChange={(e) => setAgreement(e.target.checked)}
                    required
                  />
                  &nbsp; I acknowledge that I have read and agree to the guidelines attached.
                </label>
                <div className="submit-container">
                  <button type="submit" className="submit-button my-5">
                    Submit
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="bg-black text-white text-center h-screen flex flex-col justify-center items-center p-5">
              <TypeAnimation
                sequence={["Event Coming Soon", 1000]}
                speed={50}
                wrapper="h1"
                className="text-6xl md:text-8xl mb-5"
                cursor={false}
              />
              <TypeAnimation
                sequence={[
                  "The event you are looking for is on its way.",
                  1000,
                ]}
                speed={50}
                wrapper="p"
                className="text-xl md:text-2xl mb-8"
                cursor={false}
              />
              <Link
                to="/ourevents"
                className="bg-white text-black py-2 px-4 rounded-lg text-lg md:text-xl transition-transform duration-300 transform hover:scale-110"
                style={{
                  textShadow:
                    "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6)",
                  animation: "glow 1.5s ease-in-out infinite",
                }}
              >
                Go to Events
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;
