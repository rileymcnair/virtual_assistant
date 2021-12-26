Virtual Assistant Web App

## Overview

Web application that supports a myriad of queries interacted with either by voice or keyboard input. On demand
queries include: YouTube video search and playback, Twitter search, general/informational questions, WolframAlpha calculations, and more!
Responses to queries are either displayed to the user or in the case of YouTube and Twitter, the user is automatically
redirected to the appropriate first-party page. Algorithm decides how to respond and which service to call based on keywords from user's query.
This application is server equipped and automatically sets up a local host server for each instance. 

## How To Use

* Getting Started
  * ./server.py will run the entire program and set up the local host server on port 8000
* Necessary Modules 
  * wolframalpha
    * https://pypi.org/project/wolframalpha/
  * wikipedia
    * https://pypi.org/project/wikipedia/
  * speech_recognition
    * https://pypi.org/project/SpeechRecognition/
* Forming Specific Queries
  * YouTube
    * "play [video] by/from [creator]"
    * "play [song] by/from [artist]"
    * "play [title] video"
  * Twitter 
    * "(show me) tweets about [topic]"
    * "(show me) tweets from [Twitter user]"
    
   
## Features

* Speech Recognition Module / Google Speech to Text
  * runs locally when invoked on user's machine
  * sends response to user if unable to recognize
  * text to speech response used as query
  * displays user query once text to speech is successful
* Wikipedia API
  * responds to general/informational queries
  * requests response from relevant Wikipedia page based on user query
* WolframAlpha API
  * responds to calculational/mathematical queries 
  * responds to quantitative queries
* YouTube Integration
  * plays song or video based on top result from user query
  * automatically redirects user to corresponding youtube.com URL
* Twitter Integration
  * allows queries for Twitter users, topics, and tweets
  * automatically redirects user to corresponding twitter.com URL

