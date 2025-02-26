# Tandem Tech Test

## Setup

Written with Node v20.12.2

In order to run this test, be sure to run `npm i` command before anything else. Now you can run it via `node main.js`

## Description of what have been done

This program reads the sessions traces from sessions.json file and produces an HTML report highlighting following informations :

- Top 10 of most visited pages
- All errors detected (may contain a lot of unrelevant events though)

## Comments

At first, I assumed this was a typical case in big data, parsing very large files and extracting informations to generate a report. From what I know, problems like these are handled by :

- Partitonning source file into chunks of thousand lines, or more
- Send each data chunk in a thread to analyze it
- Wait for all threads to be done and then produce a report

I chose Javascript because I'm more confortable with, but it's signgle-threaded. Fortunately, workers are availables so I started to use them, but then I realized I would be stuck doing so. "Detecting common user flows" suggests I have to compare sessions each other, so splitting them into multiple threads, even if they can share some memory, would be quite complicated to implement within a 2h time limit. So I chose to execute all in the main thread, despite it's not as scalable.

Then, I faced another big issue : how to identify the so-called "user flows" and "anomalies". To be honest, I didn't see any solution that can be implemented within the time limit. Since this implies to understand what an anomaly is, and to somewhat build a graph of page transitions accross all sessions, in order to highlight the boldest edges... Surely too complicated. I couldn't see what I could do, unless using an AI. I first didn't want to try this solution in a technical test, for me it would be like cheating. At last, I gave a try to ChatGPT via OpenAI package, but I had issues, maybe related to prompt length, since there's a Token Per Minute limit.

At this point, I hadn't so much time left so I decided to make things simple :

- I could not detect common navigation flows, but I could at least make a ranking of most viewed pages
- I don't know how to categorize a behavior as an anomaly, but I can at least assume that a trace about a div with class "error-message" could be highlighted

With these two informations, I generated an HTML report using a templating tool.
