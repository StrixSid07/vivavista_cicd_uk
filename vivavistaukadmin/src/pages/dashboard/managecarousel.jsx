import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Card,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Alert,
} from "@material-tailwind/react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import axios from "@/utils/axiosInstance";

export function ManageCarousel() {
  const [carousels, setCarousels] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCarousel, setCurrentCarousel] = useState(null);
  const [formData, setFormData] = useState({ images: [] });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  useEffect(() => {
    fetchCarousels();
  }, []);

  useEffect(() => {
    if (alert.message) {
      const timeout = setTimeout(() => {
        setAlert({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  const fetchCarousels = async () => {
    try {
      const response = await axios.get("/carousel");
      setCarousels(response.data);
    } catch (error) {
      console.error("Error fetching carousels:", error);
      setAlert({ message: "Error fetching carousels", type: "red" });
    }
  };

  const handleOpenDialog = (carousel = null) => {
    if (buttonDisabled) return;
    
    setButtonDisabled(true);
    setTimeout(() => setButtonDisabled(false), 500); // Prevent double-clicks for 500ms
    
    setCurrentCarousel(carousel);
    setFormData(carousel ? { images: carousel.images } : { images: [] });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCarousel(null);
    setIsSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images.length === 0) return;
    
    // Prevent duplicate submissions
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setLoading(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append("images", formData.images[0]); // Only one image

    try {
      if (currentCarousel) {
        await axios.put(`/carousel/${currentCarousel._id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setAlert({ message: "Carousel updated successfully!", type: "green" });
      } else {
        await axios.post("/carousel", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setAlert({ message: "Carousel added successfully!", type: "green" });
      }
      fetchCarousels();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving carousel:", error);
      setAlert({ message: "Error saving carousel", type: "red" });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (id) => {
    if (buttonDisabled) return;
    
    setButtonDisabled(true);
    setTimeout(() => setButtonDisabled(false), 500); // Prevent double-clicks for 500ms
    
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (deleteInProgress) return;
    
    try {
      setDeleteInProgress(true);
      await axios.delete(`/carousel/${deleteId}`);
      setAlert({ message: "Carousel deleted successfully!", type: "green" });
      fetchCarousels();
    } catch (error) {
      console.error("Error deleting carousel:", error);
      setAlert({ message: "Error deleting carousel", type: "red" });
    } finally {
      setOpenDeleteDialog(false);
      setDeleteInProgress(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden px-4 py-6">
      {alert.message && (
        <Alert
          color={alert.type}
          onClose={() => setAlert({ message: "", type: "" })}
          className="mb-4"
        >
          {alert.message}
        </Alert>
      )}

      <div className="mb-4 flex justify-end">
        <Button onClick={() => handleOpenDialog()} color="blue" disabled={buttonDisabled}>
          Add Carousel
        </Button>
      </div>

      <Card className="h-[calc(100vh-150px)] overflow-y-auto rounded-xl p-4 shadow-lg">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {carousels.map((carousel) => (
            <Card
              key={carousel._id}
              className="group w-full transform p-4 shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-50 hover:shadow-lg"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap justify-start gap-4">
                  {carousel.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Carousel Image ${index + 1}`}
                      className="h-48 w-96 rounded-md object-cover shadow-md transition-all duration-500 ease-in-out"
                    />
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <Button
                    variant="text"
                    color="green"
                    onClick={() => handleOpenDialog(carousel)}
                    className="p-2"
                    disabled={buttonDisabled}
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="text"
                    color="red"
                    onClick={() => confirmDelete(carousel._id)}
                    className="p-2"
                    disabled={buttonDisabled}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Dialog open={openDialog} handler={handleCloseDialog} size="md">
        <DialogHeader className="flex items-center justify-between">
          <Typography variant="h5" className="font-bold text-gray-800">
            {currentCarousel ? "Edit Carousel" : "Add Carousel"}
          </Typography>
        </DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="file"
              accept="image/*"
              multiple={false}
              onChange={
                (e) => setFormData({ images: [e.target.files[0]] }) // store single image in array
              }
              required
              disabled={isSubmitting}
            />
          </form>
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleCloseDialog} color="red" variant="text" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="green" disabled={loading || isSubmitting}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={openDeleteDialog} handler={() => setOpenDeleteDialog(false)}>
        <DialogHeader>Confirm Delete</DialogHeader>
        <DialogBody>Are you sure you want to delete this carousel?</DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={() => setOpenDeleteDialog(false)}
            className="mr-1"
            disabled={deleteInProgress}
          >
            Cancel
          </Button>
          <Button 
            variant="gradient" 
            color="red" 
            onClick={() => handleDelete(deleteId)}
            disabled={deleteInProgress}
          >
            {deleteInProgress ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default ManageCarousel;
