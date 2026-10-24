export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:8080",
  },
  brand: {
    name: "TASTY BURGER",
    phone: "011-4567-8910",
    phoneLink: "tel:01145678910",
    address: {
      street: "Connaught Place",
      city: "New Delhi",
      zip: "110001",
      country: "India",
    },
    hours: {
      weekdays: "Mon-Fri: 11:00AM - 11:00PM",
      saturday: "Saturday: 10:00AM - 11:30PM",
      sunday: "Sunday: 12:00PM - 11:00PM",
    },
    upiId: "tastyburger@upi",
  },
  delivery: {
    freeThreshold: 499,
    fee: 40,
  },
  tax: {
    gstRate: 0.05,
  },
  stats: {
    outlets: "150+",
    dailyCustomers: "50k+",
    yearsOfTrust: "12+",
  },
  razorpay: {
    keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_HERE",
    currency: "INR",
    companyName: "Tasty Burger",
  },
};
