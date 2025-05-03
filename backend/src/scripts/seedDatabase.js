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