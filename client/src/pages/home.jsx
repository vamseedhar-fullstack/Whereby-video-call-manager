import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, Typography, makeStyles } from "@material-ui/core";
import "./home.css";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  card: {
    marginBottom: "10px",
  },
});

export const Home = () => {
  const classes = useStyles();
  const [name, setname] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [duration, setDuration] = useState("30");
  const [datetime, setDatetime] = useState("");
  const [message, setMessage] = useState("");


  useEffect(() => {
    fetchMeetings();
  }, []);

  useEffect(() => {
    fetchMeetings();
    const interval = setInterval(fetchMeetings, 30000); // Update every minute
    return () => clearInterval(interval); // Clean up the interval on unmount
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await fetch("http://localhost:3001/host");
      const responseData = await response.json();
      if (responseData.success) {
        const meetingsData = responseData.data;
        setMeetings(meetingsData);
      } else {
        console.error("Error fetching host data:", responseData.message);
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };
  
  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/meetings", {
        endDate: datetime,
        duration,
        name,
      });

      if (response.data.success) {
        setMessage("Meeting booked successfully");
        fetchMeetings(); // Refresh meetings list after booking
        setname("");
        setDatetime("");
        setDuration("");
        setMessage("");
      } else {
        setMessage(response.data.message || "Error booking meeting");
      }
    } catch (error) {
      console.error("Error:", error.message);
      setMessage("Error booking meeting");
    }
  };

  const popupClass = message.includes("successfully") ? "success" : "error";

  return (
    <div className="bg">
      <div className={`popup ${popupClass} text-center bg-white mb-3`}>
        {message}
      </div>

      <div className=" d-flex flex-row justify-content-center align-items-center">
      <form className="unique-form" onSubmit={handleSubmit}>
          <div className="unique-flex-column">
            <label>Name</label>
          </div>
          <div className="unique-inputForm">
            <input
              type="text"
              className="unique-input"
              value={name}
              onChange={(e) => setname(e.target.value)}
              placeholder="Enter your Name"
            />
          </div>

          <div className="unique-flex-column">
            <label>Duration</label>
          </div>
          <div className="unique-duration-options">
            <label style={{ marginRight: "20px" }}>
              <input
                type="radio"
                name="duration"
                value="30"
                checked={duration === "30"}
                onChange={() => setDuration("30")}
              />
              30 minutes
            </label>
            <label>
              <input
                type="radio"
                name="duration"
                value="60"
                checked={duration === "60"}
                onChange={() => setDuration("60")}
              />
              60 minutes
            </label>
          </div>

          <div className="unique-flex-column">
            <label>Date & Time</label>
          </div>
          <div className="unique-inputForm">
            <input
              type="datetime-local"
              className="unique-input"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
            />
          </div>

          <button type="submit" className="unique-button-submit">
            Book
          </button>
        </form>

        <div className="unique-form overfloewww" style={{ marginLeft: "20px" }}>
          <Link to="/host">
            <button className="btn btn-dark">Host Links</button>
          </Link>

          <h3 className="text-center">User Meeting List - {meetings.length}</h3>
          {/* Render meetings list */}
          <div className="meeting-cards-container">
            {meetings && meetings.length > 0 ? (
              meetings.map((meeting) => (
                <Card key={meeting.meetingId} className={classes.card}>
                  <CardContent>
                    <Typography variant="h6">Meeting Details</Typography>
                    <Typography variant="body1">
                      <strong>Meeting ID:</strong> {meeting.meetingId}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Room Name:</strong> {meeting.name}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Start time:</strong>{" "}
                      {new Date(meeting.startDate).toLocaleString()}
                    </Typography>
                    {/* Render the room link as a clickable text */}
                    <Typography variant="body1">
                      <strong>Room URL:</strong>{" "}
                      {new Date(meeting.startDate) <= new Date() && new Date(meeting.endDate) > new Date() ? (
                        <a href={meeting.roomUrl} target="_blank" rel="noopener noreferrer">
                        <button className="btn btn-primary">CLick me</button>
                        </a>
                      ) : new Date(meeting.endDate) <= new Date() ? (
                        <b style={{color:"red"}}>Meeting Ended</b>
                        
                      ) : (
                        <button className="btn btn-primary " style={{ cursor: 'not-allowed' }}>Click me</button>
                       
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body1">No meetings found</Typography>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
