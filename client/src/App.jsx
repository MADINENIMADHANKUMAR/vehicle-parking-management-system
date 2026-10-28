
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/vehicles";
const PARKING_API = "http://localhost:5000/api/parking/calculate";

const initialForm = {
  vehicleId: "",
  registrationNumber: "",
  ownerName: "",
  vehicleType: "Bike"
};

const vehicleTypes = ["Bike", "Car", "Truck", "Bus", "Other"];

const parkingRates = [
  { type: "Bike", rate: 10 },
  { type: "Car", rate: 20 },
  { type: "Truck", rate: 40 },
  { type: "Bus", rate: 50 },
  { type: "Other", rate: 15 }
];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [formData, setFormData] = useState(initialForm);
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [hours, setHours] = useState("1");
  const [vehicleType, setVehicleType] = useState("Car");
  const [charge, setCharge] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const menuItems = [
    "Dashboard",
    "Vehicles",
    "Register Vehicle",
    "Parking Charges"
  ];

  async function fetchVehicles() {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(API_URL);
      setVehicles(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load vehicles."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVehicles();
  }, []);

  function navigateTo(page) {
    setActivePage(page);
    setMessage("");
    setError("");

    if (page === "Dashboard" || page === "Vehicles") {
      fetchVehicles();
    }

    if (page === "Register Vehicle") {
      setFormData(initialForm);
      setEditingId(null);
    }

    if (page === "Parking Charges") {
      setCharge(null);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      if (editingId) {
        const response = await axios.put(
          `${API_URL}/${editingId}`,
          formData
        );
        setMessage(response.data.message);
      } else {
        const response = await axios.post(API_URL, formData);
        setMessage(response.data.message);
      }

      setFormData(initialForm);
      setEditingId(null);
      await fetchVehicles();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save vehicle details."
      );
    }
  }

  function editVehicle(vehicle) {
    setFormData({
      vehicleId: vehicle.vehicleId,
      registrationNumber: vehicle.registrationNumber,
      ownerName: vehicle.ownerName,
      vehicleType: vehicle.vehicleType
    });

    setEditingId(vehicle._id);
    setMessage("");
    setError("");
    setActivePage("Register Vehicle");
  }

  async function deleteVehicle(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      setMessage(response.data.message);
      await fetchVehicles();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete vehicle."
      );
    }
  }

  async function calculateCharge(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setCharge(null);

    try {
      const response = await axios.post(PARKING_API, {
        vehicleType,
        hours: Number(hours)
      });

      setCharge(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to calculate parking charges."
      );
    }
  }

  const filteredVehicles = vehicles.filter((vehicle) => {
    const search = searchTerm.trim().toLowerCase();

    return (
      vehicle.vehicleId.toLowerCase().includes(search) ||
      vehicle.registrationNumber.toLowerCase().includes(search) ||
      vehicle.ownerName.toLowerCase().includes(search) ||
      vehicle.vehicleType.toLowerCase().includes(search)
    );
  });

  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div className="row min-vh-100">
        {/* Sidebar */}
        <aside className="col-12 col-md-3 col-lg-2 bg-dark text-white p-3">
          <div className="border-bottom border-secondary pb-3 mb-3">
            <h5 className="fw-bold mb-1">Parking System</h5>
            <small className="text-white-50">Management Portal</small>
          </div>

          <nav className="nav nav-pills flex-column gap-2">
            {menuItems.map((item) => (
              <button
                key={item}
                type="button"
                className={`nav-link text-start ${
                  activePage === item ? "active" : "text-white"
                }`}
                onClick={() => navigateTo(item)}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="col-12 col-md-9 col-lg-10 p-3 p-lg-4">
          <header className="mb-4">
            <h2 className="fw-bold mb-1">{activePage}</h2>
            <p className="text-secondary mb-0">
              Vehicle Parking Management System
            </p>
          </header>

          {/* Success Message */}
          {message && (
            <div className="alert alert-success alert-dismissible fade show">
              {message}
              <button
                type="button"
                className="btn-close"
                onClick={() => setMessage("")}
                aria-label="Close"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show">
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError("")}
                aria-label="Close"
              />
            </div>
          )}

          {/* Dashboard */}
          {activePage === "Dashboard" && (
            <>
              <div className="bg-primary text-white rounded-3 p-4 p-lg-5 mb-4">
                <span className="small fw-semibold">
                  PARKING OVERVIEW
                </span>
                <h2 className="fw-bold mt-2">
                  Vehicle Parking Management
                </h2>
                <p className="mb-0">
                  Register vehicles, manage records and calculate
                  parking charges easily.
                </p>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body p-4">
                      <h6 className="text-secondary">
                        Registered Vehicles
                      </h6>

                      <h2 className="display-6 fw-bold">
                        {vehicles.length}
                      </h2>

                      <p className="text-secondary">
                        Total vehicles stored in the database.
                      </p>

                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => navigateTo("Vehicles")}
                      >
                        View Vehicles
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body p-4">
                      <h6 className="text-secondary">
                        Parking Charges
                      </h6>

                      <h2 className="display-6 fw-bold">₹</h2>

                      <p className="text-secondary">
                        Calculate parking fees based on vehicle type
                        and parking duration.
                      </p>

                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => navigateTo("Parking Charges")}
                      >
                        Calculate Charge
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Register and Update Vehicle */}
          {activePage === "Register Vehicle" && (
            <div className="card shadow-sm">
              <div className="card-body p-3 p-lg-4">
                <h5 className="fw-bold">
                  {editingId ? "Update Vehicle" : "Register a New Vehicle"}
                </h5>

                <p className="text-secondary">
                  Enter the required vehicle details below.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label htmlFor="vehicleId" className="form-label">
                        Vehicle ID
                      </label>
                      <input
                        id="vehicleId"
                        name="vehicleId"
                        className="form-control"
                        value={formData.vehicleId}
                        onChange={handleChange}
                        placeholder="e.g. V001"
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label
                        htmlFor="registrationNumber"
                        className="form-label"
                      >
                        Registration Number
                      </label>
                      <input
                        id="registrationNumber"
                        name="registrationNumber"
                        className="form-control"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        placeholder="e.g. AP02AB1234"
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="ownerName" className="form-label">
                        Owner Name
                      </label>
                      <input
                        id="ownerName"
                        name="ownerName"
                        className="form-control"
                        value={formData.ownerName}
                        onChange={handleChange}
                        placeholder="Enter owner name"
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="vehicleType" className="form-label">
                        Vehicle Type
                      </label>
                      <select
                        id="vehicleType"
                        name="vehicleType"
                        className="form-select"
                        value={formData.vehicleType}
                        onChange={handleChange}
                      >
                        {vehicleTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="d-flex flex-wrap gap-2 mt-4">
                    <button type="submit" className="btn btn-primary">
                      {editingId ? "Save Changes" : "Register Vehicle"}
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setFormData(initialForm);
                        setEditingId(null);
                        setMessage("");
                        setError("");
                      }}
                    >
                      Clear
                    </button>

                    {editingId && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => navigateTo("Vehicles")}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Manage Vehicles */}
          {activePage === "Vehicles" && (
            <div className="card shadow-sm">
              <div className="card-body p-3 p-lg-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                  <div>
                    <h5 className="fw-bold mb-1">Manage Vehicles</h5>
                    <p className="text-secondary mb-0">
                      Search, update and delete registered vehicles.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => navigateTo("Register Vehicle")}
                  >
                    + Add Vehicle
                  </button>
                </div>

                <div className="input-group mb-4">
                  <span className="input-group-text">Search</span>
                  <input
                    className="form-control"
                    type="search"
                    placeholder="Vehicle ID, registration number, owner or type"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setSearchTerm("")}
                    >
                      Clear
                    </button>
                  )}
                </div>

                {loading ? (
                  <div className="text-center p-4">
                    <div
                      className="spinner-border text-primary"
                      role="status"
                    />
                    <p className="mt-2 mb-0">Loading vehicles...</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-dark">
                        <tr>
                          <th>Vehicle ID</th>
                          <th>Registration No.</th>
                          <th>Owner Name</th>
                          <th>Type</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredVehicles.map((vehicle) => (
                          <tr key={vehicle._id}>
                            <td className="fw-semibold">
                              {vehicle.vehicleId}
                            </td>
                            <td>{vehicle.registrationNumber}</td>
                            <td>{vehicle.ownerName}</td>
                            <td>
                              <span className="badge bg-secondary">
                                {vehicle.vehicleType}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex justify-content-center flex-wrap gap-2">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => editVehicle(vehicle)}
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => deleteVehicle(vehicle._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}

                        {filteredVehicles.length === 0 && (
                          <tr>
                            <td
                              colSpan="5"
                              className="text-center text-secondary py-5"
                            >
                              {searchTerm
                                ? "No matching vehicles found."
                                : "No vehicles registered yet."}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
                  <small className="text-secondary">
                    Showing {filteredVehicles.length} of {vehicles.length} vehicles
                  </small>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={fetchVehicles}
                  >
                    Refresh List
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Parking Charges */}
          {activePage === "Parking Charges" && (
            <>
              {/* Hourly Rates */}
              <div className="card shadow-sm mb-4">
                <div className="card-body p-3 p-lg-4">
                  <h5 className="fw-bold">Parking Rates Per Hour</h5>
                  <p className="text-secondary">
                    The hourly rate depends on the vehicle type.
                  </p>

                  <div className="table-responsive">
                    <table className="table table-bordered table-striped mb-0">
                      <thead className="table-dark">
                        <tr>
                          <th>Vehicle Type</th>
                          <th>Charge Per Hour</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parkingRates.map((item) => (
                          <tr key={item.type}>
                            <td>{item.type}</td>
                            <td>₹{item.rate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Charge Calculator */}
              <div className="card shadow-sm">
                <div className="card-body p-3 p-lg-4">
                  <h5 className="fw-bold">Parking Charge Calculator</h5>
                  <p className="text-secondary">
                    Select a vehicle type and enter the parking duration.
                  </p>

                  <form onSubmit={calculateCharge}>
                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <label htmlFor="chargeType" className="form-label">
                          Vehicle Type
                        </label>
                        <select
                          id="chargeType"
                          className="form-select"
                          value={vehicleType}
                          onChange={(event) =>
                            setVehicleType(event.target.value)
                          }
                        >
                          {vehicleTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-12 col-md-6">
                        <label htmlFor="hours" className="form-label">
                          Parking Hours
                        </label>
                        <input
                          id="hours"
                          className="form-control"
                          type="number"
                          min="0.1"
                          step="any"
                          value={hours}
                          onChange={(event) => setHours(event.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <button
                      className="btn btn-primary mt-3"
                      type="submit"
                    >
                      Calculate Charge
                    </button>
                  </form>

                  {charge && (
                    <div className="alert alert-success mt-4 mb-0">
                      <h5 className="fw-bold">
                        Total Parking Charge: ₹{charge.totalCharge}
                      </h5>
                      <p className="mb-0">
                        {charge.vehicleType} × {charge.hours} hour(s) × ₹
                        {charge.ratePerHour}/hour
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
