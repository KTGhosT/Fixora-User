import React, { useEffect, useState } from "react";
import axios from "axios";

function ManageServices() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({ name: "", icon: "", image: null });
  const [editingService, setEditingService] = useState(null);

  // Load services
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    axios
      .get("http://127.0.0.1:8000/api/services")
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Error fetching services:", err));
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
      setEditingService(null);
    } catch (err) {
      console.error("Error saving service:", err);
    }
  };

  // Edit Service
  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({ name: service.name, icon: service.icon, image: null });
  };

  // Delete Service
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      await axios.delete(`http://127.0.0.1:8000/api/services/${id}`);
      fetchServices();
    }
  };

  return (
    <div>
      <h2 className="mb-4">Manage Services</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-4">
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

        <button type="submit" className="btn btn-primary">
          {editingService ? "Update Service" : "Add Service"}
        </button>
        {editingService && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setEditingService(null);
              setFormData({ name: "", icon: "", image: null });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Services Table */}
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Icon</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s, i) => (
            <tr key={s.id}>
              <td>{i + 1}</td>
              <td>{s.name}</td>
              <td>
                <i className={`bi ${s.icon}`}></i> {s.icon}
              </td>
              <td>
                {s.image ? (
                  <img
                    src={`http://127.0.0.1:8000/storage/${s.image}`}
                    alt={s.name}
                    width="80"
                  />
                ) : (
                  "No image"
                )}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(s)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(s.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageServices;
