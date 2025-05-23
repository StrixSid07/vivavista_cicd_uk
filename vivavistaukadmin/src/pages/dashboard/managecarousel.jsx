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
    setCurrentCarousel(carousel);
    setFormData(carousel ? { images: carousel.images } : { images: [] });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCarousel(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images.length === 0) return;

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
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/carousel/${deleteId}`);
      setAlert({ message: "Carousel deleted successfully!", type: "green" });
      fetchCarousels();
    } catch (error) {
      console.error("Error deleting carousel:", error);
      setAlert({ message: "Error deleting carousel", type: "red" });
    } finally {
      setOpenDeleteDialog(false);
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
        <Button onClick={() => handleOpenDialog()} color="blue">
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
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="text"
                    color="red"
                    onClick={() => confirmDelete(carousel._id)}
                    className="p-2"
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
            {/*              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({
                    images: Array.from(e.target.files).slice(0, 1),
                  })
                }
                required
              />
  */}
            <input
              type="file"
              accept="image/*"
              multiple={false}
              onChange={
                (e) => setFormData({ images: [e.target.files[0]] }) // store single image in array
              }
              required
            />
          </form>
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleCloseDialog} color="red" variant="text">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="green" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        handler={() => setOpenDeleteDialog(false)}
      >
        <DialogHeader>Confirm Deletion</DialogHeader>
        <DialogBody>
          <Typography>
            Are you sure you want to delete this carousel?
          </Typography>
        </DialogBody>
        <DialogFooter className="flex items-center justify-end gap-2">
          <Button color="red" onClick={handleDelete}>
            Delete
          </Button>
          <Button color="gray" onClick={() => setOpenDeleteDialog(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default ManageCarousel;
