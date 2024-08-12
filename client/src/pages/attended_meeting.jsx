import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AttendedMeetings = () => {
  const [attendedMeetings, setAttendedMeetings] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/attendedmeetings')
      .then(response => response.json())
      .then(data => setAttendedMeetings(data.data))
      .catch(error => console.error('Error fetching attended meetings:', error));
  }, []);

  return (
    <div className="attended-meetings-container">
    <Link to='/host'>
    <button className='btn btn-primary'>Back</button>
    </Link>
      <h1 className="meetings-heading">Attended Meetings</h1>
      <table className="meetings-table">
        <thead>
          <tr>
            <th className="table-header">Name</th>
            <th className="table-header">Start Date</th>
            <th className="table-header">End Date</th>
          </tr>
        </thead>
        <tbody>
          {attendedMeetings.map(meeting => (
            <tr key={meeting.meetingId} className="table-row">
              <td className="table-cell">{meeting.name}</td>
              <td className="table-cell">{meeting.startDate}</td>
              <td className="table-cell">{meeting.endDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendedMeetings;
