const body = new FormData();
body.append('file', 'https://output.lemonfox.ai/wikipedia_ai.mp3');
// instead of providing a URL you can also upload a file object:
// body.append('file', new Blob([await fs.readFile('/path/to/audio.mp3')]));
body.append('language', 'english');
body.append('response_format', 'json');
body.append('file', new Blob([await fs.readFile('csharp_course_edited.mp3')]));

fetch('https://api.lemonfox.ai/v1/audio/transcriptions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer Hq39q0v69La7EF0fWbGLwC4vw7pfF9OQ'
  },
  body: body
})
.then(response => response.json()).then(data => {
  console.log(data['text']);
})
.catch(error => {
  console.error('Error:', error);
});