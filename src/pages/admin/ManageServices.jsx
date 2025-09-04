import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./admin-components.module.css";

function ManageServices() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({ name: "", icon: "", image: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load services
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    setIsLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/services")
      .then((res) => {
        setServices(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching services:", err);
        setIsLoading(false);
      });
  };

  // Handle form input
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Add or Update Service
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("icon", formData.icon);
    if (formData.image) data.append("image", formData.image);

    try {
      if (editingService) {
        await axios.post(
          `http://127.0.0.1:8000/api/services/${editingService.id}?_method=PUT`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axios.post("http://127.0.0.1:8000/api/services", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      fetchServices();
      setFormData({ name: "", icon: "", image: null });
      setIsModalOpen(false);
      setEditingService(null);
    } catch (err) {
      console.error("Error saving service:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit Service
  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({ name: service.name, icon: service.icon, image: null });
    setIsModalOpen(true);
  };

  // Delete Service
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    setIsLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:8000/api/services/${id}`);
      setServices(services.filter((service) => service.id !== id));
    } catch (err) {
      console.error("Error deleting service:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.manageServices}>
      <div className={`d-flex justify-content-between align-items-center mb-4`}>
        <h2>Manage Services</h2>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={() => {
            setFormData({ name: "", icon: "", image: null });
            setEditingService(null);
            setIsModalOpen(true);
          }}
          disabled={isLoading}
        >
          Add New Service
        </button>
      </div>

      {/* Services Table */}
      <div className={styles.modernTableContainer}>
        {isLoading && services.length === 0 ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-4 text-muted">
            No services found in the system.
          </div>
        ) : (
          <div className="table-responsive">
            <table className={`table ${styles.modernTable}`}>
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Icon</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, i) => (
                  <tr key={service.id} className={styles.tableRow}>
                    <td>{i + 1}</td>
                    <td>{service.name}</td>
                    <td>
                      <i className={`bi ${service.icon}`}></i> {service.icon}
                    </td>
                    <td>
                      {service.image ? (
                        <img
                          src={`http://127.0.0.1:8000/storage/${service.image}`}
                          alt={service.name}
                          width="80"
                          className="rounded"
                        />
                      ) : (
                        "No image"
                      )}
                    </td>
                    <td>
                      <button
                        className={`${styles.btn} ${styles.btnSm} ${styles.btnWarning} me-2`}
                        onClick={() => handleEdit(service)}
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button
                        className={`${styles.btn} ${styles.btnSm} ${styles.btnDanger}`}
                        onClick={() => handleDelete(service.id)}
                        disabled={isLoading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>
              {editingService ? "Edit Service" : "Add New Service"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Service Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Bootstrap Icon Class</label>
                <input
                  type="text"
                  name="icon"
                  className="form-control"
                  value={formData.icon}
                  onChange={handleChange}
                />
                <small className="text-muted">Example: bi-wrench, bi-lightning-charge</small>
              </div>
              <div className="mb-3">
                <label className="form-label">Service Image</label>
                <input
                  type="file"
                  name="image"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : editingService ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageServices;