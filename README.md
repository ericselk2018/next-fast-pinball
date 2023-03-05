# Pinball

## State

There actually isn't a lot of state information in many pinball games, including this one. All state is explained here.

### Player Score (Game Context)

Each player has a score, a simple number.

### Player Balls Total (Game Context)

Each player has a count of total balls for the game -- increases if they achieve an extra ball.

### Player Balls Used (Game Context)

The number of balls, from total, that player has used. When used reaches total, no additional balls will be given, game over for player when balls drain.

### Player Initials (Game Context)

List of player initials currently playing - can't change during game. Just used for achievement tracking.

### Player Modes Completed (Game Context)

Simple list of mode names completed by each player for current game.

### Current Mode (Game Context)

The current mode being played, a simple string equal to the name of the mode. Might change to an ID based system when adding achievement tracking, so that achievements persist if names are changed.

### Current Mode Step Tasks Completed (Game Context)

Tasks completed for the current mode - mode name, step name, and switch number.

### Shot Tracker (Game Context)

TBD - some info to support combo shot tracking (if it cannot be tracked based on light/switch status), and also a UI component that shows points earned and special bonus points like "+10,000 Combo Shot Bonus". Maybe the UI shows points flying by as you get them, like the numbers when you shoot an enemy in Apex Legends.

### Current Video Playing (Game Context)

When certain things happen like a goal being completed, or a combo shot hit, a video will play. Like most things in React, this is done with a state update.

### Current Player (Game Context)

The current player, a 0 based index, a simple number.

### Switches Hit/Lit (Game Context)

As switches are activated (hit/pressed), game logic is applied to toggle a hit/lit state.

### Credits (Machine Context)

Number of credits available (not spent).

### Balls in Play (Game Context)

Number of balls moving on playfield, just a count.

### Saucer Hole Balls (Game Context)

Switch id for each saucer hole switch that contains a ball.

### Hardware Error (Hardware Context)

An error, if unable to connect to FAST controller.

### Browser Serial Port Permission Required (Hardware Context)

The first time we connect to a new serial port from a new browser/device, we need to get permission. This is done with a one-time setup process. It needs to be redone if certain data is cleared/reset, but it should never expire if changes to the host computer are not done. Hopefully in the future browsers will have a feature flag to disable this security.

### Boot Complete (Hardware Context)

At startup we need to connect to FAST controller before certain modes can start.

### Switch Open/Closed State (Hardware Context)

For some switches we don't just track hits, we want to know the current state. This state is just an array of booleans, one for each switch, indexed by switch number, true = open.

## Folder Structure

### app

Basic NextJS bootstrap, with very few changes. You don't need to spend much time in here - see NextJS docs if you do.

### components

All React components go here. They are all client components (not server), since we don't care about SSR, SSG or SEO.

#### Blink

Component for blinking (flashing) text. Used for selecting number of players and initials before game starts.

#### ClientApp

Entry point. Provides contexts and renders StartController.

#### GameController

Controls a game. Renders only while a game is running. Decides which mode is active. Renders game status and slides.

#### GameStatus

Renders game status during game. Player scores, ball count, shot information, and tells players whos turn it is.

#### Slides

All slides go here. Slides are UI views.

##### AttractSlide

The slide displayed during attract mode. Attracts players -- makes them want to play the game.

##### GameSlide

The slide displayed during game play. For now we only have one game slide. In the future we may add more.

##### Slide

Base slide component rendered by all slides. Handles common styles and transitions used by all slides.

#### StartController

Holds logic for starting and ending games. Decides if we are in attract mode or game mode.

### const

Holds all of the constants - things that do not change, unless a developer changes them.

#### AudioFiles

Information about audio files.

#### Coils

List of drivers/coils in your game.

#### Constraints

Limits we set to avoid the game being overly complex.

#### Flippers

Information about flippers.

#### KeyBindings

Keyboard mappings for testing with virtual hardware.

#### Lights

LED/Lights/Bulbs/GI -- all goes here.

#### Modes

Information about game modes.

#### Money

Show me the money!

#### Rules

Without rules, we have chaos.

#### Setup

Mostly options to toggle while doing development and testing on virtual hardware.

#### Switches

Information about switches goes here.

### contexts

Context - data, state and functions shared by multiple components.

#### AudioContext

Exposes methods to support audio.

#### GameContext

Only available while a game is active. Do not use in non-game components, like attract mode or start controller. Has features for general game play.

#### HardwareContext

Communicates with FAST hardware, or optional virtual hardware for testing while away from your real machine.

#### MachineContext

Provides machine information, like number of credits (coins inserted), state of coin door, tilt, and logged in users (future feature).

### entities

Contains all of the first class citizens (aka things or nouns) that exist in our code.

#### Coil

Also known as a driver. Common pinball hardware -- electromagnet.

#### Flipper

Flip out!

#### Game

The one and only game object - get from GameContext while a game is active.

#### Hardware

Holds information about hardware, mostly from the FAST controller. Get from HardwareContext.

#### Kicker

I've heard them called a few names, including "Saucer Hole Kicker". In our game they are homes/garages/safe-houses. They hold the ball for a period of time, then kick it out. VPX calls them kickers, so I will too.

#### Light

A light, in the form of LED, GI, or anything else.

#### Machine

Holds information available about the machine state, available from MachineContext, such as the number of credits. If it isn't hardware related, and persists across multiple games, it probably goes here.

#### Mode

A game mode. More like a mission, with tasks you need to complete.

#### ModeStep

One step in a mode. Modes require multiple steps to complete.

#### Player

You, and your friends.

#### Shot

A special shot that is good enough to have a name. Shown on the display when achieved.

#### Switch

A thing that can be opened or closed, 0/1, true/false, happy/sad.

#### TargetSwitch

A specific switch type that is a goal for a mode step. Includes an image and videos to display.

### lib

A place for boring code that you are proud off, but nobody cares about, get over it.

#### array

Some functions that are helpful, but native arrays do not have yet.

#### math

Stuff that Math might have eventually.

#### object

Do stuff with objects, easier.

#### string

String functions.

### node_modules

You didn't see me.

### public

NextJS concept - put font, video, image and audio files here.

## Design

### KISS

I'm stupid, you probably are too, so keep it simple stupid.

### YAGNI

If you don't need it now, you aren't going to need it, just delete it or don't build it in the first place.

### Custom Slim over Generic Bloat

This is custom code made for a single game, not a general purpose library to build lots of games. That said, you could use this as a bootstrap and delete everything you do not need (most important), and add only things you do need for another game. I know, NextJS is bloat, but I didn't feel like doing all the boilerplate work to start from scratch, so we have a platform that mostly should stay out of our way.

## Don't ask for anything (except a little help)

I'm not the guy that maintains open source projects in my free time -- please don't ask me to add features to this, it is my game, copy it and make it your own, and maintain it yourself. That said, I'm usually happy to answer questions and help, just don't ask me to write the code or tell you exactly how to write the code. Do most of the work yourself, or use one of the amazing open source projects available like MPF, where many people will help you and maybe even add entire features just for you.

# Begin NextJS Boilerplate Info

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
