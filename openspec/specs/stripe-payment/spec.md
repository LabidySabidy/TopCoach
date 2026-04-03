## ADDED Requirements

### Requirement: Trainer can generate and share a Stripe Payment Link
The system SHALL display the session price (from SESSION_PRICE env var), allow an optional tip amount, generate a Stripe Payment Link server-side, and display it as a tappable/copyable link with a "Send to email" button.

#### Scenario: Payment link is generated
- **WHEN** the trainer confirms on Step 2 of the post-session flow
- **THEN** a Stripe Payment Link is created server-side with a one-time inline price item for the session amount plus any entered tip; the link URL is stored on the session record and displayed as a large tappable link

#### Scenario: Tip is optional
- **WHEN** the trainer leaves the tip field empty and confirms
- **THEN** the payment link is generated for the base session price only (no tip)

#### Scenario: Send to email
- **WHEN** the trainer taps "Send to email"
- **THEN** the payment link is sent to the client's email address

#### Scenario: Trainer skips payment
- **WHEN** the trainer taps "Skip" on Step 2
- **THEN** no Stripe Payment Link is generated and the trainer is redirected to the client profile
