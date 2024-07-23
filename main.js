const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const {
  vttFormat,
  getAllFiles
} = require('./utilities');

// Replace with your WhisperAI API endpoint and API key
const WHISPER_API_URL = 'https://transcribe.whisperapi.com';
const API_KEY = 'Hq39q0v69La7EF0fWbGLwC4vw7pfF9OQ';

// Function to upload the MP3 file and get the VTT file
async function generateVTT(filePath) {
    const fileName = path.basename(filePath);

    // Create a FormData instance
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath), fileName);
    form.append('response-format', 'json');
    form.append('diarization', 'true')

    // Set the headers, including the API key
    const headers = {
        ...form.getHeaders(),
        'Authorization': `Bearer ${API_KEY}`
    };

    try {
        // Send the request to WhisperAI API
        const response = await axios.post(WHISPER_API_URL, form, { headers });
        if (response.status === 200) {
            const vttContent = response.data;
            const vttFilePath = path.join(__dirname, `\\vtt_files\\${path.parse(fileName).name}.vtt`);
            vttFormat(response, vttFilePath);
            // Write the VTT content to a file
            //fs.writeFileSync(vttFilePath, vttContent);
            console.log(`VTT file generated: ${vttFilePath}`);
        } else {
            console.error('Failed to generate VTT file:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error generating VTT file:', error);
    }
}

// Get a List of mp3 files in mp3_files directory
allFiles = getAllFiles();

// Generate a VTT file for each mp3
allFiles.forEach(file => {
  const filePath = path.join(__dirname + "\\mp3_files", file);
  generateVTT(filePath);
});






// var fs = require('fs');
// import * as fs from "fs"

// const body = new FormData();
// body.append('file', 'https://output.lemonfox.ai/wikipedia_ai.mp3');
// body.append('language', 'english');
// body.append('response_format', 'json');

// body.append('file', new Blob([fs.readFile('csharp_course_edited.mp3')]));

// fetch('https://api.lemonfox.ai/v1/audio/transcriptions', {
//   method: 'POST',
//   headers: {
//     'Authorization': 'Bearer Hq39q0v69La7EF0fWbGLwC4vw7pfF9OQ'
//   },
//   body: body
// })
// .then(response => response.json()).then(data => {
//   console.log(data['text']);
// })
// .catch(error => {
//   console.error('Error:', error);
// });