import React from 'react'
import plumber from '../../assets/user/plumber.jpg'
import electrician from '../../assets/user/electrician.jpg'
import carpenter from '../../assets/user/carpenter.jpg'
import housekeeper from '../../assets/user/housekeeper.jpg'
import gardencleaning from '../../assets/user/gardencleaning.jpg'

const services = [
  { name: "Plumber", icon: "bi-wrench", image: plumber },
  { name: "Electrician", icon: "bi-lightning-charge",image: electrician },
  { name: "Carpenter", icon: "bi-hammer",image: carpenter},
  { name: "Housekeeping", icon: "bi-bucket",image: housekeeper },
  { name: "Garden Cleaner", icon: "bi-flower1",image: gardencleaning }
]

const Services = () => (
  <section className="py-5 bg-light" id="services">
    <div className="container">
      <h2 className="text-center mb-5" data-aos="zoom-in">Our Services</h2>
      <div className="row g-4">
        {services.map((s, i) => (
          <div className="col-md-4" key={i} data-aos="fade-up" data-aos-delay={i * 100}>
            <div className="card h-100 text-center shadow">
              {s.image ? (
                <img src={s.image} alt={s.name} className="card-img-top" />
              ) : (
                <div className="card-body">
                  <i className={`bi ${s.icon} display-3 text-primary`}></i>
                </div>
              )}
              <div className="card-body">
                <h5 className="card-title">{s.name}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default Services
