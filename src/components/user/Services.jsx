import React from "react";
import styles from "./Services.module.css";
import { Hammer, Building2, Ruler } from "lucide-react";


const ServicesSection = () => {
  const services = [
    {
      id: 1,
      title: "Electricitan Services",
      description:
        "Fixora provides expert electricitan solutions, ensuring your projects are completed efficiently and to the highest standards.",
      icon: <Hammer size={40} />,
      className: styles.construction,
    },
    {
      id: 2,
      title: "Plumbing Services",
      description:
        "With Fixora, manage and optimize your plumbing projects seamlessly, from planning to execution.",
      icon: <Building2 size={40} />,
      className: styles.infrastructure,
    },
    {
      id: 3,
      title: "Carpentry Services",
      description:
        "Fixora delivers innovative carpentry services, blending creativity with functionality for outstanding results.",
      icon: <Ruler size={40} />,
      className: styles.architecture,
    },
  ];

  return (
    <section className={styles.section}>
      {/* Section Heading */}
      <div className={styles.heading}>
        <p className={styles.subtitle}>What We Do</p>
        <h2 className={styles.title}>Our Fixora Services</h2>
      </div>
      

      <div className={styles.container}>
        {/* Left Side - Image */}
        <div className={styles.imageWrapper}>
          <img src="src/assets/Home/ElectricianGirl.png" alt="Fixora Worker" className={styles.image} />
        </div>

        {/* Right Side - Services */}
        <div className={styles.servicesList}>
          {services.map((service) => (
            <div key={service.id} className={`${styles.card} ${service.className}`}>
              <div className={styles.icon}>{service.icon}</div>
              <div className={styles.content}>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardDesc}>{service.description}</p>
                <button className={styles.btn}>Learn More</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
