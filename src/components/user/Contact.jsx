import React from 'react'

const Contact = () => (
  <section className="py-5" id="contact">
    <div className="container">
      <h2 className="text-center mb-5" data-aos="fade-right">Contact Us</h2>
      <form className="mx-auto" style={{ maxWidth: '600px' }}>
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="Your Name" required />
        </div>
        <div className="mb-3">
          <input type="email" className="form-control" placeholder="Email Address" required />
        </div>
        <div className="mb-3">
          <textarea className="form-control" rows="4" placeholder="Your Message" required></textarea>
        </div>
        <button className="btn btn-primary w-100">Send Message</button>
      </form>
    </div>
  </section>
)

export default Contact
