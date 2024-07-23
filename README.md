# VTT Generator

## Description
The VTT Generator creates .vtt ("Web Video Text Tracks") files for use in video caption functions during video playback.

It uses the Lemonfox.ai API, available from https://www.lemonfox.ai/.

You will need your own API key from Lemonfox.ai in order to use the application.

## Application Setup
1. Ensure you have Node installed (version 18+)
2. Clone the project locally
3. Open a terminal in the project directory
4. Run ```npm install``` from the terminal to install dependencies
5. add a ```.env``` file at the root of your project
6. Using your API key from Lemonfox.ai in the .env file, put this entry in your .env file: ```API_KEY=[your_api_key]``` (Do not include the square brackets; simply paste your API key)
7. Put your .mp3 files in the ```mp3_files``` directory
8. Run ```npm start```
9. Your generated .vtt files should be placed in the ```vtt_files``` directory

