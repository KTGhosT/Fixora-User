import React from 'react';
import styles from './Happyclients.module.css';

const testimonials = [
  {
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'VENUJAN',
    position: 'PRODUCT MANAGER',
    text: 'Fixora has completely streamlined our workforce management. The app is intuitive and has saved us countless hours every week.',
    highlighted: false,
  },
  {
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    name: 'SABEESAN',
    position: 'FULL STACK DEVELOPER',
    text: 'With Fixora, scheduling and tracking our team’s work has never been easier. Highly recommended for any business looking to boost productivity!',
    highlighted: true,
  },
  {
    image: 'https://randomuser.me/api/portraits/men/67.jpg',
    name: 'KAVISHAN',
    position: 'UI/UX DESIGNER',
    text: 'The support from the Fixora team is outstanding. The app’s features are exactly what we needed to manage our projects efficiently.',
    highlighted: false,
  },
];

function HappyClients() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Happy Clients</h1>
      <div className={styles.slider}>
        <div className={styles.slideTrack}>
          {testimonials.map((t, i) => (
            <Card key={`first-${i}`} {...t} />
          ))}
          {testimonials.map((t, i) => (
            <Card key={`duplicate-${i}`} {...t} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ image, name, position, text, highlighted }) {
  return (
    <div className={`${styles.card} ${highlighted ? styles.highlighted : ''}`}>
      <img src={image} alt={name} className={styles.profileImage} />
      <h3 className={styles.name}>{name}</h3>
      <div className={styles.quoteIcon}>“</div>
      <p className={styles.position}>{position}</p>
      <p className={styles.text}>{text}</p>
    </div>
  );
}

export default HappyClients;