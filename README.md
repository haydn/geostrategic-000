# Geostrategic

Geostrategic is a massively multiplayer online real-time strategy sandbox game.

## Overview

The game is played on a massive 2D map that is divided into a grid of 10cm (1
decimetre) **squares**. Everyone plays in the same game over a long period of
time.

The world is occupied by **units** — some of these units are directly controlled
by the players (these are called "autonomous" units), whereas others are
resources, equipment or infrastructure that can be utilised by the autonomous
units to progress the game.

The game is played in a pseudo turn-based manner in which autonomous unit
continuously gain **action points** (irrespective of when players are online)
which are then used when the unit executes actions (see below). The action
points are gained at a rate of 2,000 per second and each action point equates to
1 millisecond of game time (time in the game passes at 2 times the speed of
real-world time). Action points are capped at 345,600,000 (the amount of action
points accumulate in a 2 day period) to prevent players accumulating many action
points and then executing a large number of actions in one turn.

The characteristics of a unit is defined by its **classification**. A single
classification can apply to multiple units. The classifications provides a unit
with a name, icon, size (measured in squares) and a flag indicating if
its autonomous.

A classification also defines what **actions** are available to units. Actions
are how players interact with the game. An action is always executed by one or
more autonomous units and consumes the actions points of those unit.

### Actions Types

The most basic type of action is a **move action**. This action allows a unit to
move north, east, south or west. If a unit contains other units (the contained
units are entirely within the bounds of the containing unit) then the contained
units will move with the unit. Units cannot move over the top of other units.

## Work In Progress

- Add more units to the seed script (car, bike, post office and fountain).
- Add ability for units to enter other units.
- Add "combined" movement — a human inside a car can drive the car.
- Add "Enable Realtime" to the migration/seed script.
- Mobile support.
- Polish the UI and sign-up flow.

## Roadmap

Features planned for this version of Geostrategic.

### Arrange Actions

Actions for arranging other units within or nearby this unit. This lets units
pick-up items, put down items or reorganise items they contain.

- Arrange actions will include a `range` property. A value of `-1` indicates
  units can only be arranged within the unit executing the action and a value of
  `0` or greater indicates the distance (measured in decimetres) from the edge
  the unit executing that action in which units can be arranged (including
  within).

- Units cannot arrange autonomous units.

### Create Action & Action Outputs

A "create" action is an action that produces new units.

- Add `"create"` value to the `action_type` type.

- Add action outputs table:

  ```sql
  CREATE TABLE
    action_outputs (
      id uuid NOT NULL DEFAULT gen_random_uuid (),
      action_id uuid NOT NULL,
      classification_id uuid NOT NULL,
      count integer NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (id),
      FOREIGN KEY (action_id) REFERENCES actions (id)
    );
  ```

### Action Inputs

Some actions might cost more than just time. Action inputs are units that will
be consumed when the action is executed.

```sql
CREATE TABLE
  action_inputs (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    action_id uuid NOT NULL,
    classification_id uuid NOT NULL,
    count integer NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    FOREIGN KEY (action_id) REFERENCES actions (id)
  );
```

### Action Requirements

Some actions might require the presence of specific units, but not consume them.

```sql
CREATE TYPE action_requirement_type AS ENUM(
  'contains_classification',
  'within_classification'
);

CREATE TABLE
  action_requirements (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    action_id uuid NOT NULL,
    classification_id uuid NOT NULL,
    type action_requirement_type NOT NULL,
    count integer NOT NULL CHECK (count > 0),
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    FOREIGN KEY (action_id) REFERENCES actions (id)
  );
```

### Research

- Add `"research"` to the `action_type` type.

- Add research types/tables:

  ```sql
  CREATE TYPE research_type AS ENUM('classification', 'action');

  CREATE TYPE research_status AS ENUM('draft', 'proposed', 'rejected', 'approved');

  CREATE TABLE
    research (
      id uuid NOT NULL DEFAULT gen_random_uuid (),
      type research_type NOT NULL,
      status research_status NOT NULL,
      classification_id uuid,
      action_id uuid,
      created_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (id),
      FOREIGN KEY (classification_id) REFERENCES classifications (id),
      FOREIGN KEY (action_id) REFERENCES actions (id),
      CHECK (
        (
          type = 'classification'
          AND classification_id IS NOT NULL
        )
        OR (
          type = 'action'
          AND action_id IS NOT NULL
        )
      )
    );

  CREATE TABLE
    research_review (
      id uuid NOT NULL DEFAULT gen_random_uuid (),
      research_id uuid NOT NULL,
      owner_id uuid NOT NULL,
      approve boolean,
      created_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (id),
      FOREIGN KEY (research_id) REFERENCES research (id),
      FOREIGN KEY (owner_id) REFERENCES auth.users (id)
    );
  ```

### Peer Reviewed Research & Knowledge Points

Research should take more than just a majority vote to be approved. Units earn
knowledge when they participate in reviewing research. These points are required
to submit new research.

### Rectangular Shaped Units

Instead of allowing only square shaped units, allow rectangular shaped units.
This also means that units can be rotated and face in a direction (move "forward" instead of north/east/south/west).

## Ideas

Ideas for the future of Geostrategic.

- Terrain such as sea, road, river, tree, sand, cliff etc. This would affect
  movement and restrict where units can be placed.
- Resources like coal, iron ore and natural gas that can be obtained from the terrain.
- Classification tags. These are used as an abstraction for defining action
  requirements and constraints for unit containment.
- Unit stacking. Some classifications (e.g. coins or paper) should allow the
  units to be stacked on top of each other.
