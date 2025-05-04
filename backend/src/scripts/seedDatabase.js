import mongoose from 'mongoose';
import Property from '../models/Property.js';
import dotenv from 'dotenv';

dotenv.config();

const hotels = [
  {
    title: "Grand Luxury Resort & Spa",
    description: "Experience unparalleled luxury at our beachfront resort featuring world-class amenities, private pools, and stunning ocean views.",
    location: "Maldives",
    price: 1200,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "pool", "spa", "restaurant", "ac", "hotTub"],
    maxGuests: 4,
    rating: 4.8,
    hasSpecialOffer: true,
    specialOfferDetails: "Book 7 nights, get 2 nights free + complimentary spa treatment"
  },
  {
    title: "Mountain View Chalet",
    description: "Cozy mountain retreat with panoramic views, perfect for winter sports enthusiasts and nature lovers.",
    location: "Swiss Alps",
    price: 850,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "ac", "tv", "parking"],
    maxGuests: 6,
    rating: 4.6,
    hasSpecialOffer: false
  },
  {
    title: "Urban Boutique Hotel",
    description: "Stylish city center hotel with modern design, rooftop bar, and easy access to major attractions.",
    location: "New York",
    price: 450,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
    ],
    amenities: ["wifi", "gym", "restaurant", "ac", "tv"],
    maxGuests: 2,
    rating: 4.5,
    hasSpecialOffer: true,
    specialOfferDetails: "Weekend stay includes complimentary breakfast and late checkout"
  },
  {
    title: "Desert Oasis Resort",
    description: "Luxurious desert retreat with private pools, spa treatments, and authentic local experiences.",
    location: "Dubai",
    price: 950,
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "pool", "spa", "gym", "restaurant", "ac", "hotTub"],
    maxGuests: 4,
    rating: 4.9,
    hasSpecialOffer: true,
    specialOfferDetails: "Book 5 nights, get 1 night free + desert safari experience"
  },
  {
    title: "Historic Palace Hotel",
    description: "Converted 18th-century palace offering royal treatment, antique furnishings, and gourmet dining.",
    location: "Paris",
    price: 780,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "restaurant", "ac", "tv", "parking"],
    maxGuests: 2,
    rating: 4.7,
    hasSpecialOffer: false
  },
  {
    title: "Tropical Paradise Resort",
    description: "Beachfront resort with overwater bungalows, coral reefs, and water sports activities.",
    location: "Bali",
    price: 650,
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "pool", "spa", "restaurant", "ac", "hotTub"],
    maxGuests: 4,
    rating: 4.8,
    hasSpecialOffer: true,
    specialOfferDetails: "Honeymoon package includes romantic dinner and couples massage"
  },
  {
    title: "Modern City Loft",
    description: "Contemporary loft-style apartment in the heart of the city with stunning skyline views.",
    location: "Tokyo",
    price: 380,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
    ],
    amenities: ["wifi", "ac", "tv", "parking"],
    maxGuests: 2,
    rating: 4.4,
    hasSpecialOffer: false
  },
  {
    title: "Vineyard Estate",
    description: "Luxurious wine country estate with private vineyard tours and wine tasting experiences.",
    location: "Tuscany",
    price: 890,
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "pool", "restaurant", "ac", "parking"],
    maxGuests: 8,
    rating: 4.9,
    hasSpecialOffer: true,
    specialOfferDetails: "Wine tasting package includes private tour and gourmet dinner"
  },
  {
    title: "Seaside Villa",
    description: "Private beachfront villa with infinity pool and direct access to pristine beaches.",
    location: "Santorini",
    price: 1100,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "pool", "ac", "hotTub", "tv"],
    maxGuests: 6,
    rating: 4.8,
    hasSpecialOffer: false
  },
  {
    title: "Jungle Treehouse Resort",
    description: "Unique treehouse accommodations surrounded by lush rainforest and wildlife.",
    location: "Costa Rica",
    price: 420,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "restaurant", "ac"],
    maxGuests: 2,
    rating: 4.6,
    hasSpecialOffer: true,
    specialOfferDetails: "Adventure package includes guided tours and zip-lining"
  },
  {
    title: "Arctic Glass Lodge",
    description: "Unique glass-roofed lodge for Northern Lights viewing and Arctic adventures.",
    location: "Iceland",
    price: 750,
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "ac", "hotTub"],
    maxGuests: 2,
    rating: 4.7,
    hasSpecialOffer: true,
    specialOfferDetails: "Northern Lights package includes guided tour and photography session"
  },
  {
    title: "Safari Lodge",
    description: "Luxury safari lodge with game drives and wildlife viewing opportunities.",
    location: "South Africa",
    price: 920,
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "pool", "restaurant", "ac"],
    maxGuests: 4,
    rating: 4.9,
    hasSpecialOffer: false
  },
  {
    title: "Floating Hotel",
    description: "Unique floating hotel on a lake with water activities and mountain views.",
    location: "Switzerland",
    price: 680,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "restaurant", "ac", "hotTub"],
    maxGuests: 2,
    rating: 4.5,
    hasSpecialOffer: true,
    specialOfferDetails: "Water sports package includes kayaking and paddleboarding"
  },
  {
    title: "Historic Castle Hotel",
    description: "Medieval castle converted into a luxury hotel with period furnishings and modern amenities.",
    location: "Scotland",
    price: 890,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "restaurant", "ac", "tv", "parking"],
    maxGuests: 4,
    rating: 4.8,
    hasSpecialOffer: true,
    specialOfferDetails: "Historic tour package includes whiskey tasting"
  },
  {
    title: "Underwater Suite",
    description: "Unique underwater accommodation with panoramic views of marine life.",
    location: "Maldives",
    price: 1500,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "pool", "spa", "restaurant", "ac", "hotTub"],
    maxGuests: 2,
    rating: 4.9,
    hasSpecialOffer: true,
    specialOfferDetails: "Marine life package includes diving and snorkeling"
  },
  {
    title: "Sky High Penthouse",
    description: "Luxurious penthouse with panoramic city views and private rooftop terrace.",
    location: "Singapore",
    price: 1200,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
    ],
    amenities: ["wifi", "gym", "restaurant", "ac", "tv", "parking"],
    maxGuests: 4,
    rating: 4.7,
    hasSpecialOffer: false
  },
  {
    title: "Luxury Dubai Marina Apartment",
    description: "Beautiful apartment with stunning views of Dubai Marina",
    location: "Dubai Marina, Dubai, UAE",
    price: 500,
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "pool", "gym", "parking", "ac"],
    maxGuests: 4,
    rating: 4.8,
    hasSpecialOffer: true,
    specialOfferDetails: "10% off for stays longer than 7 nights",
    availability: [
      {
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        isBooked: false
      }
    ]
  },
  {
    title: "Palm Jumeirah Beach Villa",
    description: "Luxurious beachfront villa on Palm Jumeirah",
    location: "Palm Jumeirah, Dubai, UAE",
    price: 1200,
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "pool", "gym", "spa", "parking", "ac", "restaurant"],
    maxGuests: 8,
    rating: 4.9,
    hasSpecialOffer: false,
    availability: [
      {
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        isBooked: false
      }
    ]
  },
  {
    title: "Downtown Dubai Penthouse",
    description: "Luxury penthouse with Burj Khalifa views",
    location: "Downtown Dubai, Dubai, UAE",
    price: 800,
    images: [
      "https://images.unsplash.com/photo-1451976426598-a7593bd6d0b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "pool", "gym", "parking", "ac", "spa"],
    maxGuests: 6,
    rating: 4.7,
    hasSpecialOffer: true,
    specialOfferDetails: "Free airport transfer",
    availability: [
      {
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        isBooked: false
      }
    ]
  },
  {
    title: "Riverside Boutique Hotel",
    description: "Charming boutique hotel overlooking the river with elegant rooms and fine dining.",
    location: "Amsterdam",
    price: 420,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
    ],
    amenities: ["wifi", "restaurant", "ac", "tv", "parking"],
    maxGuests: 2,
    rating: 4.6,
    hasSpecialOffer: true,
    specialOfferDetails: "Free canal tour with 3-night stay"
  },
  {
    title: "Himalayan Mountain Lodge",
    description: "Secluded mountain lodge with breathtaking views of the Himalayas and guided trekking tours.",
    location: "Nepal",
    price: 380,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "restaurant", "ac", "hotTub"],
    maxGuests: 4,
    rating: 4.7,
    hasSpecialOffer: false
  },
  {
    title: "Venetian Palace Suite",
    description: "Historic palace suite with canal views and authentic Venetian architecture.",
    location: "Venice",
    price: 890,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "restaurant", "ac", "tv", "parking"],
    maxGuests: 2,
    rating: 4.8,
    hasSpecialOffer: true,
    specialOfferDetails: "Gondola ride included with stay"
  },
  {
    title: "Kyoto Traditional Ryokan",
    description: "Authentic Japanese ryokan with traditional tatami rooms and onsen baths.",
    location: "Kyoto",
    price: 450,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
    ],
    amenities: ["wifi", "restaurant", "ac", "hotTub"],
    maxGuests: 2,
    rating: 4.9,
    hasSpecialOffer: true,
    specialOfferDetails: "Traditional tea ceremony included"
  },
  {
    title: "Greek Island Villa",
    description: "Stunning villa with private pool and panoramic views of the Aegean Sea.",
    location: "Mykonos",
    price: 1100,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "pool", "ac", "hotTub", "tv"],
    maxGuests: 6,
    rating: 4.8,
    hasSpecialOffer: false
  },
  {
    title: "Barcelona Art Hotel",
    description: "Artistic hotel in the heart of Barcelona with unique design and rooftop pool.",
    location: "Barcelona",
    price: 580,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
    ],
    amenities: ["wifi", "pool", "restaurant", "ac", "gym"],
    maxGuests: 2,
    rating: 4.7,
    hasSpecialOffer: true,
    specialOfferDetails: "Free guided art tour included"
  },
  {
    title: "Moroccan Riad",
    description: "Traditional Moroccan house with courtyard, plunge pool, and rooftop terrace.",
    location: "Marrakech",
    price: 320,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "pool", "restaurant", "ac"],
    maxGuests: 4,
    rating: 4.6,
    hasSpecialOffer: true,
    specialOfferDetails: "Traditional hammam experience included"
  },
  {
    title: "Vienna Opera House Hotel",
    description: "Elegant hotel near the Vienna State Opera with classical music performances.",
    location: "Vienna",
    price: 680,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
    ],
    amenities: ["wifi", "restaurant", "ac", "tv", "parking"],
    maxGuests: 2,
    rating: 4.8,
    hasSpecialOffer: false
  },
  {
    title: "Rio Beachfront Resort",
    description: "Luxury resort with direct beach access and stunning views of Copacabana.",
    location: "Rio de Janeiro",
    price: 850,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "pool", "spa", "restaurant", "ac", "gym"],
    maxGuests: 4,
    rating: 4.7,
    hasSpecialOffer: true,
    specialOfferDetails: "Samba show tickets included"
  },
  {
    title: "Hanoi Old Quarter Hotel",
    description: "Boutique hotel in the heart of Hanoi's Old Quarter with authentic Vietnamese charm.",
    location: "Hanoi",
    price: 280,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
    ],
    amenities: ["wifi", "restaurant", "ac", "tv"],
    maxGuests: 2,
    rating: 4.5,
    hasSpecialOffer: true,
    specialOfferDetails: "Free cooking class included"
  },
  {
    title: "Cairo Pyramid View Hotel",
    description: "Luxury hotel with direct views of the Great Pyramids and desert tours.",
    location: "Cairo",
    price: 720,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "pool", "spa", "restaurant", "ac", "gym"],
    maxGuests: 4,
    rating: 4.8,
    hasSpecialOffer: true,
    specialOfferDetails: "Pyramid tour included"
  },
  {
    title: "Seoul Modern Apartment",
    description: "Contemporary apartment in Gangnam with city views and modern amenities.",
    location: "Seoul",
    price: 420,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
    ],
    amenities: ["wifi", "ac", "tv", "parking", "gym"],
    maxGuests: 2,
    rating: 4.6,
    hasSpecialOffer: false
  },
  {
    title: "Sydney Harbor View Hotel",
    description: "Luxury hotel with iconic views of the Sydney Opera House and Harbor Bridge.",
    location: "Sydney",
    price: 950,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "pool", "spa", "restaurant", "ac", "gym"],
    maxGuests: 4,
    rating: 4.9,
    hasSpecialOffer: true,
    specialOfferDetails: "Harbor cruise included"
  },
  {
    title: "Lisbon Hillside Villa",
    description: "Charming villa with panoramic views of Lisbon and the Tagus River.",
    location: "Lisbon",
    price: 580,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "pool", "ac", "tv", "parking"],
    maxGuests: 6,
    rating: 4.7,
    hasSpecialOffer: true,
    specialOfferDetails: "Fado show tickets included"
  },
  {
    title: "Bangkok Riverside Resort",
    description: "Luxury resort on the Chao Phraya River with traditional Thai architecture.",
    location: "Bangkok",
    price: 650,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
    ],
    amenities: ["wifi", "pool", "spa", "restaurant", "ac", "gym"],
    maxGuests: 4,
    rating: 4.8,
    hasSpecialOffer: true,
    specialOfferDetails: "River cruise included"
  },
  {
    title: "Cape Town Mountain Lodge",
    description: "Luxury lodge with views of Table Mountain and the Atlantic Ocean.",
    location: "Cape Town",
    price: 780,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "pool", "spa", "restaurant", "ac", "gym"],
    maxGuests: 4,
    rating: 4.9,
    hasSpecialOffer: true,
    specialOfferDetails: "Wine tour included"
  },
  {
    title: "Istanbul Bosphorus Hotel",
    description: "Historic hotel overlooking the Bosphorus with Ottoman architecture.",
    location: "Istanbul",
    price: 720,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
    ],
    amenities: ["wifi", "pool", "spa", "restaurant", "ac", "gym"],
    maxGuests: 4,
    rating: 4.8,
    hasSpecialOffer: true,
    specialOfferDetails: "Bosphorus cruise included"
  },
  {
    title: "Helsinki Design Hotel",
    description: "Modern design hotel in the heart of Helsinki with Nordic architecture.",
    location: "Helsinki",
    price: 580,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "spa", "restaurant", "ac", "gym"],
    maxGuests: 2,
    rating: 4.7,
    hasSpecialOffer: false
  },
  {
    title: "Mexico City Art Hotel",
    description: "Boutique hotel in the historic center with contemporary Mexican art.",
    location: "Mexico City",
    price: 450,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "restaurant", "ac", "gym"],
    maxGuests: 2,
    rating: 4.6,
    hasSpecialOffer: true,
    specialOfferDetails: "Art gallery tour included"
  },
  {
    title: "Warsaw Palace Hotel",
    description: "Restored palace hotel in the heart of Warsaw with classical architecture.",
    location: "Warsaw",
    price: 680,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
    ],
    amenities: ["wifi", "spa", "restaurant", "ac", "gym"],
    maxGuests: 4,
    rating: 4.8,
    hasSpecialOffer: true,
    specialOfferDetails: "Chopin concert tickets included"
  },
  {
    title: "Château de Versailles Suite",
    description: "Luxurious suite in a restored 17th-century château with private gardens and butler service.",
    location: "Versailles, France",
    price: 1200,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "pool", "spa", "restaurant", "ac", "gym", "butler"],
    maxGuests: 4,
    rating: 4.9,
    hasSpecialOffer: true,
    specialOfferDetails: "Private tour of Palace of Versailles included"
  },
  {
    title: "Alpine Grand Resort",
    description: "Luxury ski resort with private ski lifts and panoramic mountain views.",
    location: "Zermatt, Switzerland",
    price: 1500,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "pool", "spa", "restaurant", "ac", "gym", "skiStorage"],
    maxGuests: 6,
    rating: 4.9,
    hasSpecialOffer: true,
    specialOfferDetails: "Private ski instructor included"
  },
  {
    title: "Mediterranean Villa Estate",
    description: "Exclusive villa with private beach access and infinity pool overlooking the Mediterranean.",
    location: "Portofino, Italy",
    price: 1400,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "pool", "spa", "restaurant", "ac", "privateBeach"],
    maxGuests: 8,
    rating: 4.9,
    hasSpecialOffer: true,
    specialOfferDetails: "Private yacht tour included"
  },
  {
    title: "Scottish Highland Castle",
    description: "Historic castle with modern luxury amenities and private whisky tasting room.",
    location: "Inverness, Scotland",
    price: 1300,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
    ],
    amenities: ["wifi", "spa", "restaurant", "ac", "whiskyBar", "library"],
    maxGuests: 12,
    rating: 4.9,
    hasSpecialOffer: true,
    specialOfferDetails: "Private whisky tasting with master distiller"
  },
  {
    title: "Amsterdam Canal Palace",
    description: "Restored 17th-century canal house with private boat dock and rooftop terrace.",
    location: "Amsterdam, Netherlands",
    price: 1100,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
    ],
    amenities: ["wifi", "spa", "restaurant", "ac", "privateBoat", "rooftopTerrace"],
    maxGuests: 6,
    rating: 4.8,
    hasSpecialOffer: true,
    specialOfferDetails: "Private canal cruise with dinner"
  },
  {
    title: "Greek Island Mansion",
    description: "Luxury mansion with private beach and ancient ruins on the property.",
    location: "Santorini, Greece",
    price: 1450,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "pool", "spa", "restaurant", "ac", "privateBeach"],
    maxGuests: 10,
    rating: 4.9,
    hasSpecialOffer: true,
    specialOfferDetails: "Private archaeological tour included"
  },
  {
    title: "Viennese Imperial Suite",
    description: "Luxury suite in a former imperial palace with private concert hall.",
    location: "Vienna, Austria",
    price: 1200,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "spa", "restaurant", "ac", "concertHall", "butler"],
    maxGuests: 4,
    rating: 4.9,
    hasSpecialOffer: true,
    specialOfferDetails: "Private classical concert included"
  },
  {
    title: "Barcelona Modernist Palace",
    description: "Restored Modernist palace with rooftop pool and private art collection.",
    location: "Barcelona, Spain",
    price: 1300,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
    ],
    amenities: ["wifi", "pool", "spa", "restaurant", "ac", "artGallery"],
    maxGuests: 6,
    rating: 4.9,
    hasSpecialOffer: true,
    specialOfferDetails: "Private Gaudi architecture tour"
  },
  {
    title: "Norwegian Fjord Lodge",
    description: "Luxury lodge with panoramic fjord views and private sauna.",
    location: "Bergen, Norway",
    price: 1400,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "spa", "restaurant", "ac", "sauna", "fitnessCenter"],
    maxGuests: 8,
    rating: 4.9,
    hasSpecialOffer: true,
    specialOfferDetails: "Private fjord cruise included"
  },
  {
    title: "Dublin Georgian Mansion",
    description: "Restored Georgian mansion with private whiskey library and gardens.",
    location: "Dublin, Ireland",
    price: 1100,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "spa", "restaurant", "ac", "whiskeyLibrary", "garden"],
    maxGuests: 6,
    rating: 4.8,
    hasSpecialOffer: true,
    specialOfferDetails: "Private whiskey tasting with master distiller"
  },
  {
    title: "Prague Castle View Suite",
    description: "Luxury suite with panoramic views of Prague Castle and private butler.",
    location: "Prague, Czech Republic",
    price: 1200,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
    ],
    amenities: ["wifi", "spa", "restaurant", "ac", "butler", "rooftopTerrace"],
    maxGuests: 4,
    rating: 4.9,
    hasSpecialOffer: true,
    specialOfferDetails: "Private castle tour after hours"
  },
  {
    title: "Budapest Thermal Palace",
    description: "Luxury hotel with private thermal baths and panoramic city views.",
    location: "Budapest, Hungary",
    price: 1300,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "spa", "restaurant", "ac", "thermalBaths", "gym"],
    maxGuests: 4,
    rating: 4.9,
    hasSpecialOffer: true,
    specialOfferDetails: "Private thermal bath experience"
  },
  {
    title: "Edinburgh Royal Residence",
    description: "Historic residence with private gardens and royal connections.",
    location: "Edinburgh, Scotland",
    price: 1400,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
    ],
    amenities: ["wifi", "spa", "restaurant", "ac", "library", "garden"],
    maxGuests: 8,
    rating: 4.9,
    hasSpecialOffer: true,
    specialOfferDetails: "Private castle tour with historian"
  },
  {
    title: "Copenhagen Design Hotel",
    description: "Award-winning design hotel with rooftop restaurant and art gallery.",
    location: "Copenhagen, Denmark",
    price: 1100,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "spa", "restaurant", "ac", "artGallery", "rooftopBar"],
    maxGuests: 4,
    rating: 4.9,
    hasSpecialOffer: true,
    specialOfferDetails: "Private design tour of Copenhagen"
  },
  {
    title: "Porto Wine Estate",
    description: "Luxury estate with private vineyards and wine cellar.",
    location: "Porto, Portugal",
    price: 1300,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "spa", "restaurant", "ac", "wineCellar", "vineyard"],
    maxGuests: 6,
    rating: 4.9,
    hasSpecialOffer: true,
    specialOfferDetails: "Private port wine tasting and tour"
  },
  {
    title: "Stockholm Archipelago Villa",
    description: "Private island villa with panoramic sea views and sauna.",
    location: "Stockholm, Sweden",
    price: 1450,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
    ],
    amenities: ["wifi", "spa", "restaurant", "ac", "sauna", "privateBeach"],
    maxGuests: 8,
    rating: 4.9,
    hasSpecialOffer: true,
    specialOfferDetails: "Private boat tour of archipelago"
  },
  {
    title: "Athens Acropolis View Suite",
    description: "Luxury suite with direct views of the Acropolis and private terrace.",
    location: "Athens, Greece",
    price: 1200,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "spa", "restaurant", "ac", "rooftopPool", "butler"],
    maxGuests: 4,
    rating: 4.9,
    hasSpecialOffer: true,
    specialOfferDetails: "Private Acropolis tour at sunset"
  },
  {
    title: "Berlin Art Palace",
    description: "Former palace converted into luxury hotel with contemporary art collection.",
    location: "Berlin, Germany",
    price: 1100,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
    ],
    amenities: ["wifi", "spa", "restaurant", "ac", "artGallery", "gym"],
    maxGuests: 4,
    rating: 4.8,
    hasSpecialOffer: true,
    specialOfferDetails: "Private art tour with curator"
  },
  {
    title: "Rome Imperial Villa",
    description: "Luxury villa with ancient Roman ruins and private gardens.",
    location: "Rome, Italy",
    price: 1500,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    amenities: ["wifi", "pool", "spa", "restaurant", "ac", "garden", "butler"],
    maxGuests: 8,
    rating: 4.9,
    hasSpecialOffer: true,
    specialOfferDetails: "Private Vatican tour before opening"
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing properties
    await Property.deleteMany({});
    console.log('Cleared existing properties');

    // Insert new properties
    await Property.insertMany(hotels);
    console.log('Successfully seeded database with new properties');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 