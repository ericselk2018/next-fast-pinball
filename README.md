# Pinball

## State

There actually isn't a lot of state information in many pinball games, including this one. All state is explained here.

### Player Score (Game Context)

Each player has a score, a simple number.

### Player Balls Total (Game Context)

Each player has a count of total balls for the game -- increases if they achieve an extra ball.

### Player Balls Used (Game Context)

The number of balls, from total, that player has used. When used reaches total, no additional balls will be given, game over for player when balls drain.

### Player Initials (Machine Context)

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

### Switches Opened/Closed (Hardware Context)

Open/closed flags for each switch. This is also maintained by the hardware (when not in virtual mode), but we keep a local copy in sync with hardware to avoid having to query the hardware, and so we can trigger hooks when state changes.

### Switches Hit/Lit (Game Context)

As switches are hit, game logic is applied to toggle a hit/lit state.

### Credits (Machine Context)

Number of credits available (not spent).

## Folder Structure

### app

Basic NextJS bootstrap, with very few changes. You don't need to spend much time in here - see NextJS docs if you do.

### components

All React components go here. They are all client components (not server), since we don't care about SSR, SSG or SEO.

#### ClientApp

Entry point. Provides contexts and renders StartController.

#### GameController

Controls a game. Renders only while a game is running. Decides which mode is active.

#### ModeSelect

Rendered during mode selection (no active balls). Allows player to select the next mode to start.

#### ModeSlide

Obsolete - will move to Slides\GameSlide

#### Play

Obsolete - will move to Slides\GameSlide

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

#### Constraints

Limits we set to avoid the game being overly complex.

#### Flippers

Information about flippers.

#### KeyBindings

Keyboard mappings for testing with virtual hardware.

#### Modes

Information about game modes.

#### Money

Show me the money!

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

#### Flipper

Flip out!

#### Game

The one and only game object - get from GameContext while a game is active.

#### KeyBinding

A keyboard binding used for virtual hardware testing.

#### Mode

A game mode. More like a mission, with tasks you need to complete.

#### ModeStep

One step in a mode. Modes require multiple steps to complete.

#### ModeTask

A task in a ModeStep (rename to ModeStepTask?). Steps have 1 or more tasks to complete the step.

#### Player

You, and your friends.

#### Switch

A thing that can be opened or closed, 0/1, true/false, happy/sad.

### lib

A place for boring code that you are proud off, but nobody cares about, get over it.

#### array

Some functions that are helpful, but native arrays do not have yet.

#### math

Stuff that Math might have eventually.

#### object

Do stuff with objects, easier.

### node_modules

You didn't see me.

### public

NextJS concept - put font, video, image and audio files here. TODO: add subfolders

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
