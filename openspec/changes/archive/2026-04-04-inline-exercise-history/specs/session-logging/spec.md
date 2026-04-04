## MODIFIED Requirements

### Requirement: Last session reference is shown during logging
The system SHALL display each exercise's most recent completed performance inline on the exercise's logging card, directly above the input fields. The history SHALL be sourced per-exercise across all completed sessions for this client — not limited to the single most recent session.

#### Scenario: Inline history for a weighted exercise
- **WHEN** the trainer views a logging card for a weighted exercise that has been logged in a prior completed session
- **THEN** a label reading "Last: {sets} sets · {reps} reps · {weight} lbs" appears between the exercise name and the input fields, using the values from the most recent completed session containing that exercise

#### Scenario: Inline history for a bodyweight exercise
- **WHEN** the trainer views a logging card for a bodyweight exercise that has been logged in a prior completed session
- **THEN** a label reading "Last: {sets} sets · {reps} reps" appears between the exercise name and the input fields

#### Scenario: Inline history for a duration exercise
- **WHEN** the trainer views a logging card for a duration exercise that has been logged in a prior completed session
- **THEN** a label reading "Last: {min}m {sec}s" appears between the exercise name and the input fields

#### Scenario: No prior history for an exercise
- **WHEN** the trainer views a logging card for an exercise that has never been logged in a completed session for this client
- **THEN** a label reading "First time logging this exercise" appears between the exercise name and the input fields

#### Scenario: Exercise skipped in last session but logged in earlier session
- **WHEN** the trainer views a logging card for an exercise that was NOT in the most recent completed session but WAS logged in an earlier completed session
- **THEN** the inline history label SHALL still display the most recent values from the earlier session

## REMOVED Requirements

### Requirement: Collapsible last-session reference panel
**Reason**: Replaced by per-exercise inline history labels that show relevant data without extra taps
**Migration**: The collapsible panel UI and its `lastSession` prop are removed. Per-exercise history is now displayed inline on each exercise card via a new `exerciseHistory` prop.
