# Taxi Rank Rush rules

This file is the source of truth. The solver in `src/engine.js` implements these rules and every generated level must replay to a win.

## Board

- The rank is a grid. A combi's nose sits on its listed cell and its body runs backward, opposite the way it faces.
- Sizes: a Hiace is 2 cells and 6 seats, a Quantum is 3 cells and 9 seats, a Sprinter is 4 cells and 12 seats.
- Cones and potholes are cells nothing can drive through. A traffic officer stands on one cell of a path and steps one cell every 3 counted taps.
- Each combi shows a roof chevron for the way it faces.
- Each colour has a hand sign, drawn on the roof and on that colour's passengers, so the colour is never the only cue. Index up is town, a flat hand is local, a circle means to the rank, and the other colours use thumb, peace, fist, point, and wave. A colour-blind palette in settings recolours the same signs.

## Driving

- A tap drives a combi out only when every cell from its nose to the edge is clear, it is not locked, its exit robot is green, and a loading bay is free.
- A blocked tap shakes the combi, hoots, and flashes the blocker in red. It does not spend a tap, a coin, or a light change.
- A red robot refuses the exit the same way and costs nothing. Robots on an exit lane are green for 2 counted taps, then red for 2, then green again.
- Tow-chained combis leave as one tap. Both paths must be clear and two bays must be free.
- Counted taps are only successful exits, tows, and queue sends. The officer and the robots advance on those taps only.
- There are 5 loading bays unless a rescue adds one for the rest of the level.

## Passengers

- One queue boards on its own. The front passenger takes the front-most bay whose combi matches their colour and has enough free seats.
- A bag or bucket needs 2 free seats and fills 2. If the front passenger cannot board, the queue waits.
- A two-route combi has two colours on the roof and accepts either until it is full.
- A gaartjie fills the matching combi the moment they board, and that combi departs.
- From the two-queue lessons onward, nothing boards on its own. Tap the head of a queue to send that passenger first.
- A hidden combi shows a tarp until you tap it or a neighbour leaves. A locked combi shows the number of departures still required before it can move. The lock counts other combis that have already departed.

## Win, lose, stars

- You win when every passenger has boarded.
- You lose when no combi can leave and no passenger can board. The usual case is every bay full and nobody matching.
- Before the lose panel, the game offers one free Gaartjie squeeze, an extra bay for this attempt. If that is not enough, it offers one rewarded-ad bay. Retry is instant. There are no lives and no energy.
- Stars compare counted taps with the solver's fewest taps. Equal to that number is 3 stars, up to 3 extra taps is 2, otherwise 1. The daily Rush Hour is the only timed mode: 3 stars there also need the clear inside the par time.
- Hard levels (every 5th that is not a 10th) and Super Hard levels (every 10th) pay double star coins and wear a badge.
- After 2 failed attempts at the same level, the next try is a quieter solvable variant: fewer colours or one more bay. The game does not announce it.

## Scoring

- A departure pays a fare. Departures in a row, with no new combi entering a bay between them, raise a combo from x2 through x5. Parking a new combi resets the combo.
- The hooter rises with the combo. The gaartjie may shout Sharp, Yebo, Hau, or Lekker.
- Fare coins also come from stars. They buy cosmetics only.

## What never gates a level

- Rank stages: dirt lot, shelter, food stall, mural wall, sound system, solar lights, roof. Each one shows on the title diorama and the rank screen.
- Regions, in order, from the level number: Durban, Joburg, Cape Town, Gqeberha, Bloemfontein. Each shifts the ground and sky and adds one landmark. Names only, no brands.
- Liveries and horn sounds.
- Daily Rush Hour: one seeded puzzle per local date, with a streak and a share grid.
- Three daily missions. Rewards are coins and booster tokens.
- Weekend Month-End Rush: a 10-level ladder with a livery at the end. It is open on Saturday and Sunday.
- Boosters (extra bay, undo, shuffle) come from play, missions, and an optional ad. Ads never sell progress.

## Levels

- There are 150 levels. Level N is the same puzzle for everyone.
- The difficulty repeats every 10 levels: easy, easy, medium, medium, hard, easy, easy, medium, medium, super hard.
- A new mechanic is taught with one ghost-hand screen, then mixed in later. Rain changes the look only.
- A target clear is 30 to 90 seconds. The solver must win every level, and the stored par is that fewest tap count.
