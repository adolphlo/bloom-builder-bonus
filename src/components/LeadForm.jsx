import { useState } from 'react'

const WEBHOOK_URL = import.meta.env.VITE_ZAPIER_WEBHOOK_URL

const EMPTY_FIELDS = {
  name: '',
  phone: '',
  email: '',
  desired_monthly_payment: '',
  preferred_area: '',
  timeline: '',
  currently_renting: '',
}

function validate(fields) {
  const errs = {}
  if (!fields.name.trim()) errs.name = 'Full name is required'
  if (!fields.phone.trim()) errs.phone = 'Phone number is required'
  if (!fields.email.trim()) {
    errs.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errs.email = 'Enter a valid email address'
  }
  if (!fields.desired_monthly_payment.trim()) errs.desired_monthly_payment = 'Desired monthly payment is required'
  if (!fields.preferred_area.trim()) errs.preferred_area = 'Preferred area is required'
  if (!fields.timeline) errs.timeline = 'Please select a timeline'
  if (!fields.currently_renting) errs.currently_renting = 'Please select an option'
  return errs
}

export default function LeadForm() {
  const [fields, setFields] = useState(EMPTY_FIELDS)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [submitError, setSubmitError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(fields)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setStatus('submitting')
    setSubmitError('')

    const payload = {
      ...fields,
      source: 'Bloom Builder QR',
      submitted_at: new Date().toISOString(),
    }

    try {
      // no-cors avoids the preflight OPTIONS request that Zapier Catch Hook doesn't handle.
      // The response is opaque so we can't check res.ok — if fetch doesn't throw, the
      // request reached Zapier. Zapier always returns 200 so this is safe.
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload),
      })
      setStatus('success')
    } catch {
      setSubmitError('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="success-screen">
        <div className="success-icon">✓</div>
        <h2>You&rsquo;re all set, {fields.name.split(' ')[0]}!</h2>
        <p>Bobby will be in touch shortly with matching homes and current builder incentives in your area.</p>
      </div>
    )
  }

  return (
    <>
      <h2>Tell me what you&rsquo;re looking for</h2>
      <p className="card-intro">I&rsquo;ll send you matching new homes, current incentives, and options based on your monthly payment goal.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            value={fields.name}
            onChange={handleChange}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="field">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(210) 000-0000"
            value={fields.phone}
            onChange={handleChange}
          />
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@email.com"
            value={fields.email}
            onChange={handleChange}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="field">
          <label htmlFor="desired_monthly_payment">Desired Monthly Payment</label>
          <input
            id="desired_monthly_payment"
            name="desired_monthly_payment"
            type="text"
            placeholder="Example: $2,000/month"
            value={fields.desired_monthly_payment}
            onChange={handleChange}
          />
          {errors.desired_monthly_payment && (
            <span className="field-error">{errors.desired_monthly_payment}</span>
          )}
        </div>

        <div className="field">
          <label htmlFor="preferred_area">Preferred Area</label>
          <input
            id="preferred_area"
            name="preferred_area"
            type="text"
            placeholder="Example: Stone Oak, New Braunfels, Cibolo"
            value={fields.preferred_area}
            onChange={handleChange}
          />
          {errors.preferred_area && <span className="field-error">{errors.preferred_area}</span>}
        </div>

        <div className="field">
          <label htmlFor="timeline">Timeline to Move</label>
          <select
            id="timeline"
            name="timeline"
            value={fields.timeline}
            onChange={handleChange}
          >
            <option value="">Select a timeline…</option>
            <option value="ASAP">ASAP</option>
            <option value="1-3 months">1–3 months</option>
            <option value="3-6 months">3–6 months</option>
            <option value="6-12 months">6–12 months</option>
            <option value="Just exploring">Just exploring</option>
          </select>
          {errors.timeline && <span className="field-error">{errors.timeline}</span>}
        </div>

        <div className="field">
          <label htmlFor="currently_renting">Currently Renting?</label>
          <select
            id="currently_renting"
            name="currently_renting"
            value={fields.currently_renting}
            onChange={handleChange}
          >
            <option value="">Select…</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {errors.currently_renting && <span className="field-error">{errors.currently_renting}</span>}
        </div>

        {submitError && <div className="submit-error">{submitError}</div>}

        <button type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Submitting…' : 'Show Me Available Homes'}
        </button>
        <p className="fine">Takes less than 60 seconds. No obligation.</p>
      </form>
    </>
  )
}
