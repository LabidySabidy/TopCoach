## ADDED Requirements

### Requirement: Trainer can schedule the next session via Google Calendar
The system SHALL allow the trainer to select a date and time for the next session, then create a Google Calendar event with the client as an attendee (Google sends the invite email automatically).

#### Scenario: Calendar event is created
- **WHEN** the trainer submits a date and time in Step 1 of the post-session flow
- **THEN** a Google Calendar event is created with summary "Training Session — [Client Name]", the trainer-selected start time, 1-hour duration, and the client's email as an attendee; the event ID is stored on the session record

#### Scenario: Calendar invite fails gracefully
- **WHEN** the Google Calendar API call fails (e.g. expired OAuth token)
- **THEN** the UI shows a clear error message ("Calendar invite failed — send manually") with the session details; the flow does not crash and the trainer can still proceed to the next step

#### Scenario: Trainer skips scheduling
- **WHEN** the trainer taps "Skip" on Step 1
- **THEN** no calendar event is created and the flow advances to Step 2
