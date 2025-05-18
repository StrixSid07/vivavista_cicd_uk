import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Card,
  Checkbox,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Alert,
  Tooltip,
} from "@material-tailwind/react";
import {
  PencilSquareIcon,
  TrashIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import axios from "@/utils/axiosInstance";

export function ManageDestination() {
  const [destinations, setDestinations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDestination, setCurrentDestination] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [destinationName, setDestinationName] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    isPopular: false,
    imageFile: null,
    imagePreview: "",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await axios.get("/destinations/destinations");
      setDestinations(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      setAlert({ message: "Error fetching destinations", type: "red" });
    }
  };

  const handleImageClick = (imageUrl) => {
    setPreviewImage(imageUrl);
    setOpenImageDialog(true);
  };

  const handleCloseImageDialog = () => {
    setPreviewImage(null);
    setOpenImageDialog(false);
  };
  const handleDeleteImage = async () => {
    if (!currentDestination) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image?",
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/destinations/image/${currentDestination._id}`);
      setFormData({
        ...formData,
        imagePreview: "",
        imageFile: null,
      });
      setAlert({ message: "Image deleted successfully!", type: "green" });
    } catch (error) {
      console.error("Error deleting image:", error);
      setAlert({ message: "Failed to delete image", type: "red" });
    }
  };

  const handleOpenDialog = (destination = null) => {
    setCurrentDestination(destination);
    setFormData(
      destination
        ? {
            name: destination.name,
            isPopular: destination.isPopular,
            imageFile: null,
            imagePreview: destination.image,
          }
        : {
            name: "",
            isPopular: false,
            imageFile: null,
            imagePreview: "",
          },
    );

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentDestination(null);
    setAlert({ message: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("isPopular", formData.isPopular);
      if (formData.imageFile) {
        data.append("images", formData.imageFile);
      }

      if (currentDestination) {
        await axios.put(`/destinations/${currentDestination._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setAlert({
          message: "Destination updated successfully!",
          type: "green",
        });
      } else {
        await axios.post("/destinations", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setAlert({ message: "Destination added successfully!", type: "green" });
      }

      fetchDestinations();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving destination:", error);
      setAlert({ message: "Error saving destination", type: "red" });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id, name) => {
    setDeleteId(id);
    setDestinationName(name);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/destinations/${id}`);
      setAlert({
        message: "Destination deleted successfully!",
        type: "green",
      });
      fetchDestinations();
    } catch (error) {
      console.error("Error deleting destination:", error);
      setAlert({ message: "Error deleting destination", type: "red" });
    } finally {
      setOpenDeleteDialog(false);
      setDeleteId(null);
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
          Add Destination
        </Button>
      </div>

      <Card className="h-[calc(100vh-150px)] overflow-y-auto rounded-xl p-4 shadow-lg scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-blue-500">
        <div className="space-y-6">
          {destinations.map((destination) => (
            <Card
              key={destination._id}
              className="group p-4 shadow-md transition-colors duration-300 ease-in-out hover:bg-blue-50"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <Typography
                    variant="h5"
                    color="deep-orange"
                    className="flex items-center gap-2"
                  >
                    <MapPinIcon
                      strokeWidth={3}
                      className="h-5 w-5 text-deep-orange-600"
                    />
                    {destination.name}
                  </Typography>
                  <Typography
                    className={`mt-1 font-medium ${
                      destination.isPopular ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {destination.isPopular
                      ? "Popular Destination"
                      : "Regular Destination"}
                  </Typography>
                </div>

                <div className="w-full sm:w-48">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    onClick={() => handleImageClick(destination.image)}
                    className="h-32 w-full cursor-pointer rounded-md object-cover shadow-sm transition-all duration-500 ease-in-out group-hover:scale-105"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <Tooltip
                    content="Edit"
                    placement="top"
                    className="font-medium text-green-600"
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 },
                    }}
                  >
                    <Button
                      variant="text"
                      color="green"
                      onClick={() => handleOpenDialog(destination)}
                      className="p-2"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    content="Delete"
                    placement="top"
                    className="font-medium text-red-500"
                    color="red"
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 },
                    }}
                  >
                    <Button
                      variant="text"
                      color="red"
                      onClick={() =>
                        confirmDelete(destination._id, destination.name)
                      }
                      className="p-2"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Dialog open={openDialog} handler={handleCloseDialog} size="md">
        <DialogHeader className="flex items-center justify-between">
          {currentDestination ? "Edit Destination" : "Add Destination"}
          {alert.message && (
            <Alert
              color={alert.type}
              onClose={() => setAlert({ message: "", type: "" })}
              className="mb-4 max-w-xl md:max-w-4xl"
            >
              {alert.message}
            </Alert>
          )}
        </DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Destination Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData({
                      ...formData,
                      imageFile: file,
                      imagePreview: URL.createObjectURL(file),
                    });
                  }
                }}
                required={!currentDestination} // Required only for adding new
                disabled={currentDestination?.image && !formData.imageFile}
                className="block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-600 hover:file:bg-blue-100"
              />
            </div>

            {formData.imagePreview && (
              <div className="relative mt-3 w-full p-2">
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="h-40 w-full rounded object-cover"
                />
                {/* Delete Icon */}
                {currentDestination && (
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="absolute right-0 top-0 rounded-full bg-blue-100 p-1 text-white hover:bg-red-100"
                  >
                    ❌
                  </button>
                )}
              </div>
            )}

            <label className="flex items-center gap-2 pt-2 text-sm text-gray-700">
              <Checkbox
                checked={formData.isPopular}
                onChange={(e) =>
                  setFormData({ ...formData, isPopular: e.target.checked })
                }
                color="blue"
              />
              Is Popular Destination
            </label>
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
      <Dialog open={openImageDialog} handler={handleCloseImageDialog} size="xl">
        <DialogBody className="p-0">
          <img
            src={previewImage}
            alt="Preview"
            className="h-auto max-h-[800px] w-full rounded object-contain"
          />
        </DialogBody>
        <DialogFooter className="justify-end">
          <Button onClick={handleCloseImageDialog} color="red" variant="text">
            Close
          </Button>
        </DialogFooter>
      </Dialog>
      <Dialog open={openDeleteDialog} handler={setOpenDeleteDialog}>
        <DialogHeader>Confirm Delete</DialogHeader>
        <DialogBody>
          Are you sure you want to delete{" "}
          <span className="font-semibold text-red-600">{destinationName}</span>?
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={() => setOpenDeleteDialog(false)}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={() => handleDelete(deleteId)}
          >
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default ManageDestination;
