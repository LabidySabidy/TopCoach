## ADDED Requirements

### Requirement: Trainer can complete a session
The system SHALL mark a session as `completed` and navigate to the post-session flow when the trainer taps "Complete Session" on the logging screen.

#### Scenario: Session is completed and trainer enters post-session flow
- **WHEN** the trainer taps "Complete Session" on the logging screen
- **THEN** the session status is updated to `completed` and the trainer is redirected to `/sessions/[id]/complete`

### Requirement: Post-session flow guides trainer through two sequential prompts
The system SHALL present two optional prompts in sequence — schedule next session, then send payment — as a step-by-step Client Component using local state. Each step has a "Skip" option.

#### Scenario: Trainer steps through schedule and payment prompts
- **WHEN** the trainer lands on `/sessions/[id]/complete`
- **THEN** Step 1 (schedule next session) is shown first; after confirming or skipping, Step 2 (payment) is shown; after confirming or skipping, the trainer is redirected to the client profile

#### Scenario: Trainer skips a prompt
- **WHEN** the trainer taps "Skip" on either Step 1 or Step 2
- **THEN** that step is bypassed and the flow advances to the next step (or redirects to client profile if it was the last step)
