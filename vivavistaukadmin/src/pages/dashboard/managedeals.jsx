import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Card,
  Checkbox,
  CardHeader,
  CardBody,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Alert,
  Tooltip,
  Select,
  Switch,
  Option,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import axios from "@/utils/axiosInstance";
import { MapPinIcon, StopCircleIcon } from "@heroicons/react/24/solid";

export const ManageDeals = () => {
  const [deals, setDeals] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [boardBasis, setBoardBasis] = useState([]);
  const [previewImages, setPreviewImages] = useState([]); // for showing all images

  const [airports, setAirports] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [holidaycategories, setHolidayCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentDeal, setCurrentDeal] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    availableCountries: [],
    destination: "",
    days: 0,
    rooms: 0,
    guests: 0,
    distanceToCenter: "",
    distanceToBeach: "",
    isTopDeal: false,
    isHotdeal: false,
    isFeatured: false,
    boardBasis: "",
    hotels: [],
    holidaycategories: [],
    itinerary: [{ title: "", description: "" }],
    whatsIncluded: [""],
    exclusiveAdditions: [""],
    termsAndConditions: [""],
    tag: "",
    LowDeposite: "",
    images: [],
    prices: [
      {
        country: "",
        priceswitch: false,
        airport: [],
        hotel: "",
        startdate: "",
        enddate: "",
        price: 0,
        flightDetails: {
          outbound: {
            departureTime: "",
            arrivalTime: "",
            airline: "",
            flightNumber: "",
          },
          returnFlight: {
            departureTime: "",
            arrivalTime: "",
            airline: "",
            flightNumber: "",
          },
        },
      },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [dealName, setDealName] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    fetchDeals();
    fetchDestinations();
    fetchAirports();
    fetchHotels();
    fetchHolidays();
    fetchBoardBasis();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await axios.get("/deals/admin");
      setDeals(response.data);
    } catch (error) {
      console.error("Error fetching deals:", error);
      setAlert({ message: "Error fetching deals", type: "red" });
    }
  };

  const fetchDestinations = async () => {
    try {
      const response = await axios.get("/destinations/dropdown-destionation");
      setDestinations(response.data);
    } catch (error) {
      console.error("Error fetching destinatinos:", error);
      setAlert({ message: "Error fetching destinatinos", type: "red" });
    }
  };

  const fetchBoardBasis = async () => {
    try {
      const response = await axios.get("/boardbasis/dropdown-boardbasis");
      setBoardBasis(response.data);
    } catch (error) {
      console.error("Error fetching boardbasis:", error);
      setAlert({ message: "Error fetching boardbasis", type: "red" });
    }
  };

  const fetchAirports = async () => {
    try {
      const response = await axios.get("/airport");
      setAirports(response.data);
    } catch (error) {
      console.error("Error fetching airports:", error);
      setAlert({ message: "Error fetching airports", type: "red" });
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await axios.get("/hotels");
      setHotels(response.data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      setAlert({ message: "Error fetching hotels", type: "red" });
    }
  };

  const fetchHolidays = async () => {
    try {
      const response = await axios.get("/holidays/dropdown-holiday");
      setHolidayCategories(response.data);
    } catch (error) {
      console.error("Error fetching holidays:", error);
      setAlert({ message: "Error fetching holidays", type: "red" });
    }
  };

  const handleOpenDialog = (deal = null) => {
    if (buttonDisabled) return;
    
    setButtonDisabled(true);
    setTimeout(() => setButtonDisabled(false), 500); // Prevent double-clicks for 500ms
    
    setCurrentDeal(deal);
    // console.log("thisis images", deal.images);
    setFormData(
      deal
        ? {
            _id: deal._id,
            title: deal.title,
            description: deal.description,
            availableCountries: deal.availableCountries || [],
            destination: deal.destination ? deal.destination._id : "" || "",
            days: deal.days || 0,
            rooms: deal.rooms || 0,
            guests: deal.guests || 0,
            distanceToCenter: deal.distanceToCenter || "",
            distanceToBeach: deal.distanceToBeach || "",
            isTopDeal: deal.isTopDeal || false,
            isHotdeal: deal.isHotdeal || false,
            isFeatured: deal.isFeatured || false,
            boardBasis: deal.boardBasis ? deal.boardBasis._id : "" || "",
            hotels: Array.isArray(deal.hotels)
              ? deal.hotels.map((h) => (typeof h === "object" ? h._id : h))
              : [],
            holidaycategories: Array.isArray(deal.holidaycategories)
              ? deal.holidaycategories.map((cat) =>
                  typeof cat === "object" ? cat._id : cat,
                )
              : [],
            itinerary:
              deal.itinerary &&
              Array.isArray(deal.itinerary) &&
              deal.itinerary.length > 0
                ? deal.itinerary.map((item) => ({
                    title: item.title || "",
                    description: item.description || "",
                  }))
                : [{ title: "", description: "" }],
            whatsIncluded:
              deal.whatsIncluded && typeof deal.whatsIncluded === "string"
                ? deal.whatsIncluded.split(",")
                : Array.isArray(deal.whatsIncluded)
                ? deal.whatsIncluded
                : [""],
            exclusiveAdditions:
              deal.exclusiveAdditions &&
              typeof deal.exclusiveAdditions === "string"
                ? deal.exclusiveAdditions.split(",")
                : Array.isArray(deal.exclusiveAdditions)
                ? deal.exclusiveAdditions
                : [""],
            termsAndConditions:
              deal.termsAndConditions &&
              typeof deal.termsAndConditions === "string"
                ? deal.termsAndConditions.split(",")
                : Array.isArray(deal.termsAndConditions)
                ? deal.termsAndConditions
                : [""],
            images: deal.images,
            tag: deal.tag,
            LowDeposite: deal.LowDeposite,
            prices:
              deal.prices.length > 0
                ? deal.prices.map((price) => ({
                    ...price,
                    airport: Array.isArray(price.airport)
                      ? price.airport.map((a) =>
                          typeof a === "object" ? a._id : a,
                        )
                      : [],
                    startdate: price.startdate.split("T")[0], // Convert to YYYY-MM-DD
                    enddate: price.enddate.split("T")[0], // Convert to YYYY-MM-DD
                    hotel:
                      price.hotel && typeof price.hotel === "object"
                        ? price.hotel._id
                        : price.hotel,
                  }))
                : [
                    {
                      country: "",
                      priceswitch: false,
                      airport: "",
                      hotel: "",
                      startdate: "", // Ensure this is initialized as an empty string
                      enddate: "", // Ensure this is initialized as an empty string
                      price: 0,
                      flightDetails: {
                        outbound: {
                          departureTime: "",
                          arrivalTime: "",
                          airline: "",
                          flightNumber: "",
                        },
                        returnFlight: {
                          departureTime: "",
                          arrivalTime: "",
                          airline: "",
                          flightNumber: "",
                        },
                      },
                    },
                  ],
          }
        : {
            title: "",
            description: "",
            availableCountries: [],
            destination: "",
            days: 0,
            rooms: 0,
            guests: 0,
            distanceToCenter: "",
            distanceToBeach: "",
            isTopDeal: false,
            isHotdeal: false,
            isFeatured: false,
            boardBasis: "",
            hotels: [],
            holidaycategories: [],
            images: [],
            itinerary: [{ title: "", description: "" }],
            whatsIncluded: [""],
            exclusiveAdditions: [""],
            termsAndConditions: [""],
            tag: "",
            LowDeposite: "",
            prices: [
              {
                country: "",
                priceswitch: false,
                airport: [],
                hotel: "",
                startdate: "", // Ensure this is initialized as an empty string
                enddate: "", // Ensure this is initialized as an empty string
                price: 0,
                flightDetails: {
                  outbound: {
                    departureTime: "",
                    arrivalTime: "",
                    airline: "",
                    flightNumber: "",
                  },
                  returnFlight: {
                    departureTime: "",
                    arrivalTime: "",
                    airline: "",
                    flightNumber: "",
                  },
                },
              },
            ],
          },
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentDeal(null);
    setAlert({ message: "", type: "" });
    setIsSubmitting(false);
    setNewImages([]);
  };

  const handleOpenViewDialog = (deal) => {
    setCurrentDeal(deal);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setCurrentDeal(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent duplicate submissions
    if (isSubmitting) return;
    
    // Check if there's an image error before proceeding
    if (imageError) {
      setAlert({ message: imageError, type: "red" });
      return;
    }
    
    if (formData.availableCountries.length === 0) {
      setAlert({
        message: "Please select at least one available country.",
        type: "red",
      });
      return;
    }

    setIsSubmitting(true);
    setLoading(true);
    
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("data", JSON.stringify(formData));
    if (newImages && newImages.length > 0) {
      for (let i = 0; i < newImages.length; i++) {
        formDataToSubmit.append("images", newImages[i]);
      }
    }

    try {
      if (currentDeal) {
        await axios.put(`/deals/${currentDeal._id}`, formDataToSubmit, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setAlert({ message: "Deal updated successfully!", type: "green" });
      } else {
        await axios.post("/deals", formDataToSubmit, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setAlert({ message: "Deal added successfully!", type: "green" });
      }
      fetchDeals();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving deal:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Error saving deal";
      setAlert({ message: errorMessage, type: "red" });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleRemoveImage = async (indexToRemove, imageUrl) => {
    try {
      const dealId = formData._id; // adjust this as per your data
      console.log("this is deal data", formData);
      await axios.delete(`/deals/image/${dealId}`, {
        data: { imageUrl },
      });

      // Optimistically update the UI
      setFormData((prevData) => ({
        ...prevData,
        images: prevData.images.filter((_, index) => index !== indexToRemove),
      }));
      fetchDeals();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const confirmDelete = (id, name) => {
    if (buttonDisabled) return;
    
    setButtonDisabled(true);
    setTimeout(() => setButtonDisabled(false), 500); // Prevent double-clicks for 500ms
    
    setDeleteId(id);
    setDealName(name);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async (id) => {
    if (deleteInProgress) return;
    
    try {
      setDeleteInProgress(true);
      await axios.delete(`/deals/${id}`);
      setAlert({ message: "Deal deleted successfully!", type: "green" });
      fetchDeals();
    } catch (error) {
      console.error("Error deleting deal:", error);
      setAlert({ message: "Error deleting deal", type: "red" });
    } finally {
      setOpenDeleteDialog(false);
      setDeleteId(null);
      setDeleteInProgress(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const [expandedIndices, setExpandedIndices] = useState([]);

  const toggleExpand = (index) => {
    setExpandedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };
  const today = new Date();
  const minStartDate = new Date(today);
  minStartDate.setDate(today.getDate() + 2); // 2 days after today
  const minStartStr = minStartDate.toISOString().split("T")[0];
  const validateDateRange = (price, days) => {
    if (!price.startdate || !price.enddate || !days) return;

    const start = new Date(price.startdate);
    const end = new Date(price.enddate);

    if (end < start) {
      window.alert("End date cannot be before start date.");
      return;
    }

    const actualDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const enteredDays = parseInt(days, 10);

    if (enteredDays !== actualDays) {
      window.alert(
        enteredDays < actualDays
          ? `You entered fewer days (${enteredDays}) than the actual range (${actualDays}).`
          : `You entered more days (${enteredDays}) than the actual range (${actualDays}).`,
      );
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

  // Helper function for validating image
  const validateImage = (file) => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return "Only JPG, JPEG, and PNG files are allowed";
    }
    
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return "Image size must be less than 5MB";
    }
    
    return "";
  };

  // Function to validate all images in a file list
  const validateImages = (files) => {
    for (let i = 0; i < files.length; i++) {
      const error = validateImage(files[i]);
      if (error) {
        return error;
      }
    }
    return "";
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
          Add Deal
        </Button>
      </div>

      {/* Main Screen Cards */}
      <Card className="h-[calc(100vh-150px)] overflow-y-auto rounded-xl p-4 shadow-lg scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-blue-500">
        <div className="space-y-6">
          {deals.map((deal) => (
            <Card
              key={deal._id}
              className="group p-4 shadow-md transition-colors duration-300 ease-in-out hover:bg-blue-50"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Title + Flags & Categories */}
                <div className="flex-1">
                  <Typography
                    variant="h5"
                    color="deep-orange"
                    className="flex items-center justify-start gap-2"
                  >
                    {deal.title}
                  </Typography>

                  <Typography
                    variant="h6"
                    color="deep-orange"
                    className="flex items-center justify-start gap-1"
                  >
                    <MapPinIcon className="mb-1 h-5 w-5" />
                    {deal.destination.name}
                  </Typography>

                  <Typography
                    variant="sm"
                    color="deep-orange"
                    className="flex items-center justify-start gap-2 font-normal"
                  >
                    <StopCircleIcon className="mb-1 ml-1 h-3 w-3" />
                    {deal.boardBasis.name}
                  </Typography>

                  {/* Flags */}
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="flex items-center gap-1">
                      <Checkbox
                        color="orange"
                        checked={deal.isTopDeal}
                        disabled
                      />
                      <Typography variant="small">Top Deal</Typography>
                    </div>
                    <div className="flex items-center gap-1">
                      <Checkbox color="red" checked={deal.isHotdeal} disabled />
                      <Typography variant="small">Hot Deal</Typography>
                    </div>
                    <div className="flex items-center gap-1">
                      <Checkbox
                        color="green"
                        checked={deal.isFeatured}
                        disabled
                      />
                      <Typography variant="small">Featured</Typography>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="mt-2">
                    <Typography
                      variant="text"
                      className="font-bold text-deep-orange-300"
                    >
                      Categories:
                    </Typography>
                    {Array.isArray(deal.holidaycategories) &&
                    deal.holidaycategories.length > 0 ? (
                      <ul className="list-disc pl-6 text-black">
                        {deal.holidaycategories.map((catItem, idx) => {
                          const catId =
                            typeof catItem === "object" ? catItem._id : catItem;
                          const catObj = holidaycategories.find(
                            (h) => h._id === catId,
                          );
                          const name = catObj ? catObj.name : catId;
                          return <li key={idx}>{name}</li>;
                        })}
                      </ul>
                    ) : (
                      <Typography variant="paragraph" className="text-black">
                        No categories selected.
                      </Typography>
                    )}
                  </div>
                </div>

                {/* Action buttons (View/Edit/Delete) */}
                <div className="flex items-center gap-4">
                  <Tooltip
                    content="View"
                    placement="top"
                    className="font-medium text-blue-600"
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 },
                    }}
                  >
                    <Button
                      variant="text"
                      color="blue"
                      onClick={() => handleOpenViewDialog(deal)}
                      className="p-2"
                    >
                      <EyeIcon strokeWidth={2} className="h-5 w-5" />
                    </Button>
                  </Tooltip>
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
                      onClick={() => handleOpenDialog(deal)}
                      className="p-2"
                      disabled={buttonDisabled}
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
                      onClick={() => confirmDelete(deal._id, deal.title)}
                      className="p-2"
                      disabled={buttonDisabled}
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

      {/* Add/Edit Deal Dialog */}
      <Dialog open={openDialog} handler={handleCloseDialog} size="lg">
        <DialogHeader className="flex items-center justify-between gap-2">
          {currentDeal ? "Edit Deal" : "Add Deal"}
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
        <DialogBody className="h-[480px] overflow-y-auto scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-blue-500">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Deal Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
            <Input
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
            <Input
              label="Deal Tag"
              value={formData.tag}
              onChange={(e) =>
                setFormData({ ...formData, tag: e.target.value })
              }
            />
            <Input
              label="Low Deposite"
              value={formData.LowDeposite}
              onChange={(e) =>
                setFormData({ ...formData, LowDeposite: e.target.value })
              }
            />
            <Typography variant="h6">Available Countries</Typography>
            <div className="flex flex-wrap gap-1">
              {["UK", "USA", "Canada"].map((country) => (
                <label key={country} className="flex items-center">
                  <Checkbox
                    color="blue"
                    checked={formData.availableCountries.includes(country)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setFormData((prev) => ({
                        ...prev,
                        availableCountries: isChecked
                          ? [...prev.availableCountries, country]
                          : prev.availableCountries.filter(
                              (c) => c !== country,
                            ),
                      }));
                    }}
                  />
                  <span>{country}</span>
                </label>
              ))}
            </div>

            <Select
              label="Destination"
              value={formData.destination}
              onChange={(value) =>
                setFormData({ ...formData, destination: value })
              }
              required
            >
              {destinations.map((destination) => (
                <Option key={destination._id} value={destination._id}>
                  {destination.name}
                </Option>
              ))}
            </Select>

            <Typography variant="h6">Select Holidays Categories</Typography>
            <Menu placement="bottom-start">
              <MenuHandler>
                <Button
                  variant="gradient"
                  color="blue"
                  className="w-full text-left"
                >
                  {formData.holidaycategories.length > 0
                    ? `${formData.holidaycategories.length} categorie(s) selected`
                    : "Select Holidays Categories"}
                </Button>
              </MenuHandler>
              <MenuList className="z-[100000] max-h-64 overflow-auto">
                {holidaycategories.map((holidaycategorie) => (
                  <MenuItem
                    key={holidaycategorie._id}
                    className="flex items-center gap-2"
                    onClick={(e) => e.preventDefault()} // Prevent dropdown from closing
                  >
                    <Checkbox
                      ripple={false}
                      color="blue"
                      containerProps={{ className: "p-0" }}
                      className="hover:before:content-none"
                      checked={formData.holidaycategories.includes(
                        holidaycategorie._id,
                      )}
                      onChange={(e) => {
                        e.stopPropagation(); // Prevent bubbling to MenuItem
                        const isChecked = e.target.checked;
                        const updatedHolidaysCategories = isChecked
                          ? [
                              ...formData.holidaycategories,
                              holidaycategorie._id,
                            ]
                          : formData.holidaycategories.filter(
                              (id) => id !== holidaycategorie._id,
                            );
                        setFormData({
                          ...formData,
                          holidaycategories: updatedHolidaysCategories,
                        });
                      }}
                    />
                    <span>{holidaycategorie.name}</span>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <Input
                label="Number of Nights"
                type="number"
                // value={formData.days}
                value={formData.days === 0 ? "" : formData.days}
                onChange={(e) =>
                  setFormData({ ...formData, days: Number(e.target.value) })
                }
                required
              />

              <Select
                label="Board Basis"
                value={formData.boardBasis}
                onChange={(value) =>
                  setFormData({ ...formData, boardBasis: value })
                }
                required
              >
                {boardBasis.map((boardBasis) => (
                  <Option key={boardBasis._id} value={boardBasis._id}>
                    {boardBasis.name}
                  </Option>
                ))}
              </Select>
            </div>

            <Typography variant="h6">Select Hotels</Typography>
            <Menu placement="bottom-start">
              <MenuHandler>
                <Button
                  variant="gradient"
                  color="amber"
                  className="w-full text-left"
                >
                  {formData.hotels.length > 0
                    ? `${formData.hotels.length} hotel(s) selected`
                    : "Select Hotels"}
                </Button>
              </MenuHandler>
              <MenuList className="z-[100000] max-h-64 overflow-auto">
                {hotels.map((hotel) => (
                  <MenuItem
                    key={hotel._id}
                    className="flex items-center gap-2"
                    onClick={(e) => e.preventDefault()} // Prevent dropdown from closing
                  >
                    <Checkbox
                      color="amber"
                      ripple={false}
                      containerProps={{ className: "p-0" }}
                      className="hover:before:content-none"
                      checked={formData.hotels.includes(hotel._id)}
                      onChange={(e) => {
                        e.stopPropagation(); // Prevent bubbling to MenuItem
                        const isChecked = e.target.checked;
                        const updatedHotels = isChecked
                          ? [...formData.hotels, hotel._id]
                          : formData.hotels.filter((id) => id !== hotel._id);
                        setFormData({ ...formData, hotels: updatedHotels });
                      }}
                    />
                    <span>{hotel.name}</span>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            {/* Price Fields */}
            <Typography variant="h6">Price Details</Typography>
            {formData.prices.map((price, index) => (
              <div key={index} className="mb-4 space-y-2 rounded border p-3">
                {/* Add the Switch for priceswitch */}
                <div className="flex items-center">
                  <Switch
                    id={`priceswitch-${index}`}
                    ripple={false}
                    checked={price.priceswitch}
                    onChange={(e) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[index].priceswitch = e.target.checked;
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                    className="h-full w-full checked:bg-black"
                    containerProps={{
                      className: "w-11 h-6",
                    }}
                    circleProps={{
                      className: "before:hidden left-0.5 border-none",
                    }}
                  />
                  <label className="ml-2" htmlFor={`priceswitch-${index}`}>
                    Price Switch (turn switch to black for off in website)
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-3">
                  <Select
                    label="Country"
                    value={price.country}
                    onChange={(value) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[index].country = value;
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                    required
                  >
                    {["UK", "USA", "Canada"].map((country) => (
                      <Option key={country} value={country}>
                        {country}
                      </Option>
                    ))}
                  </Select>

                  <Menu placement="bottom-start">
                    <MenuHandler>
                      <Button
                        variant="gradient"
                        color="green"
                        className="w-full text-left"
                      >
                        {formData.prices[index].airport.length > 0
                          ? `${formData.prices[index].airport.length} airport(s) selected`
                          : "Select Airports"}
                      </Button>
                    </MenuHandler>
                    <MenuList className="z-[100000] max-h-64 overflow-auto">
                      {airports.map((airport) => (
                        <MenuItem
                          key={airport._id}
                          className="flex items-center gap-2"
                          onClick={(e) => e.preventDefault()} // Prevent dropdown from closing
                        >
                          <Checkbox
                            color="green"
                            ripple={false}
                            containerProps={{ className: "p-0" }}
                            className="hover:before:content-none"
                            checked={price.airport?.includes(airport._id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              const isChecked = e.target.checked;
                              const updatedPrices = [...formData.prices];
                              const updatedAirports = isChecked
                                ? [
                                    ...(updatedPrices[index].airport || []),
                                    airport._id,
                                  ]
                                : (updatedPrices[index].airport || []).filter(
                                    (id) => id !== airport._id,
                                  );

                              updatedPrices[index] = {
                                ...updatedPrices[index],
                                airport: updatedAirports,
                              };

                              setFormData({
                                ...formData,
                                prices: updatedPrices,
                              });
                            }}
                          />
                          <span>
                            {airport.name} ({airport.code})
                          </span>
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>

                  <Select
                    label="Hotel"
                    value={
                      price.hotel && typeof price.hotel === "object"
                        ? price.hotel._id
                        : price.hotel
                    }
                    onChange={(value) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[index].hotel = value;
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                    required
                  >
                    {hotels.map((hotel) => (
                      <Option key={hotel._id} value={hotel._id}>
                        {hotel.name}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-3">
                  <Input
                    label="Start Date"
                    type="date"
                    min={minStartStr}
                    value={price.startdate}
                    onChange={(e) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[index].startdate = e.target.value;
                      if (
                        updatedPrices[index].enddate &&
                        new Date(updatedPrices[index].enddate) <
                          new Date(e.target.value)
                      ) {
                        updatedPrices[index].enddate = e.target.value;
                      }
                      setFormData({ ...formData, prices: updatedPrices });
                      validateDateRange(updatedPrices[index], formData.days);
                    }}
                    required
                  />
                  <Input
                    label="End Date"
                    type="date"
                    min={price.startdate || minStartStr} // Prevent end date before start
                    value={price.enddate}
                    onChange={(e) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[index].enddate = e.target.value;
                      setFormData({ ...formData, prices: updatedPrices });
                      validateDateRange(updatedPrices[index], formData.days);
                    }}
                    required
                  />
                  <Input
                    label="Price"
                    type="number"
                    value={price.price === 0 ? "" : price.price}
                    onChange={(e) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[index].price = Number(e.target.value);
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                    required
                  />
                </div>

                {/* Flight Details */}
                <Typography variant="small" color="blue-gray">
                  Outbound Flight
                </Typography>
                <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-2">
                  <Input
                    label="Departure Time"
                    type="time"
                    value={price.flightDetails.outbound.departureTime}
                    onChange={(e) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[
                        index
                      ].flightDetails.outbound.departureTime = e.target.value;
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                  />
                  <Input
                    label="Arrival Time"
                    type="time"
                    value={price.flightDetails.outbound.arrivalTime}
                    onChange={(e) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[index].flightDetails.outbound.arrivalTime =
                        e.target.value;
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                  />
                  <Input
                    label="Airline"
                    value={price.flightDetails.outbound.airline}
                    onChange={(e) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[index].flightDetails.outbound.airline =
                        e.target.value;
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                  />
                  <Input
                    label="Flight Number"
                    value={price.flightDetails.outbound.flightNumber}
                    onChange={(e) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[index].flightDetails.outbound.flightNumber =
                        e.target.value;
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                  />
                </div>

                <Typography variant="small" color="blue-gray">
                  Return Flight
                </Typography>
                <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-2">
                  <Input
                    label="Departure Time"
                    type="time"
                    value={price.flightDetails.returnFlight.departureTime}
                    onChange={(e) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[
                        index
                      ].flightDetails.returnFlight.departureTime =
                        e.target.value;
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                  />
                  <Input
                    label="Arrival Time"
                    type="time"
                    value={price.flightDetails.returnFlight.arrivalTime}
                    onChange={(e) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[
                        index
                      ].flightDetails.returnFlight.arrivalTime = e.target.value;
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                  />
                  <Input
                    label="Airline"
                    value={price.flightDetails.returnFlight.airline}
                    onChange={(e) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[index].flightDetails.returnFlight.airline =
                        e.target.value;
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                  />
                  <Input
                    label="Flight Number"
                    value={price.flightDetails.returnFlight.flightNumber}
                    onChange={(e) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[
                        index
                      ].flightDetails.returnFlight.flightNumber =
                        e.target.value;
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                  />
                </div>
                <div className="flex w-full items-end justify-end">
                  {formData.prices.length > 1 && (
                    <Button
                      size="sm"
                      color="red"
                      variant="text"
                      onClick={() => {
                        const updatedPrices = formData.prices.filter(
                          (_, i) => i !== index,
                        );
                        setFormData({ ...formData, prices: updatedPrices });
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button
              variant="gradient"
              color="blue"
              onClick={() =>
                setFormData({
                  ...formData,
                  prices: [
                    ...formData.prices,
                    {
                      country: "",
                      priceswitch: false,
                      airport: "",
                      hotel: "",
                      startdate: "",
                      enddate: "",
                      price: 0,
                      flightDetails: {
                        outbound: {
                          departureTime: "",
                          arrivalTime: "",
                          airline: "",
                          flightNumber: "",
                        },
                        returnFlight: {
                          departureTime: "",
                          arrivalTime: "",
                          airline: "",
                          flightNumber: "",
                        },
                      },
                    },
                  ],
                })
              }
            >
              + Add Another Price
            </Button>
            {/* Checkboxes for Deal Features */}
            <div className="grid grid-cols-3">
              <div className="flex items-center">
                <Checkbox
                  color="orange"
                  checked={formData.isTopDeal}
                  onChange={() =>
                    setFormData({ ...formData, isTopDeal: !formData.isTopDeal })
                  }
                />
                <Typography>Top Deal</Typography>
              </div>
              <div className="flex items-center">
                <Checkbox
                  color="red"
                  checked={formData.isHotdeal}
                  onChange={() =>
                    setFormData({ ...formData, isHotdeal: !formData.isHotdeal })
                  }
                />
                <Typography>Hot Deal</Typography>
              </div>
              <div className="flex items-center">
                <Checkbox
                  color="green"
                  checked={formData.isFeatured}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      isFeatured: !formData.isFeatured,
                    })
                  }
                />
                <Typography>Featured Deal</Typography>
              </div>
            </div>

            <Typography variant="h6">itinerary</Typography>
            {formData.itinerary.map((item, index) => (
              <div key={index} className="mb-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    label={`Day ${index + 1} Title`}
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...formData.itinerary];
                      updated[index] = {
                        ...updated[index],
                        title: e.target.value,
                      };
                      setFormData({ ...formData, itinerary: updated });
                    }}
                    className="flex-1"
                  />
                  {formData.itinerary.length > 1 && (
                    <Button
                      size="sm"
                      color="red"
                      onClick={() => {
                        const updated = formData.itinerary.filter(
                          (_, i) => i !== index,
                        );
                        setFormData({ ...formData, itinerary: updated });
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <Input
                  label={`Day ${index + 1} Description`}
                  value={item.description}
                  onChange={(e) => {
                    const updated = [...formData.itinerary];
                    updated[index] = {
                      ...updated[index],
                      description: e.target.value,
                    };
                    setFormData({ ...formData, itinerary: updated });
                  }}
                  textarea
                />
              </div>
            ))}

            <Button
              size="sm"
              color="blue"
              onClick={() =>
                setFormData({
                  ...formData,
                  itinerary: [
                    ...formData.itinerary,
                    { title: "", description: "" }, // ← new object
                  ],
                })
              }
            >
              + Add Day
            </Button>

            <Typography variant="h6">What's Included</Typography>
            {formData.whatsIncluded.map((item, index) => (
              <div key={index} className="mb-2 flex items-center gap-2">
                <Input
                  label={`Item ${index + 1}`}
                  value={item}
                  onChange={(e) => {
                    const updated = [...formData.whatsIncluded];
                    updated[index] = e.target.value;
                    setFormData({ ...formData, whatsIncluded: updated });
                  }}
                  className="flex-1"
                />
                {formData.whatsIncluded.length > 1 && (
                  <Button
                    size="sm"
                    color="red"
                    onClick={() => {
                      const updated = formData.whatsIncluded.filter(
                        (_, i) => i !== index,
                      );
                      setFormData({ ...formData, whatsIncluded: updated });
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              size="sm"
              color="blue"
              onClick={() =>
                setFormData({
                  ...formData,
                  whatsIncluded: [...formData.whatsIncluded, ""],
                })
              }
            >
              + Add Item
            </Button>

            <Typography variant="h6">Exclusive Additions</Typography>
            {formData.exclusiveAdditions.map((item, index) => (
              <div key={index} className="mb-2 flex items-center gap-2">
                <Input
                  label={`Addition ${index + 1}`}
                  value={item}
                  onChange={(e) => {
                    const updated = [...formData.exclusiveAdditions];
                    updated[index] = e.target.value;
                    setFormData({ ...formData, exclusiveAdditions: updated });
                  }}
                  className="flex-1"
                />
                {formData.exclusiveAdditions.length > 1 && (
                  <Button
                    size="sm"
                    color="red"
                    onClick={() => {
                      const updated = formData.exclusiveAdditions.filter(
                        (_, i) => i !== index,
                      );
                      setFormData({ ...formData, exclusiveAdditions: updated });
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              size="sm"
              color="blue"
              onClick={() =>
                setFormData({
                  ...formData,
                  exclusiveAdditions: [...formData.exclusiveAdditions, ""],
                })
              }
            >
              + Add Addition
            </Button>

            <Typography variant="h6" className="hidden">
              Terms and Conditions
            </Typography>
            {formData.termsAndConditions.map((item, index) => (
              <div key={index} className="mb-2 flex hidden items-center gap-2">
                <Input
                  label={`Clause ${index + 1}`}
                  value={item}
                  onChange={(e) => {
                    const updated = [...formData.termsAndConditions];
                    updated[index] = e.target.value;
                    setFormData({ ...formData, termsAndConditions: updated });
                  }}
                  className="flex-1"
                />
                {formData.termsAndConditions.length > 1 && (
                  <Button
                    size="sm"
                    color="red"
                    onClick={() => {
                      const updated = formData.termsAndConditions.filter(
                        (_, i) => i !== index,
                      );
                      setFormData({ ...formData, termsAndConditions: updated });
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              size="sm"
              color="blue"
              className="hidden"
              onClick={() =>
                setFormData({
                  ...formData,
                  termsAndConditions: [...formData.termsAndConditions, ""],
                })
              }
            >
              + Add Clause
            </Button>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <Input
                label="Number of Rooms"
                type="number"
                // value={formData.rooms}
                value={formData.rooms === 0 ? "" : formData.rooms}
                onChange={(e) =>
                  setFormData({ ...formData, rooms: Number(e.target.value) })
                }
              />
              <Input
                label="Number of Guests"
                type="number"
                // value={formData.guests}
                value={formData.guests === 0 ? "" : formData.guests}
                onChange={(e) =>
                  setFormData({ ...formData, guests: Number(e.target.value) })
                }
              />
              <Input
                label="Distance to Center (km)"
                value={formData.distanceToCenter}
                onChange={(e) =>
                  setFormData({ ...formData, distanceToCenter: e.target.value })
                }
              />
              <Input
                label="Distance to Beach (km)"
                value={formData.distanceToBeach}
                onChange={(e) =>
                  setFormData({ ...formData, distanceToBeach: e.target.value })
                }
              />
            </div>
            <Card className="mt-6 border border-blue-500 shadow-md">
              <CardHeader floated={false} color="blue" className="p-4">
                <Typography variant="h6" className="text-white">
                  Images
                </Typography>
              </CardHeader>
              <CardBody className="p-4">
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(formData.images) &&
                  formData.images.length > 0 ? (
                    formData.images.map((image, index) => (
                      <div key={index} className="group relative h-20 w-20">
                        <img
                          src={image}
                          alt={`Deal Image ${index + 1}`}
                          className="h-full w-full rounded object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index, image)}
                          className="absolute right-0 top-0 flex h-5 w-5 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-red-600 text-xs text-white hover:bg-red-800"
                          title="Remove Image"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <Typography variant="paragraph" className="text-black">
                      No images available.
                    </Typography>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Image Upload */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Upload Images (JPG, JPEG, PNG only, max 5MB each, up to 5 images)
              </label>
              <Input
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png"
                label="Choose Image"
                onChange={(e) => {
                  const files = Array.from(e.target.files);

                  // Check total number of images
                  if (
                    files.length + newImages.length + formData.images.length >
                    5
                  ) {
                    setImageError("You can only upload up to 5 images.");
                    e.target.value = ""; // reset the input
                    return;
                  }

                  // Validate image formats and sizes
                  const error = validateImages(files);
                  if (error) {
                    setImageError(error);
                    e.target.value = ""; // reset the input
                    return;
                  }
                  
                  // Clear any previous errors
                  setImageError("");
                  setNewImages((prevImages) => [...prevImages, ...files]);
                }}
              />
              {imageError && (
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm text-red-500">{imageError}</p>
                  <Button 
                    size="sm" 
                    color="red" 
                    variant="text" 
                    onClick={() => {
                      setImageError("");
                      setNewImages([]); // Clear only the new images
                    }}
                  >
                    Clear Images
                  </Button>
                </div>
              )}
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button
            onClick={handleCloseDialog}
            color="red"
            className="mr-2"
            variant="text"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="green" disabled={loading || isSubmitting}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/*View Deal Dialog */}
      <Dialog open={openViewDialog} handler={handleCloseViewDialog} size="lg">
        <DialogHeader className="flex items-start justify-between bg-white p-4">
          <Typography
            variant="h5"
            className="flex items-center gap-2 text-deep-orange-400"
          >
            {currentDeal ? currentDeal.title : "Deal Details"}
          </Typography>
          <Typography
            variant="h6"
            className="flex items-center gap-2 text-deep-orange-400"
          >
            Tag: {currentDeal ? currentDeal.tag : "Deal Tag"}
          </Typography>
          <div className="flex items-center justify-center gap-2">
            <Tooltip
              content="Edit"
              placement="left"
              className="z-[50000] font-medium text-green-600"
              animate={{
                mount: { scale: 1, x: 0 },
                unmount: { scale: 0, x: 25 },
              }}
            >
              <Button
                variant="text"
                color="green"
                onClick={() => {
                  handleOpenDialog(currentDeal);
                  handleCloseViewDialog();
                }}
                className="p-2"
              >
                <PencilSquareIcon className="h-5 w-5" />
              </Button>
            </Tooltip>
            <Tooltip
              content="Delete"
              placement="top"
              className="z-[50000] font-medium text-red-500"
              color="red"
              animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0, y: 25 },
              }}
            >
              <Button
                variant="text"
                color="red"
                onClick={() => {
                  confirmDelete(currentDeal._id, currentDeal.title);
                  handleCloseViewDialog();
                }}
                className="p-2"
              >
                <TrashIcon className="h-5 w-5" />
              </Button>
            </Tooltip>
            <Tooltip
              content="close"
              placement="right"
              className="z-[50000] font-medium text-purple-500"
              color="purple"
              animate={{
                mount: { scale: 1, x: -0 },
                unmount: { scale: 0, x: -25 },
              }}
            >
              <Button
                variant="text"
                color="purple"
                onClick={handleCloseViewDialog}
                className="p-2"
              >
                <XMarkIcon className="h-5 w-5" />
              </Button>
            </Tooltip>
          </div>
        </DialogHeader>

        <DialogBody className="h-[480px] overflow-y-auto bg-gray-50 p-4 scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-blue-500">
          {currentDeal ? (
            <div className="space-y-12">
              {/* Basic Details Card */}
              <Card className="mt-6 border border-blue-500 shadow-md">
                <CardHeader color="blue" className="p-4">
                  <Typography variant="h6" className="text-white">
                    Basic Details
                  </Typography>
                </CardHeader>
                <CardBody className="p-4">
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Title:
                    </span>{" "}
                    {currentDeal.title || "N/A"}
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Description:
                    </span>{" "}
                    {currentDeal.description || "N/A"}
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Low Deposite:
                    </span>{" "}
                    {currentDeal.LowDeposite || "N/A"}
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Available Countries:
                    </span>{" "}
                    {Array.isArray(currentDeal.availableCountries)
                      ? currentDeal.availableCountries.join(", ")
                      : "N/A"}
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Destination:
                    </span>{" "}
                    {currentDeal.destination
                      ? currentDeal.destination.name
                      : "N/A"}
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Board Basis:
                    </span>{" "}
                    {currentDeal.boardBasis.name || "N/A"}
                  </Typography>
                  <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                    <Typography variant="paragraph" className="text-black">
                      <span className="font-bold text-deep-orange-500">
                        Distance to Center:
                      </span>{" "}
                      {currentDeal.distanceToCenter || "N/A"}
                    </Typography>
                    <Typography variant="paragraph" className="text-black">
                      <span className="font-bold text-deep-orange-500">
                        Distance to Beach:
                      </span>{" "}
                      {currentDeal.distanceToBeach || "N/A"}
                    </Typography>
                  </div>
                  <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
                    <Typography variant="paragraph" className="text-black">
                      <span className="font-bold text-deep-orange-500">
                        Nights:
                      </span>{" "}
                      {currentDeal.days || "N/A"}
                    </Typography>
                    <Typography variant="paragraph" className="text-black">
                      <span className="font-bold text-deep-orange-500">
                        Rooms:
                      </span>{" "}
                      {currentDeal.rooms || "N/A"}
                    </Typography>
                    <Typography variant="paragraph" className="text-black">
                      <span className="font-bold text-deep-orange-500">
                        Guests:
                      </span>{" "}
                      {currentDeal.guests || "N/A"}
                    </Typography>
                  </div>
                </CardBody>
              </Card>

              {/* Flags & Categories Card */}
              <Card className="border border-blue-500 shadow-md">
                <CardHeader color="blue" className="p-4">
                  <Typography variant="h6" className="text-white">
                    Flags & Categories
                  </Typography>
                </CardHeader>
                <CardBody className="p-4">
                  {/* Boolean flags */}
                  <div className="mb-4 flex items-center space-x-6">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        color="orange"
                        checked={currentDeal.isTopDeal}
                        disabled
                      />
                      <Typography variant="small">Top Deal</Typography>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        color="red"
                        checked={currentDeal.isHotdeal}
                        disabled
                      />
                      <Typography variant="small">Hot Deal</Typography>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        color="green"
                        checked={currentDeal.isFeatured}
                        disabled
                      />
                      <Typography variant="small">Featured</Typography>
                    </div>
                  </div>

                  {/* Holiday categories list */}
                  <Typography
                    variant="subtitle2"
                    className="mb-2 font-bold text-deep-orange-500"
                  >
                    Categories:
                  </Typography>
                  {Array.isArray(currentDeal.holidaycategories) &&
                  currentDeal.holidaycategories.length > 0 ? (
                    <ul className="list-disc pl-6 text-black">
                      {currentDeal.holidaycategories.map((catItem, idx) => {
                        const catId =
                          typeof catItem === "object" ? catItem._id : catItem;
                        const catObj = holidaycategories.find(
                          (h) => h._id === catId,
                        );
                        const displayName = catObj ? catObj.name : catId;
                        return <li key={idx}>{displayName}</li>;
                      })}
                    </ul>
                  ) : (
                    <Typography variant="paragraph" className="text-black">
                      No categories selected.
                    </Typography>
                  )}
                </CardBody>
              </Card>

              {/* Itinerary Card */}
              <Card className="border border-blue-500 font-medium shadow-md">
                <CardHeader color="blue" className="p-4">
                  <Typography variant="h6" className="text-white">
                    Itinerary
                  </Typography>
                </CardHeader>
                <CardBody className="p-4">
                  {currentDeal.itinerary && currentDeal.itinerary.length > 0 ? (
                    <ol className="list-decimal space-y-2 pl-5 text-black">
                      {currentDeal.itinerary.map((item, index) => (
                        <li key={index}>
                          <strong>{item.title}</strong>
                          <p>{item.description}</p>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <Typography variant="paragraph" className="text-black">
                      No itinerary provided.
                    </Typography>
                  )}
                </CardBody>
              </Card>

              {/* Price Details Card */}
              <Card className="border border-blue-500 font-medium shadow-md">
                <CardHeader color="blue" className="p-4">
                  <Typography variant="h6" className="text-white">
                    Price Details
                  </Typography>
                </CardHeader>

                <CardBody className="space-y-6 p-4">
                  {currentDeal.prices && currentDeal.prices.length > 0 ? (
                    currentDeal.prices.map((price, pIndex) => {
                      const isExpanded = expandedIndices.includes(pIndex);
                      return (
                        <div
                          key={pIndex}
                          className="space-y-3 rounded-lg border border-gray-300 bg-white p-4"
                        >
                          <Typography
                            variant="subtitle1"
                            className="text-deep-orange-500"
                          >
                            Price Entry {pIndex + 1}
                          </Typography>

                          {/* Summary View */}
                          <div className="grid grid-cols-1 gap-3 text-sm text-black md:grid-cols-2">
                            <div>
                              <strong>Country:</strong> {price.country || "N/A"}
                            </div>
                            <div>
                              <strong>Hotel:</strong>{" "}
                              {(price.hotel && price.hotel.name) || "N/A"}
                            </div>
                            <div>
                              <strong>Start Date:</strong>{" "}
                              {price.startdate
                                ? new Date(price.startdate).toLocaleDateString()
                                : "N/A"}
                            </div>
                            <div>
                              <strong>Airport:</strong>{" "}
                              {price.airport && price.airport.length > 0
                                ? price.airport
                                    .map((airportId) => {
                                      const airportObj = airports.find(
                                        (a) => a._id === airportId,
                                      );
                                      return airportObj
                                        ? `${airportObj.name} (${airportObj.code})`
                                        : "Unknown Airport";
                                    })
                                    .join(", ")
                                : "N/A"}
                            </div>
                            <div>
                              <strong>Price:</strong> {price.price || "N/A"}
                            </div>
                          </div>

                          {/* View More / Less */}
                          <div>
                            <Button
                              size="sm"
                              variant="text"
                              className="text-blue-600 underline"
                              onClick={() => toggleExpand(pIndex)}
                            >
                              {isExpanded ? "View Less" : "View More"}
                            </Button>
                          </div>

                          {/* Expanded Details */}
                          {isExpanded && (
                            <div className="space-y-3 text-sm text-black">
                              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <div>
                                  <strong>End Date:</strong>{" "}
                                  {price.enddate
                                    ? new Date(
                                        price.enddate,
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </div>
                              </div>

                              {price.flightDetails && (
                                <>
                                  <Typography
                                    variant="subtitle2"
                                    className="mt-3 text-deep-orange-500"
                                  >
                                    Flight Details
                                  </Typography>
                                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <div>
                                      <strong>Outbound Departure:</strong>{" "}
                                      {price.flightDetails.outbound
                                        .departureTime || "N/A"}
                                    </div>
                                    <div>
                                      <strong>Outbound Arrival:</strong>{" "}
                                      {price.flightDetails.outbound
                                        .arrivalTime || "N/A"}
                                    </div>
                                    <div>
                                      <strong>Outbound Airline:</strong>{" "}
                                      {price.flightDetails.outbound.airline ||
                                        "N/A"}
                                    </div>
                                    <div>
                                      <strong>Outbound Flight Number:</strong>{" "}
                                      {price.flightDetails.outbound
                                        .flightNumber || "N/A"}
                                    </div>
                                    <div>
                                      <strong>Return Departure:</strong>{" "}
                                      {price.flightDetails.returnFlight
                                        .departureTime || "N/A"}
                                    </div>
                                    <div>
                                      <strong>Return Arrival:</strong>{" "}
                                      {price.flightDetails.returnFlight
                                        .arrivalTime || "N/A"}
                                    </div>
                                    <div>
                                      <strong>Return Airline:</strong>{" "}
                                      {price.flightDetails.returnFlight
                                        .airline || "N/A"}
                                    </div>
                                    <div>
                                      <strong>Return Flight Number:</strong>{" "}
                                      {price.flightDetails.returnFlight
                                        .flightNumber || "N/A"}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <Typography variant="paragraph" className="text-black">
                      No price details available.
                    </Typography>
                  )}
                </CardBody>
              </Card>

              {/* Images Card */}
              <Card className="border border-blue-500 shadow-md">
                <CardHeader color="blue" className="p-4">
                  <Typography variant="h6" className="text-white">
                    Images
                  </Typography>
                </CardHeader>
                <CardBody className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(currentDeal.images) &&
                    currentDeal.images.length > 0 ? (
                      currentDeal.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Deal Image ${index + 1}`}
                          className="h-20 w-20 rounded object-cover"
                        />
                      ))
                    ) : (
                      <Typography variant="paragraph" className="text-black">
                        No images available.
                      </Typography>
                    )}
                  </div>
                </CardBody>
              </Card>

              <Card className="border border-blue-500 shadow-md">
                <CardHeader color="blue" className="p-4">
                  <Typography variant="h6" className="text-white">
                    Additional Details
                  </Typography>
                </CardHeader>
                <CardBody className="space-y-4 p-4 text-black">
                  {/* whatsIncluded */}
                  <div>
                    <div className="flex items-center justify-between">
                      <Typography className="font-bold text-deep-orange-500">
                        What's Included
                      </Typography>
                      <Button
                        size="sm"
                        color="blue"
                        varient="gradient"
                        onClick={() => toggleSection("whatsIncluded")}
                      >
                        {expandedSection === "whatsIncluded"
                          ? "View Less"
                          : `View More`}
                      </Button>
                    </div>
                    {expandedSection === "whatsIncluded" && (
                      <ul className="mt-2 list-disc pl-5">
                        {currentDeal.whatsIncluded &&
                        currentDeal.whatsIncluded.length > 0 ? (
                          currentDeal.whatsIncluded.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))
                        ) : (
                          <li>No details available.</li>
                        )}
                      </ul>
                    )}
                  </div>

                  {/* exclusiveAdditions */}
                  <div>
                    <div className="flex items-center justify-between">
                      <Typography className="font-bold text-deep-orange-500">
                        Exclusive Additions
                      </Typography>
                      <Button
                        size="sm"
                        varient="gradient"
                        color="blue"
                        onClick={() => toggleSection("exclusiveAdditions")}
                      >
                        {expandedSection === "exclusiveAdditions"
                          ? "View Less"
                          : "View More"}
                      </Button>
                    </div>
                    {expandedSection === "exclusiveAdditions" && (
                      <ul className="mt-2 list-disc pl-5">
                        {currentDeal.exclusiveAdditions &&
                        currentDeal.exclusiveAdditions.length > 0 ? (
                          currentDeal.exclusiveAdditions.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))
                        ) : (
                          <li>No details available.</li>
                        )}
                      </ul>
                    )}
                  </div>

                  {/* termsAndConditions */}
                  <div>
                    <div className="flex items-center justify-between">
                      <Typography className="font-bold text-deep-orange-500">
                        Terms & Conditions
                      </Typography>
                      <Button
                        size="sm"
                        color="blue"
                        varient="gradient"
                        onClick={() => toggleSection("termsAndConditions")}
                      >
                        {expandedSection === "termsAndConditions"
                          ? "View Less"
                          : "View More"}
                      </Button>
                    </div>
                    {expandedSection === "termsAndConditions" && (
                      <ul className="mt-2 list-disc pl-5">
                        {currentDeal.termsAndConditions &&
                        currentDeal.termsAndConditions.length > 0 ? (
                          currentDeal.termsAndConditions.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))
                        ) : (
                          <li>No details available.</li>
                        )}
                      </ul>
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>
          ) : (
            <Typography variant="h6" className="text-black">
              No deal details available.
            </Typography>
          )}
        </DialogBody>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} handler={setOpenDeleteDialog}>
        <DialogHeader>Confirm Delete</DialogHeader>
        <DialogBody>
          Are you sure you want to delete{" "}
          <span className="font-semibold text-red-600">{dealName}</span>?
        </DialogBody>
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
};

export default ManageDeals;
