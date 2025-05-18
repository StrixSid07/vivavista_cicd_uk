import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Spinner,
  Alert,
} from "@material-tailwind/react";
import axios from "@/utils/axiosInstance";

export function ManageDealExternal() {
  const [file, setFile] = useState(null);
  const [uploadingType, setUploadingType] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [openAlert, setOpenAlert] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (
      selected &&
      selected.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setFile(selected);
      setMessage({ type: "", text: "" });
    } else {
      setFile(null);
      setMessage({
        type: "error",
        text: "Only Excel (.xlsx) files are allowed.",
      });
      setOpenAlert(true);
    }
  };

  const handleUpload = async (endpoint) => {
    if (!file) {
      setMessage({ type: "error", text: "Please select an Excel file first." });
      setOpenAlert(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploadingType(endpoint);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post(
        `/admindealsexternal/${endpoint}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setMessage({
        type: "success",
        text: res.data.message || "Upload successful!",
      });
      setFile(null);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message || "Upload failed. Please try again.",
      });
    } finally {
      setUploadingType(null);
      setOpenAlert(true);
    }
  };

  const downloadFile = async (endpoint, filename) => {
    try {
      const res = await axios.get(`/admindealsexternal/${endpoint}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setMessage({
        type: "error",
        text: "Download failed. Please try again.",
      });
      setOpenAlert(true);
    }
  };

  const isUploading = (endpoint) => uploadingType === endpoint;

  useEffect(() => {
    if (message.text) {
      setOpenAlert(true);
      const timer = setTimeout(() => {
        setOpenAlert(false);
        setMessage({ text: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message.text]);

  return (
    <Card className="h-full min-h-[80vh] w-full shadow-lg">
      <CardBody className="space-y-6">
        <Typography variant="h4">Manage External Deals</Typography>

        <Alert
          open={openAlert}
          onClose={() => setOpenAlert(false)}
          animate={{ mount: { y: 0 }, unmount: { y: 100 } }}
          color={message.type === "success" ? "green" : "red"}
        >
          {message.text}
        </Alert>

        {/* ---------- SECTION: Downloads ---------- */}
        <div className="space-y-2">
          <Typography variant="h6" color="blue-gray">
            Download Templates
          </Typography>
          <div className="grid gap-3 sm:grid-cols-3">
            <Button
              color="blue"
              onClick={() => downloadFile("template", "DealsTemplate.xlsx")}
            >
              Download Deals Template
            </Button>
            <Button
              color="green"
              onClick={() => downloadFile("download-all", "AllDeals.xlsx")}
            >
              Download All Deals
            </Button>
            <Button
              color="teal"
              onClick={() =>
                downloadFile("price-template", "DealPriceTemplate.xlsx")
              }
            >
              Download Price Template
            </Button>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* ---------- SECTION: File Upload ---------- */}
        <div className="space-y-2">
          <Typography variant="h6" color="blue-gray">
            Upload Excel File
          </Typography>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              required
              className="block w-full max-w-xs text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-600 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* ---------- SECTION: Upload Actions ---------- */}
        <div className="space-y-2">
          <Typography variant="h6" color="blue-gray">
            Upload Actions
          </Typography>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <Button
              onClick={() => handleUpload("bulk-upload")}
              disabled={isUploading("bulk-upload")}
              color="purple"
            >
              {isUploading("bulk-upload") ? (
                <Spinner className="h-4 w-4" />
              ) : (
                "Bulk Upload Deals"
              )}
            </Button>

            <Button
              onClick={() => handleUpload("bulk-update")}
              disabled={isUploading("bulk-update")}
              color="deep-purple"
            >
              {isUploading("bulk-update") ? (
                <Spinner className="h-4 w-4" />
              ) : (
                "Bulk Update Deals"
              )}
            </Button>

            <Button
              onClick={() => handleUpload("bulk-upload-price")}
              disabled={isUploading("bulk-upload-price")}
              color="cyan"
            >
              {isUploading("bulk-upload-price") ? (
                <Spinner className="h-4 w-4" />
              ) : (
                "Bulk Upload Prices"
              )}
            </Button>

            <Button
              onClick={() => handleUpload("bulk-upload-update")}
              disabled={isUploading("bulk-upload-update")}
              color="indigo"
            >
              {isUploading("bulk-upload-update") ? (
                <Spinner className="h-4 w-4" />
              ) : (
                "Upload + Update Prices"
              )}
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
