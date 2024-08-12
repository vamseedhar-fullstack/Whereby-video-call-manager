import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
import { Dialog, DialogTitle, DialogContent, Typography, Button, DialogActions } from "@mui/material";
import { Link } from "react-router-dom";

const localizer = momentLocalizer(moment);

const useStyles = makeStyles({
  calendarContainer: {
    margin: "20px",
    padding: "10px",
    position: "relative",
  },
  event: {
    backgroundColor: "#1976d2",
    color: "#ffffff",
    padding: '5px',
    width: '100%',
    marginBottom: '15px',
  },
});

const Host = () => {
  const classes = useStyles();
  const [events, setEvents] = useState([]);
  const [dialogData, setDialogData] = useState(null);
  const [copiedHostLink, setCopiedHostLink] = useState(false);
  const [copiedUserLink, setCopiedUserLink] = useState(false);
  const [message, setMessage] = useState("");
  const [deletingMeeting, setDeletingMeeting] = useState(false);


  useEffect(() => {
    fetchTableData();
  }, []);

  const fetchTableData = async () => {
    try {
      const response = await fetch("http://localhost:3001/host");
      const responseData = await response.json();
      if (responseData.success) {
        const formattedEvents = responseData.data.map((item) => ({
          title: item.name,
          start: new Date(item.startDate),
          end: new Date(item.endDate),
          backgroundColor: item.color,
          textColor: "#ffffff",
          extendedProps: item,
        }));
        setEvents(formattedEvents);
      } else {
        console.error("Error fetching host data:", responseData.message);
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  const handleEventClick = (event) => {
    setDialogData(event);
  };

  const handleCloseDialog = () => {
    setDialogData(null);
  };

  const handleJoinMeeting = (link) => {
    window.open(link, "_blank");
  };

  const handleCopyLink = (link, setCopiedState) => {
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopiedState(true);
        setTimeout(() => setCopiedState(false), 1000); // Reset copied state after 2 seconds
      })
      .catch((error) => {
        console.error("Error copying link:", error);
      });
  };

  const handleDelete = async (meetingId) => {
    setDeletingMeeting(true);
    try {
      const response = await fetch(
        `http://localhost:3001/deletmeeting/${meetingId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setMessage("Meeting deleted successfully.");
        fetchTableData();
        setDialogData(null);
        setDeletingMeeting(false);
        // Update meetings state or fetch updated meetings list
      } else {
        setMessage(`Failed to delete meeting. Status: ${response.status}`);
        setDeletingMeeting(false);
        // Handle error or show error message
      }
    } catch (error) {
      setMessage("Error deleting meeting:", error);
      setDeletingMeeting(false); 
      // Handle network error or show error message
    }
  };

  const popupClass = message.includes("successfully") ? "success" : "error";


  return (
    <div className={classes.calendarContainer}>
      <div className={`popup ${popupClass} text-center bg-white mb-3`}>
        {message}
      </div>

    <Link to="/">
          <button className="btn btn-dark mb-3">Home</button>
        </Link>

        <Link to="/attendedmeeting">
          <button className="btn btn-primary mb-3 " style={{marginLeft:"10px"}}>Attended Meetings</button>
        </Link>


        
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.backgroundColor,
            color: event.textColor,
          },
        })}
        onSelectEvent={handleEventClick}
      />

      <Dialog open={!!dialogData} onClose={handleCloseDialog}>
        <DialogTitle>{dialogData && dialogData.title}</DialogTitle>
        <DialogContent>
          <Typography>
            Meeting ID: {dialogData && dialogData.extendedProps.meetingId}
          </Typography>
          <Typography>
            Start Date: {dialogData && new Date(dialogData.extendedProps.startDate).toLocaleString()}
          </Typography>
          <Typography>
            End Date: {dialogData && new Date(dialogData.extendedProps.endDate).toLocaleString()}
          </Typography>
          <br/>
          <Typography>
            <Button variant="outlined" onClick={() => handleJoinMeeting(dialogData.extendedProps.hostRoomUrl)}>Join Host Meeting</Button>
          </Typography>
          <br/>
          <Typography>
            <Button variant="outlined" onClick={() => handleJoinMeeting(dialogData.extendedProps.roomUrl)}>Join User Meeting</Button>
          </Typography>
          <br/>
          <Typography>
            <Button
              variant="outlined"
              onClick={() => handleCopyLink(dialogData.extendedProps.hostRoomUrl, setCopiedHostLink)}
              disabled={copiedHostLink}
            >
              {copiedHostLink ? "Copied" : "Copy Host Meeting Link"}
            </Button>
          </Typography>
          <br/>
          <Typography>
            <Button
              variant="outlined"
              onClick={() => handleCopyLink(dialogData.extendedProps.roomUrl, setCopiedUserLink)}
              disabled={copiedUserLink}
            >
              {copiedUserLink ? "Copied" : "Copy User Meeting Link"}
            </Button>
          </Typography>
          <br/>
          <button className="btn btn-danger" onClick={() => handleDelete(dialogData.extendedProps.meetingId)} disabled={deletingMeeting}>
          {deletingMeeting ? "Deleting Meeting..." : "Delete Meeting"}
          </button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Host;
