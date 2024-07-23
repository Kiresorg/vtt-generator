const fs = require('fs');
const path = require('path');

function findSpeakerIndex(word, speakerSegments, i) {
    let index = i;
    while (index < speakerSegments.length && word.start > speakerSegments[index].stopTime) {
      index++;
    }
    return index;
  }
  
  function separateOverlaps(speakerRanges) {
    // Sort the speaker ranges by their start time
    speakerRanges.sort((a, b) => a.startTime - b.startTime);
  
    // Initialize an empty list to store the separated ranges
    const separatedRanges = [];
  
    // Iterate through the speaker ranges
    for (let i = 0; i < speakerRanges.length; i++) {
      // If this is the first range, add it to the separated ranges list
      if (i === 0) {
        separatedRanges.push(speakerRanges[i]);
      } else {
        // Get the previous range
        const prevRange = separatedRanges[separatedRanges.length - 1];
  
        // If the current range starts after the previous range ends, add it to the separated ranges list
        if (speakerRanges[i].startTime >= prevRange.stopTime) {
          separatedRanges.push(speakerRanges[i]);
        } else {
          // Otherwise, there is an overlap, so split the ranges
          // First, add the part of the previous range that doesn't overlap
          prevRange.stopTime = speakerRanges[i].startTime;
          // Then add the overlap as a new range
          const overlapRange = {
            speaker: 'OVERLAP',
            startTime: speakerRanges[i].startTime,
            stopTime: Math.min(speakerRanges[i].stopTime, prevRange.stopTime),
          };
          separatedRanges.push(overlapRange);
          // Finally, add the part of the current range that doesn't overlap
          const nonOverlapRange = {
            speaker: speakerRanges[i].speaker,
            startTime: overlapRange.stopTime,
            stopTime: speakerRanges[i].stopTime,
          };
          separatedRanges.push(nonOverlapRange);
        }
      }
    }
    return separatedRanges;
  }
  
  function getSpeakerSegments(res) {
    let currentSpeakerIndex = 0;
    const speakerSegments = separateOverlaps(res.diarization);
    const speakerSegmentsResults = speakerSegments.map((segment) => ({
      text: '',
      time: -1,
      speaker: segment.speaker,
      startTime: segment.startTime,
      stopTime: segment.stopTime,
    }));
  
    res.segments.forEach((segment) => {
      segment.whole_word_timestamps.forEach((word) => {
        currentSpeakerIndex = findSpeakerIndex(word, speakerSegments, currentSpeakerIndex);
        if (currentSpeakerIndex >= speakerSegmentsResults.length) {
          return;
        }
        const thisSpeakerSegmentResults = speakerSegmentsResults[currentSpeakerIndex];
        // IF YOU ARE LOOKING FOR THE START OF THE SEGMENT
        if (thisSpeakerSegmentResults.time === -1) {
          thisSpeakerSegmentResults.time = word.start;
        }
        thisSpeakerSegmentResults.text += word.word;
      });
    });
  
    return speakerSegmentsResults;
  }

  
  function formatDuration(seconds, delimiter) {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toFixed(3).replace('.', delimiter).padStart(6, '0');
    return `${h}:${m}:${s}`;
  }
  
  function getSpeakerSegments(res) {
    let currentSpeakerIndex = 0;
    const speakerSegments = separateOverlaps(res.data['diarization']);
    const speakerSegmentsResults = speakerSegments.map((segment) => ({
      text: '',
      time: -1,
      speaker: segment.speaker,
      startTime: segment.startTime,
      stopTime: segment.stopTime,
    }));
  
    res.data['segments'].forEach((segment) => {
      segment.whole_word_timestamps.forEach((word) => {
        currentSpeakerIndex = findSpeakerIndex(word, speakerSegments, currentSpeakerIndex);
        if (currentSpeakerIndex >= speakerSegmentsResults.length) {
          return;
        }
        const thisSpeakerSegmentResults = speakerSegmentsResults[currentSpeakerIndex];
        // IF YOU ARE LOOKING FOR THE START OF THE SEGMENT
        if (thisSpeakerSegmentResults.time === -1) {
          thisSpeakerSegmentResults.time = word.start;
        }
        thisSpeakerSegmentResults.text += word.word;
        thisSpeakerSegmentResults.text += " ";
      });
    });
  
    return speakerSegmentsResults;
  }
  
  function vttFormat(res, vttFilePath) {
    // build string for VTT file contents
    let vttContent = "";
    vttContent += "WEBVTT";
    vttContent += "\n"
    vttContent += "\n"
  
    const speakerSegmentsResults = getSpeakerSegments(res);
  
    for (let i = 0; i < speakerSegmentsResults.length; i++) {
      if (speakerSegmentsResults[i].text && speakerSegmentsResults[i].time !== -1) {
        // Format the time stamps
        const startTime = formatDuration(parseFloat(speakerSegmentsResults[i].startTime), '.');
        const stopTime = formatDuration(parseFloat(speakerSegmentsResults[i].stopTime), '.');
  
        // Print the time range
        vttContent += `${startTime} --> ${stopTime}`
        vttContent += "\n"
  
        // Handle the speaker and overlap case
        const speaker = speakerSegmentsResults[i].speaker || '';
        if (speaker === 'OVERLAP') {
          vttContent += '<c.overlap>Overlapping conversation:'
          vttContent += "\n"
          vttContent += `${speakerSegmentsResults[i].text}</c>`
          vttContent += "\n"
        } else if (speaker) {
          vttContent += `<v ${speaker}>${speakerSegmentsResults[i].text}</v>`
          vttContent += "\n"
        } else {
          vttContent += speakerSegmentsResults[i].text
          vttContent += "\n"
        }
        vttContent += "\n" // Blank line after each segment
      }
    }
    fs.writeFileSync(vttFilePath, vttContent);
  }

function getAllFiles() {
    const directoryPath = path.join(__dirname, 'mp3_files');
    return filenames = fs.readdirSync(directoryPath); 
}

module.exports = {
findSpeakerIndex,
separateOverlaps,
getSpeakerSegments,
vttFormat,
getAllFiles
};