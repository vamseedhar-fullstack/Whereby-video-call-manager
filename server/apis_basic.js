// -----------------------------------------Create meetings----------------------------------
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmFwcGVhci5pbiIsImF1ZCI6Imh0dHBzOi8vYXBpLmFwcGVhci5pbi92MSIsImV4cCI6OTAwNzE5OTI1NDc0MDk5MSwiaWF0IjoxNzEyMDUxMzMxLCJvcmdhbml6YXRpb25JZCI6MjIyODY1LCJqdGkiOiI3OTNlNmU0MS1jMjEwLTQ4NTktYjJmZS1hNjRlYjg1NDU0NmUifQ.HuBwEO--xnhHbMDU-mBdoDQ58yEWhix7rOsbqEbngtA";



// const data = {
//   endDate: "2024-04-04T01:00:00.000Z",
//   fields: ["hostRoomUrl"],
// };

// function getResponse() {
//     return fetch("https://api.whereby.dev/v1/meetings", {
//         method: "POST",
//         headers: {
//             Authorization: `Bearer ${API_KEY}`,
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//     });
// }

// getResponse().then(async res => {
//     console.log("Status code:", res.status);
//     const data = await res.json();
//     console.log("Room URL:", data.roomUrl);
//     console.log("Host room URL:", data.hostRoomUrl);
//     console.log("Response from Whereby API:", data);

// });


// -------------------------------------------getmeetinglist--------------------------------------------------


// async function getmeetinglist() {
//   try {
//     const response = await fetch('https://api.whereby.dev/v1/meetings', {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch meetings');
//     }

//     const data = await response.json();
//     console.log(data);
//   } catch (error) {
//     console.error('Error fetching meetings:', error.message);
//   }
// }

// // Call the function to fetch the meeting list
// getmeetinglist();


// --------------------------------------------specified getmeeting-------------------------------------------

// const meetingId = 84520108;

// async function specifiedgetmeeting() {
//   const response = await fetch(`https://api.whereby.dev/v1/meetings/${meetingId}`, {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${API_KEY}`,
//       "Content-Type": "application/json",
//     },
//   });

//   const data = await response.json();
//   console.log(data);
// }

// specifiedgetmeeting();


// -------------------------------------------Delete Meeting---------------------------------------------------

// async function Deletemeeting() {
//   try {
//     const response = await fetch(`https://api.whereby.dev/v1/meetings/${meetingId}`, {
//       method: 'DELETE',
//       headers: {
//         Authorization: `Bearer ${API_KEY}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if (response.ok) {
//       console.log('Meeting deleted successfully.');
//     } else {
//       console.log(`Failed to delete meeting. Status: ${response.status}`);
//     }
//   } catch (error) {
//     if (error.type === 'invalid-json') {
//       console.log('JSON response error ignored for DELETE request.');
//     } else {
//       console.error('Error deleting meeting:', error);
//     }
//   }
// }

// Deletemeeting();


// ---------------------------------------------Get recordings----------------------------------------


//  async function Getrecordings() {
//     const response = await fetch(`https://api.whereby.dev/v1/recordings`, {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${API_KEY}`,
//         "Content-Type": "application/json",
//       },
//     });
  
//     const data = await response.json();
//     console.log(data);
//   }
  
//   Getrecordings();


//   --------specified meetings-------

//   const response = await fetch('https://api.whereby.dev/v1/recordings/{recordingId}', {
//     method: 'GET',
//     headers: {},
// });
// const data = await response.json();


// -----------specified Delete meetings-----------

// const response = await fetch('https://api.whereby.dev/v1/recordings/{recordingId}', {
//     method: 'DELETE',
//     headers: {},
// });
// const data = await response.json();


// ---------------------------------Convert video recording to Text - (transcription)--------------------------------------------


// async function Create_recordingstranscription() {
//   try {
//     const response = await fetch('https://api.whereby.dev/v1/transcriptions', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${API_KEY}`,
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         "recordingId": "1" // Replace "1" with the actual recording ID
//       }),
//     });

//     if (response.ok) {
//       const data = await response.json();
//       console.log('Transcription created successfully:', data);
//     } else {
//       console.log('Failed to create transcription:', response.statusText);
//     }
//   } catch (error) {
//     console.error('Error creating transcription:', error);
//   }
// }

// Create_recordingstranscription();


// -------------------------------------Get transcriptions---------------------------------------


// async function Gettranscriptions() {
//   const response = await fetch('https://api.whereby.dev/v1/transcriptions', {
//     method: 'GET',
//     headers: {
//               Authorization: `Bearer ${API_KEY}`,
//               "Content-Type": "application/json"
//             },
// });
// const data = await response.json();
// console.log(data)
// }

// Gettranscriptions()

// ----------specified transcription metadata-----------------

// const response = await fetch('https://api.whereby.dev/v1/transcriptions/{transcriptionId}', {
//     method: 'GET',
//     headers: {},
// });
// const data = await response.json();



// ---------------------------------Get transcription access link-----------------------------------

// async function Gettranscriptionaccesslink() {
//       const response = await fetch('https://api.whereby.dev/v1/transcriptions/{transcriptionId}/access-link', {
//         method: 'GET',
//         headers: {
//                 Authorization: `Bearer ${API_KEY}`,
//                 "Content-Type": "application/json"
//               },
//     });
//     const data = await response.json();
// }


// -----------------------------Delete transcription-------------------------------

// async function Deletetranscription() {
//   const response = await fetch('https://api.whereby.dev/v1/transcriptions/{transcriptionId}', {
//     method: 'DELETE',
//     headers: {
//           Authorization: `Bearer ${API_KEY}`,
//           "Content-Type": "application/json"
//     },
// });
// const data = await response.json();
// }

// Deletetranscription()