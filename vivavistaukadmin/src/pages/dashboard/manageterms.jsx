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
  Tooltip,
} from "@material-tailwind/react";
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import axios from "@/utils/axiosInstance";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill CSS

export function ManageTerms() {
  const [terms, setTerms] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTerm, setCurrentTerm] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    sequenceNumber: 0,
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [termTitle, setTermTitle] = useState("");
  const [openViewDialog, setOpenViewDialog] = useState(false); // State for view dialog

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const response = await axios.get("/terms");
      setTerms(response.data);
    } catch (error) {
      console.error("Error fetching terms:", error);
      setAlert({ message: "Error fetching terms", type: "red" });
    }
  };

  const handleOpenDialog = (term = null) => {
    setCurrentTerm(term);
    setFormData(
      term
        ? {
            title: term.title,
            content: term.content,
            sequenceNumber: term.sequenceNumber,
          }
        : {
            title: "",
            content: "",
            sequenceNumber: 0,
          },
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTerm(null);
    setAlert({ message: "", type: "" });
  };

  const handleViewTerm = (term) => {
    setCurrentTerm(term);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setCurrentTerm(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        title: formData.title,
        content: formData.content,
        sequenceNumber: formData.sequenceNumber,
      };

      if (currentTerm) {
        await axios.put(`/terms/${currentTerm._id}`, data);
        setAlert({ message: "Term updated successfully!", type: "green" });
      } else {
        await axios.post("/terms", data);
        setAlert({ message: "Term added successfully!", type: "green" });
      }
      fetchTerms();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving term:", error);
      const serverMessage =
        error.response?.data?.message || "Error saving term";
      setAlert({ message: serverMessage, type: "red" });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id, title) => {
    setDeleteId(id);
    setTermTitle(title);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/terms/${id}`);
      setAlert({ message: "Term deleted successfully!", type: "green" });
      fetchTerms();
    } catch (error) {
      console.error("Error deleting term:", error);
      setAlert({ message: "Error deleting term", type: "red" });
    } finally {
      setOpenDeleteDialog(false);
      setDeleteId(null);
    }
  };

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);
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
          Add Term
        </Button>
      </div>

      <Card className="h-[calc(100vh-150px)] overflow-y-auto rounded-xl p-4 shadow-lg scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-blue-500">
        <div className="space-y-4">
          {terms.map((term) => (
            <div
              key={term._id}
              className="flex items-center justify-between border-b p-2"
            >
              <Typography variant="h6">{term.title}</Typography>
              <div className="flex space-x-2">
                <Button
                  color="green"
                  onClick={() => handleViewTerm(term)}
                  size="sm"
                  className="flex items-center"
                >
                  <EyeIcon className="h-5 w-5" />
                </Button>
                <Button
                  color="blue"
                  onClick={() => handleOpenDialog(term)}
                  size="sm"
                  className="flex items-center"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </Button>
                <Button
                  color="red"
                  onClick={() => confirmDelete(term._id, term.title)}
                  size="sm"
                  className="flex items-center"
                >
                  <TrashIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* View Term Dialog */}
      <Dialog open={openViewDialog} handler={handleCloseViewDialog}>
        <DialogHeader>
          <Typography variant="h5" className="text-lg font-bold">
            {currentTerm?.title}
          </Typography>
        </DialogHeader>
        <DialogBody className="h-[480px] overflow-y-auto scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-blue-500">
          <div
            className="prose max-w-none text-base font-medium leading-relaxed"
            dangerouslySetInnerHTML={{ __html: currentTerm?.content }}
          />
        </DialogBody>
        <DialogFooter>
          <Button color="red" onClick={handleCloseViewDialog}>
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Add/Edit Term Dialog */}
      <Dialog open={openDialog} handler={handleCloseDialog}>
        <DialogHeader className="flex items-start justify-between">
          <Typography variant="h5" className="w-36 text-lg font-bold">
            {currentTerm ? "Edit Term" : "Add Term"}
          </Typography>
          {alert.message && (
            <Alert
              color={alert.type}
              onClose={() => setAlert({ message: "", type: "" })}
              className="mb-4"
            >
              {alert.message}
            </Alert>
          )}
        </DialogHeader>
        <DialogBody className="h-[480px] overflow-y-auto scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-blue-500">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="mt-1 block w-full rounded-md border p-2 text-base font-medium"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Content
              </label>
              <ReactQuill
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                className="rounded-md border text-base font-medium"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Sequence Number
              </label>
              <input
                type="number"
                value={formData.sequenceNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sequenceNumber: Number(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-md border p-2 text-base font-medium"
                required
              />
            </div>
            <DialogFooter className="flex items-center justify-end gap-2">
              <Button type="submit" color="green" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button color="red" onClick={handleCloseDialog}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogBody>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        handler={() => setOpenDeleteDialog(false)}
      >
        <DialogHeader>Confirm Deletion</DialogHeader>
        <DialogBody>
          <Typography>
            Are you sure you want to delete the term "{termTitle}"?
          </Typography>
        </DialogBody>
        <DialogFooter className="flex items-center justify-end gap-2">
          <Button color="red" onClick={() => handleDelete(deleteId)}>
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
