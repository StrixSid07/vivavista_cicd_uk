import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Badge,
  Select,
  Option,
  Card,
  CardHeader,
  CardBody,
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
  PhoneIcon,
  EnvelopeIcon,
  EyeIcon,
  CheckIcon,
  ClockIcon,
  XMarkIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import axios from "@/utils/axiosInstance";

export function ManageBooking() {
  const [bookings, setBookings] = useState([]);
  const [deals, setDeals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [formData, setFormData] = useState({
    dealId: "",
    name: "",
    email: "",
    phone: "",
    message: "",
    airport: "",
    selectedDate: "",
    returnDate: "",
    adults: 1,
    children: 0,
    selectedPrice: null,
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [bookingName, setBookingName] = useState("");
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [statusBooking, setStatusBooking] = useState(null);
  const [statusValue, setStatusValue] = useState("pending");
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [emailData, setEmailData] = useState({
    name: "",
    email: "",
    destination: "",
    bookingRef: "",
    pax: 1,
    departureDate: "",
    nights: 0,
  });

  useEffect(() => {
    fetchBookings();
    fetchDeals();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get("/bookings");
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setAlert({ message: "Error fetching bookings", type: "red" });
    }
  };

  const fetchDeals = async () => {
    try {
      const response = await axios.get("/bookings/deals");
      setDeals(response.data);
    } catch (error) {
      console.error("Error fetching deals:", error);
      setAlert({ message: "Error fetching deals", type: "red" });
    }
  };

  const handleOpenDialog = (booking = null) => {
    if (booking) {
      // booking.dealId might be populated as an object { _id, title, ... }
      const bookingDealId =
        typeof booking.dealId === "object"
          ? booking.dealId._id
          : booking.dealId;

      // find the selected deal from your fetched list
      const selected = deals.find((d) => d.id === bookingDealId);

      // match the exact price block
      const bookingDate = booking.selectedDate.split("T")[0];
      const matchedPrice = selected?.prices.find(
        (p) =>
          p.airport === booking.airport &&
          p.startdate.split("T")[0] === bookingDate,
      );

      setSelectedDeal(selected);
      setSelectedPrice(matchedPrice);

      // now set your formData with the string ID, not the full object
      setFormData({
        dealId: bookingDealId,
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        message: booking.message,
        airport: booking.airport,
        selectedDate: bookingDate,
        returnDate: booking.returnDate ? booking.returnDate.split("T")[0] : "",
        adults: booking.adults,
        children: booking.children,
      });
    } else {
      // reset
      setSelectedDeal(null);
      setSelectedPrice(null);
      setFormData({
        dealId: "",
        name: "",
        email: "",
        phone: "",
        message: "",
        airport: "",
        selectedDate: "",
        returnDate: "",
        adults: 1,
        children: 0,
      });
    }
    setCurrentBooking(booking);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentBooking(null);
    setAlert({ message: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (currentBooking) {
        console.log(currentBooking._id);
        await axios.put(`/bookings/update/${currentBooking._id}`, formData);
        setAlert({ message: "Booking updated successfully!", type: "green" });
      } else {
        console.log(formData);
        await axios.post("/bookings/createbyadmin", formData);
        setAlert({ message: "Booking created successfully!", type: "green" });
      }
      fetchBookings();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving booking:", error);
      setAlert({ message: "Error saving booking", type: "red" });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id, name) => {
    setDeleteId(id);
    setBookingName(name);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/bookings/${id}`);
      setAlert({ message: "Booking deleted successfully!", type: "green" });
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
      setAlert({ message: "Error deleting booking", type: "red" });
    } finally {
      setOpenDeleteDialog(false);
      setDeleteId(null);
    }
  };

  // Open the status dialog for a given booking
  const handleOpenStatusDialog = (booking) => {
    setStatusBooking(booking);
    setStatusValue(booking.status || "pending");
    setOpenStatusDialog(true);
  };

  // Close/reset the status dialog
  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
    setStatusBooking(null);
  };

  const handleStatusSubmit = async () => {
    try {
      await axios.put(`/bookings/${statusBooking._id}/status`, {
        status: statusValue,
      });
      fetchBookings(); // re-fetch your list
      setOpenStatusDialog(false);
    } catch (error) {
      console.error("Error updating status:", error);
      // you can show an alert here
    }
  };

  const handleOpenViewDialog = (booking) => {
    setCurrentBooking(booking);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setCurrentBooking(null);
  };

  const handleOpenEmailDialog = (booking) => {
    const formattedDeparture = booking.selectedDate
      ? booking.selectedDate.split("T")[0]
      : "";
    setCurrentBooking(booking);
    console.log(booking);
    const selectedDeal = deals.find((d) => d.id === booking.dealId);
    setEmailData({
      name: booking.name,
      email: booking.email,
      destination: booking.dealId.title,
      bookingRef: booking._id,
      pax: booking.adults,
      departureDate: formattedDeparture,
      nights: booking.nights || 0,
      days: booking.days || 0,
    });
    setSelectedDeal(selectedDeal);
    setOpenEmailDialog(true);
  };

  const handleCloseEmailDialog = () => {
    setOpenEmailDialog(false);
    setAlert({ message: "", type: "" });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/mail/send-booking-info", emailData);
      setAlert({ message: "Booking confirmation sent!", type: "green" });
      handleCloseEmailDialog();
    } catch (error) {
      console.error("Error sending email:", error);
      setAlert({ message: "Failed to send confirmation email.", type: "red" });
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
          Create New Booking
        </Button>
      </div>

      {/* Main Card */}
      <Card className="h-[calc(100vh-150px)] overflow-y-auto rounded-xl p-4 shadow-lg scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-blue-500">
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <Typography>No bookings found.</Typography>
          ) : (
            bookings.map((booking) => (
              <Card
                key={booking._id}
                className="group p-4 shadow-md transition-colors duration-300 ease-in-out hover:bg-blue-50"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Left half: booking info */}
                  <div className="flex-1 space-y-1">
                    {/* Name */}
                    <Typography
                      variant="h5"
                      color="deep-orange"
                      className="font-semibold"
                    >
                      {booking.name}
                    </Typography>

                    {/* Phone */}
                    <Typography className="flex items-center gap-2">
                      <PhoneIcon className="h-5 w-5 text-blue-500" />
                      <a
                        href={`tel:${booking.phone}`}
                        className="font-bold text-blue-700 underline transition-colors duration-300 ease-in-out hover:text-deep-orange-500"
                      >
                        {booking.phone}
                      </a>
                    </Typography>

                    {/* Email */}
                    <Typography className="flex items-center gap-2">
                      <EnvelopeIcon className="h-5 w-5 text-blue-500 " />
                      <a
                        href={`mailto:${booking.email}`}
                        className="font-bold text-blue-700 underline transition-colors duration-300 ease-in-out hover:text-deep-orange-500"
                      >
                        {booking.email}
                      </a>
                    </Typography>

                    {/* Deal title */}
                    <Typography color="green" className="mt-1 font-medium">
                      Deal: {booking.dealId.title}
                    </Typography>

                    {/* Adults */}
                    <Typography color="black">
                      Adults: {booking.adults}
                    </Typography>

                    {/* Price per person */}
                    <Typography color="black">
                      Price:{" "}
                      {booking.selectedPrice?.price
                        ? `£${booking.selectedPrice.price}`
                        : "N/A"}
                      / per person
                    </Typography>

                    {/* Total price = price per person × adults */}
                    <Typography color="black" className="font-semibold">
                      Total:{" "}
                      {booking.selectedPrice?.price
                        ? `£${booking.selectedPrice.price * booking.adults}`
                        : "N/A"}
                    </Typography>

                    {/* Created date */}
                    <Typography
                      color="blue"
                      className="flex items-center gap-1 font-semibold"
                    >
                      <CalendarDaysIcon className="h-5 w-5" />
                      Request Date:{" "}
                      {new Date(booking.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </Typography>
                  </div>

                  {/* Right half: status + actions */}
                  <div className="flex flex-col items-end gap-4">
                    {/* Status badge */}
                    <div className="flex items-center gap-2">
                      {booking.status === "pending" && (
                        <Badge
                          content={
                            <ClockIcon
                              className="h-4 w-4 text-white"
                              strokeWidth={2.5}
                            />
                          }
                          className="border-2 border-white bg-gradient-to-tr from-amber-400 to-amber-600 shadow-lg shadow-black/20"
                        >
                          <Button
                            onClick={() => handleOpenStatusDialog(booking)}
                            color="blue"
                            className="capitalize"
                          >
                            {booking.status}
                          </Button>
                        </Badge>
                      )}
                      {booking.status === "confirmed" && (
                        <Badge
                          content={
                            <CheckIcon
                              className="h-4 w-4 text-white"
                              strokeWidth={2.5}
                            />
                          }
                          className="border-2 border-white bg-gradient-to-tr from-green-400 to-green-600 shadow-lg shadow-black/20"
                        >
                          <Button
                            onClick={() => handleOpenStatusDialog(booking)}
                            color="blue"
                            className="capitalize"
                          >
                            {booking.status}
                          </Button>
                        </Badge>
                      )}
                      {booking.status === "cancelled" && (
                        <Badge
                          content={
                            <XMarkIcon
                              className="h-4 w-4 text-white"
                              strokeWidth={2.5}
                            />
                          }
                          className="border-2 border-white bg-gradient-to-tr from-red-400 to-red-600 shadow-lg shadow-black/20"
                        >
                          <Button
                            onClick={() => handleOpenStatusDialog(booking)}
                            color="blue"
                            className="capitalize"
                          >
                            {booking.status}
                          </Button>
                        </Badge>
                      )}
                    </div>

                    {/* Status dialog opener */}
                    <Tooltip
                      content="View"
                      placement="left"
                      className="font-medium text-blue-600"
                      animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
                      }}
                    >
                      <Button
                        variant="text"
                        color="blue"
                        onClick={() => handleOpenViewDialog(booking)}
                        className="p-2"
                      >
                        <EyeIcon strokeWidth={2} className="h-5 w-5" />
                      </Button>
                    </Tooltip>

                    {/* Edit */}
                    <Tooltip
                      content="Edit"
                      placement="left"
                      className="font-medium text-green-600"
                      animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
                      }}
                    >
                      <Button
                        variant="text"
                        color="green"
                        onClick={() => handleOpenDialog(booking)}
                        className="p-2"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </Button>
                    </Tooltip>

                    {/* Delete */}
                    <Tooltip
                      content="Delete"
                      placement="left"
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
                        onClick={() => confirmDelete(booking._id, booking.name)}
                        className="p-2"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </Button>
                    </Tooltip>
                    {/* Actions */}
                    <div className="flex flex-col items-end gap-4">
                      <Button
                        onClick={() => handleOpenEmailDialog(booking)}
                        color="blue"
                      >
                        Send Confirmation Email
                      </Button>
                      {/* Other action buttons (view, edit, delete) */}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>

      {/* View Dilog */}
      <Dialog open={openViewDialog} handler={handleCloseViewDialog} size="lg">
        <DialogHeader className="flex items-start justify-between bg-white p-4">
          <Typography
            variant="h5"
            className="flex items-center gap-2 text-deep-orange-400"
          >
            Booking Details
          </Typography>
          <div className="flex items-center justify-center gap-2">
            <Tooltip
              content="Edit"
              placement="left"
              className="z-[50000] font-medium text-green-600"
            >
              <Button variant="text" color="green" className="p-2">
                <PencilSquareIcon className="h-5 w-5" />
              </Button>
            </Tooltip>
            <Tooltip
              content="Delete"
              placement="top"
              className="z-[50000] font-medium text-red-500"
            >
              <Button variant="text" color="red" className="p-2">
                <TrashIcon className="h-5 w-5" />
              </Button>
            </Tooltip>
            <Tooltip
              content="Close"
              placement="right"
              className="z-[50000] font-medium text-purple-500"
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
          {currentBooking ? (
            <div className="mt-8 space-y-12">
              {/* Basic Details Card */}
              <Card className="border border-blue-500 shadow-md">
                <CardHeader color="blue" className="p-4">
                  <Typography variant="h6" className="text-white">
                    Booking Information
                  </Typography>
                </CardHeader>
                <CardBody className="p-4">
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Name:
                    </span>{" "}
                    {currentBooking.name}
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Email:
                    </span>{" "}
                    {currentBooking.email}
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Phone:
                    </span>{" "}
                    {currentBooking.phone}
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Message:
                    </span>{" "}
                    {currentBooking.message || "N/A"}
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Airport:
                    </span>{" "}
                    {currentBooking.airport}
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Selected Date:
                    </span>{" "}
                    {new Date(currentBooking.selectedDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Return Date:
                    </span>{" "}
                    {new Date(currentBooking.returnDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Adults:
                    </span>{" "}
                    {currentBooking.adults}
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Children:
                    </span>{" "}
                    {currentBooking.children}
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Status:
                    </span>{" "}
                    {currentBooking.status}
                  </Typography>
                </CardBody>
              </Card>
              {/* Flight Details Card */}
              <Card className="border border-blue-500 shadow-md">
                <CardHeader color="blue" className="p-4">
                  <Typography variant="h6" className="text-white">
                    Flight Details
                  </Typography>
                </CardHeader>
                <CardBody className="p-4">
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Outbound Flight:
                    </span>
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Airline:
                    </span>{" "}
                    {
                      currentBooking.selectedPrice.flightDetails.outbound
                        .airline
                    }
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Flight Number:
                    </span>{" "}
                    {
                      currentBooking.selectedPrice.flightDetails.outbound
                        .flightNumber
                    }
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Departure Time:
                    </span>{" "}
                    {
                      currentBooking.selectedPrice.flightDetails.outbound
                        .departureTime
                    }
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Arrival Time:
                    </span>{" "}
                    {
                      currentBooking.selectedPrice.flightDetails.outbound
                        .arrivalTime
                    }
                  </Typography>

                  <Typography variant="paragraph" className="mt-4 text-black">
                    <span className="font-bold text-deep-orange-500">
                      Return Flight:
                    </span>
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Airline:
                    </span>{" "}
                    {
                      currentBooking.selectedPrice.flightDetails.returnFlight
                        .airline
                    }
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Flight Number:
                    </span>{" "}
                    {
                      currentBooking.selectedPrice.flightDetails.returnFlight
                        .flightNumber
                    }
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Departure Time:
                    </span>{" "}
                    {
                      currentBooking.selectedPrice.flightDetails.returnFlight
                        .departureTime
                    }
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Arrival Time:
                    </span>{" "}
                    {
                      currentBooking.selectedPrice.flightDetails.returnFlight
                        .arrivalTime
                    }
                  </Typography>
                </CardBody>
              </Card>

              {/* Price Details Card */}
              <Card className="border border-blue-500 shadow-md">
                <CardHeader color="blue" className="p-4">
                  <Typography variant="h6" className="text-white">
                    Price Details
                  </Typography>
                </CardHeader>
                <CardBody className="p-4">
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Price:
                    </span>{" "}
                    ${currentBooking.selectedPrice.price}
                  </Typography>
                </CardBody>
              </Card>

              {/* Selected Hotel Card */}
              <Card className="border border-blue-500 shadow-md">
                <CardHeader color="blue" className="p-4">
                  <Typography variant="h6" className="text-white">
                    Selected Hotel
                  </Typography>
                </CardHeader>
                <CardBody className="p-4">
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Hotel Name:
                    </span>{" "}
                    {currentBooking.selectedHotel.name}
                  </Typography>
                </CardBody>
              </Card>
            </div>
          ) : (
            <Typography variant="h6" className="text-black">
              No booking details available.
            </Typography>
          )}
        </DialogBody>
      </Dialog>

      {/* Send Email Dialog */}
      <Dialog open={openEmailDialog} handler={handleCloseEmailDialog} size="md">
        <DialogHeader>Send Booking Confirmation</DialogHeader>
        <DialogBody className="h-[480px] space-y-4 overflow-y-auto bg-gray-50 p-4 scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-blue-500">
          {alert.message && (
            <Alert
              color={alert.type}
              onClose={() => setAlert({ message: "", type: "" })}
            >
              {alert.message}
            </Alert>
          )}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {/* Deal */}
            <Select
              label="Select Deal"
              value={emailData.dealId || ""}
              onChange={(dealId) => {
                const deal = deals.find((d) => d.id === dealId);
                setSelectedDeal(deal);
                setSelectedPrice(null);
                setEmailData((prev) => ({
                  ...prev,
                  dealId,
                  destination: deal?.title || "", // Set destination to the title of the selected deal
                  selectedDate: "",
                  returnDate: "",
                }));
              }}
            >
              {deals.map((deal) => (
                <Option key={deal.id} value={deal.id}>
                  {deal.title}
                </Option>
              ))}
            </Select>

            {/* Dates (only for setting dates) */}
            {selectedDeal && (
              <Select
                label="Select Departure & Return Dates"
                value={selectedPrice?.startdate || ""}
                onChange={(iso) => {
                  const price = selectedDeal.prices.find(
                    (p) => new Date(p.startdate).toISOString() === iso,
                  );
                  setSelectedPrice(price);
                  setEmailData((prev) => ({
                    ...prev,
                    selectedDate: price.startdate.split("T")[0],
                    returnDate: price.enddate.split("T")[0],
                  }));
                }}
              >
                {selectedDeal.prices.map((p, i) => (
                  <Option key={i} value={new Date(p.startdate).toISOString()}>
                    {p.airport} – {new Date(p.startdate).toLocaleDateString()} →{" "}
                    {new Date(p.enddate).toLocaleDateString()} (£{p.price})
                  </Option>
                ))}
              </Select>
            )}

            {/* Read-only basics */}
            <Input label="Name" value={emailData.name} readOnly />
            <Input
              label="Email"
              type="email"
              value={emailData.email}
              readOnly
            />
            <Input
              label="Booking Reference"
              value={emailData.bookingRef}
              readOnly
            />

            {/* Destination w/ clear button */}
            <div className="relative">
              <Input
                label="Destination"
                value={emailData.destination}
                onChange={(e) =>
                  setEmailData((prev) => ({
                    ...prev,
                    destination: e.target.value,
                  }))
                }
                required
              />
              {emailData.destination && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 transform"
                  onClick={() =>
                    setEmailData((prev) => ({ ...prev, destination: "" }))
                  }
                >
                  <XMarkIcon className="h-4 w-4 text-blue-400 hover:text-blue-600" />
                </button>
              )}
            </div>

            {/* Pax + Dates editable */}
            <Input
              label="Number of Travellers"
              type="number"
              value={emailData.pax}
              onChange={(e) =>
                setEmailData((prev) => ({ ...prev, pax: e.target.value }))
              }
              required
            />
            <Input
              label="Departure Date"
              type="date"
              value={emailData.selectedDate}
              onChange={(e) =>
                setEmailData((prev) => ({
                  ...prev,
                  selectedDate: e.target.value,
                }))
              }
              required
            />
            <Input
              label="Return Date"
              type="date"
              value={emailData.returnDate}
              onChange={(e) =>
                setEmailData((prev) => ({
                  ...prev,
                  returnDate: e.target.value,
                }))
              }
              required
            />
            <Input
              label="Nights"
              type="number"
              value={emailData.nights}
              onChange={(e) =>
                setEmailData({ ...emailData, nights: e.target.value })
              }
            />
            <Input
              label="Days"
              type="number"
              value={emailData.days}
              onChange={(e) =>
                setEmailData({ ...emailData, days: e.target.value })
              }
            />

            <Button type="submit" color="green">
              Send Email
            </Button>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleCloseEmailDialog} color="red">
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>

      {/* ——— Status Update Dialog ——— */}
      <Dialog
        open={openStatusDialog}
        handler={handleCloseStatusDialog}
        size="sm"
      >
        <DialogHeader>Update Booking Status</DialogHeader>
        <DialogBody className="space-y-4">
          <Select
            label="Status"
            value={statusValue}
            onChange={(value) => setStatusValue(value)}
          >
            <Option value="pending">Pending</Option>
            <Option value="confirmed">Confirmed</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={handleCloseStatusDialog}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button onClick={handleStatusSubmit} color="green">
            Save
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Add/Edit Booking Dialog */}
      <Dialog open={openDialog} handler={handleCloseDialog} size="md">
        <DialogHeader className="flex items-center justify-between">
          {currentBooking ? "Edit Booking" : "Create Booking"}
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
            {/* Select Deal Title */}
            {/* <Select
              label="Select Deal"
              value={formData.dealId}
              onChange={(dealId) => {
                const selected = deals.find((deal) => deal.id === dealId);
                setFormData({
                  ...formData,
                  dealId,
                  airport: "",
                  selectedDate: "",
                  returnDate: "",
                });
                setSelectedDeal(selected);
                setSelectedPrice(null);
              }}
            >
              {deals.map((deal) => (
                <Option key={deal.id} value={deal.id}>
                  {deal.title}
                </Option>
              ))}
            </Select> */}
            <Select
              label="Select Deal"
              value={formData.dealId}
              onChange={(dealId) => {
                const selected = deals.find((deal) => deal.id === dealId);
                setFormData({
                  ...formData,
                  dealId,
                  airport: "",
                  selectedDate: "",
                  returnDate: "",
                });
                setSelectedDeal(selected);
                setSelectedPrice(null);
              }}
            >
              {deals.map((deal) => (
                <Option key={deal.id} value={deal.id}>
                  {deal.title}
                </Option>
              ))}
            </Select>

            {/* Show price options based on selected deal */}
            {selectedDeal && (
              <Select
                label="Select Airport & Dates"
                value={selectedPrice?.startdate}
                onChange={(date) => {
                  const price = selectedDeal.prices.find(
                    (p) => new Date(p.startdate).toISOString() === date,
                  );
                  setSelectedPrice(price);
                  setFormData({
                    ...formData,
                    airport: price.airport,
                    selectedDate: price.startdate.split("T")[0],
                    returnDate: price.enddate.split("T")[0],
                    selectedPrice: price,
                  });
                }}
              >
                {selectedDeal.prices.map((price, index) => (
                  <Option
                    key={index}
                    value={new Date(price.startdate).toISOString()}
                  >
                    {price.airport} –{" "}
                    {new Date(price.startdate).toLocaleDateString()} →{" "}
                    {new Date(price.enddate).toLocaleDateString()} (£
                    {price.price})
                  </Option>
                ))}
              </Select>
            )}

            {/* Display hotel & price - read-only */}
            {selectedPrice && (
              <>
                <Input label="Hotel" value={selectedPrice.hotel} readOnly />
                <Input
                  label="Price"
                  value={`£${selectedPrice.price}`}
                  readOnly
                />
              </>
            )}

            {/* Remaining form inputs */}
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
            <Input
              label="Message"
              value={formData.message}
              readOnly
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            />
            <Input
              label="Airport"
              readOnly
              value={formData.airport}
              onChange={(e) =>
                setFormData({ ...formData, airport: e.target.value })
              }
            />
            <Input
              label="Selected Date"
              readOnly
              type="date"
              value={formData.selectedDate}
              onChange={(e) =>
                setFormData({ ...formData, selectedDate: e.target.value })
              }
            />
            <Input
              label="Return Date"
              readOnly
              type="date"
              value={formData.returnDate}
              onChange={(e) =>
                setFormData({ ...formData, returnDate: e.target.value })
              }
            />
            <Input
              label="Adults"
              type="number"
              value={formData.adults}
              onChange={(e) =>
                setFormData({ ...formData, adults: e.target.value })
              }
              required
            />
            <Input
              label="Children"
              type="number"
              value={formData.children}
              onChange={(e) =>
                setFormData({ ...formData, children: e.target.value })
              }
            />
            <Button type="submit" color="blue" disabled={loading}>
              {loading
                ? "Loading..."
                : currentBooking
                ? "Update Booking"
                : "Create Booking"}
            </Button>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleCloseDialog} color="red">
            Cancel
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
            Are you sure you want to delete the booking for {bookingName}?
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button onClick={() => setOpenDeleteDialog(false)} color="red">
            Cancel
          </Button>
          <Button onClick={() => handleDelete(deleteId)} color="green">
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default ManageBooking;
