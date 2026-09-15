export function ContactStatus(){
  return process.env.CONTACT_ENABLED==='true'
    ? <aside className="proof-notice"><strong>What happens next</strong><p>Your inquiry is saved securely for Alool to review. Include a work email where the team can reach you. Do not submit passwords or sensitive personal records.</p></aside>
    : <aside className="proof-notice"><strong>Preview only — inquiries are not sent</strong><p>You can check your inquiry details below. Message delivery is not enabled, so Alool will not receive or respond to this preview form.</p></aside>
}
