// src/pages/worker/WorkerWorks.jsx
import React, { useEffect, useState } from "react";
import {
  getWorkerServiceHistory,
  startService,
  completeService,
} from "../../services/workerJob";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Chip,
} from "@mui/material";

const WorkerWorks = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const workerId = JSON.parse(localStorage.getItem("user"))?.worker?.id;

  const fetchServices = async () => {
    setLoading(true);
    const res = await getWorkerServiceHistory(workerId);
    setServices(res.data);
    setLoading(false);
  };

  useEffect(() => {
    if (workerId) fetchServices();
  }, [workerId]);

  const handleStart = async (id) => {
    await startService(id);
    fetchServices();
  };

  const handleComplete = async (id) => {
    await completeService(id);
    fetchServices();
  };

  if (loading) return <CircularProgress />;

  return (
    <div>
      <Typography variant="h5" className="mb-4 font-bold text-gray-700">
        My Jobs 💼
      </Typography>
      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} md={6} key={service.serviceId}>
            <Card className="shadow-md border">
              <CardContent>
                <Typography variant="h6">
                  {service.serviceCategory?.categoryName || "Unnamed Service"}
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  Duration: {service.duration} hrs
                </Typography>
                <Typography variant="body2">
                  Total: Rs.{service.totalAmount}
                </Typography>
                <Chip
                  label={service.status}
                  color={
                    service.status === "Finished"
                      ? "success"
                      : service.status === "Ongoing"
                      ? "warning"
                      : "default"
                  }
                  className="mt-2"
                />

                <div className="mt-3 flex gap-2">
                  {service.status === "Pending" && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleStart(service.serviceId)}
                    >
                      Start
                    </Button>
                  )}
                  {service.status === "Ongoing" && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleComplete(service.serviceId)}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default WorkerWorks;
