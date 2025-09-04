import React, { useState } from 'react';
import styles from './register.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Worker Registered:', formData);
    setSuccess(true);
    setFormData({ name: '', email: '', role: '' });
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className={`${styles.container} ${styles.mt4}`}>
      <h2 className={styles.registerTitle}>Register Worker</h2>
      {success && <div className={`${styles.alert} ${styles.alertSuccess}`}>Worker registered successfully!</div>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="formName">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.formControl}
            id="formName"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="formEmail">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.formControl}
            id="formEmail"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="formRole">Role</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className={styles.formControl}
            id="formRole"
          />
        </div>
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;