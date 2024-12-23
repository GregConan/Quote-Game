# Greg Conan Quote Guessing Game

## Contents

1. Background
1. Game Summary
1. Limitations
1. Extra Features
1. Meta

## Background

During college, my friends and I discussed all kinds of topics, ranging from the philosophical and sociological to the nonsensical and memetic, and everywhere in between. I started collecting quotes from my friends (with permission!) to fondly revisit with them at later dates. When I was brainstorming what kind of project to create for my senior year Web-Based Programming class, I decided to turn my quote list into a game for my friends to guess who said what.

## Game Summary

The Quote Game randomly selects a quote from the `.JSON` file. It displays a list of names, including the name of the person who said the quote. The player must successfully guess and click the name of the right person. If the player guesses incorrectly, then the game says so and removes the name that they guessed from the names list. If the player guesses correctly, then the game says so and replaces the quote with another. Each quote is only shown once, so the game continues until there are no more quotes to guess.

To make the game fair, names can be added or removed from the list at any point. When testing the game with my friends, I found that including 3-5 names is typically a good difficulty level.

## Requirements and Current Status 

After defining values for some variables at the top of the `QuoteGame.js` and `QuoteGame.html` files, you should be able to play the game by simply opening the `QuoteGame.html` file in your web browser of choice.

However, I have not fully or rigorously tested the game in multiple browsers or multiple devices recently, so the game may not be functional at this time.

### Quote List File

For the game to run, you must include a quotes `.JSON` file. I included `example-quotes.json` with generic text strings to show the expected formatting.

## Extra Features

I added a few bonus features to the game's webpage:

- A button to fetch and display a random joke from a third-party web API
- Basic user authentication
- A basic comments section

## Meta

### TODO

- Add more detailed explanation of game setup
- Test and fix game files

### This File

This README.md file was written by @GregConan on 2024-12-21.
