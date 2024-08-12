const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const moment = require("moment");
require("moment-timezone");
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmFwcGVhci5pbiIsImF1ZCI6Imh0dHBzOi8vYXBpLmFwcGVhci5pbi92MSIsImV4cCI6OTAwNzE5OTI1NDc0MDk5MSwiaWF0IjoxNzEyMDUxMzMxLCJvcmdhbml6YXRpb25JZCI6MjIyODY1LCJqdGkiOiI3OTNlNmU0MS1jMjEwLTQ4NTktYjJmZS1hNjRlYjg1NDU0NmUifQ.HuBwEO--xnhHbMDU-mBdoDQ58yEWhix7rOsbqEbngtA";
const app = express();
const mysql = require('mysql');
const PORT = 3001;
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});


app.use(cors());
app.use(bodyParser.json());


app.post("/meetings", async (req, res) => {
  try {
    const { endDate, duration,name } = req.body;
    const startDate = endDate
    // Check if endDate and duration are present and valid
    if (!endDate || !duration || isNaN(duration)) {
      throw new Error("Invalid or missing data");
    }

    const indiaDateTime = moment.utc(endDate).tz("Asia/Kolkata");

    // Check if indiaDateTime is a valid date
    if (!indiaDateTime.isValid()) {
      throw new Error("Invalid date provided");
    }

    const newEndDate = indiaDateTime.add(Number(duration), "minutes").toISOString().slice(0, -5) + ".000Z";

    // Perform API call here using newEndDate
    const response = await fetch("https://api.whereby.dev/v1/meetings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endDate: newEndDate,
        fields: ["hostRoomUrl"],
      }),
    });

    const data = await response.json();

    // Save data to the database
    const {   roomName, roomUrl, meetingId, hostRoomUrl } = data;

    db.query(
      `INSERT INTO whereby_host (name, startDate, endDate, roomName, roomUrl, meetingId, hostRoomUrl) VALUES (?, ?, ?, ?, ?, ?, ? )`,
      [name, startDate, newEndDate, roomName, roomUrl, meetingId, hostRoomUrl],
      (error, results) => {
        if (error) {
          console.error("Error inserting into database:", error);
          res.status(500).json({ success: false, message: "Error booking meeting" });
        } else {
          res.status(200).json({ success: true, message: "Meeting booked successfully", endDate: newEndDate });
        }
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Error booking meeting" });
  }
});


app.get("/host", async (req, res) => {
  const query = "SELECT * FROM whereby_host";

  db.query(query, (error, results) => {
    if (error) {
      console.error("Host error:", error);
      res.status(500).json({ success: false, message: "Error fetching host data" });
    } else {
      res.status(200).json({ success: true, message: "Host data Fetched", data: results });
    }
  });
});




app.delete("/deletmeeting/:meetingId", async (req, res) => {
  const { meetingId } = req.params;
  try {
      // Delete the meeting from Whereby API
      const response = await fetch(`https://api.whereby.dev/v1/meetings/${meetingId}`, {
          method: 'DELETE',
          headers: {
              Authorization: `Bearer ${API_KEY}`,
              "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
          console.log(`Failed to delete meeting from Whereby. Status: ${response.status}`);
          return res.status(response.status).json({ error: 'Failed to delete meeting from Whereby' });
      }

      // If meeting is successfully deleted from Whereby, delete related data from your database
      db.query('DELETE FROM whereby_host WHERE meetingId = ?', [meetingId], (error, results) => {
          if (error) {
              console.error('Error deleting meeting data from database:', error);
              return res.status(500).json({ error: 'Internal server error' });
          }
          // Respond with 204 No Content on successful deletion
          res.status(204).end();
      });
  } catch (error) {
      console.error('Error deleting meeting:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


async function checkExpiredMeetings() {
  const now = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  db.query(
    `SELECT * FROM whereby_host WHERE endDate < ?`,
    [now],
    async (error, results) => {
      if (error) {
        console.error('Error checking expired meetings:', error);
        return;
      }

      for (const meeting of results) {
        const {
          name,
          startDate,
          endDate,
          roomName,
          roomUrl,
          meetingId,
          hostRoomUrl
        } = meeting;

        db.query(
          `INSERT INTO meetings_attended (name, startDate, endDate, roomName, roomUrl, meetingId, hostRoomUrl) VALUES (?, ?, ?, ?, ?, ?, ? )`,
          [name, startDate, endDate, roomName, roomUrl, meetingId, hostRoomUrl],
          (insertError, insertResults) => {
            if (insertError) {
              console.error('Error moving expired meeting to meetings_attended:', insertError);
            } else {
              // Delete expired meeting from whereby_host table
              db.query(
                `DELETE FROM whereby_host WHERE meetingId = ?`,
                [meetingId],
                (deleteError, deleteResults) => {
                  if (deleteError) {
                    console.error('Error deleting expired meeting from whereby_host:', deleteError);
                  }
                }
              );
            }
          }
        );
      }
    }
  );
}


setInterval(checkExpiredMeetings, 60 * 60 * 1000); 

app.get("/attendedmeetings", async (req, res) => {
  const query = "SELECT * FROM meetings_attended";

  db.query(query, (error, results) => {
    if (error) {
      console.error("Host error:", error);
      res.status(500).json({ success: false, message: "Error fetching host data" });
    } else {
      res.status(200).json({ success: true, message: "Host data Fetched", data: results });
    }
  });
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
