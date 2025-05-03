import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from './models/Property.js';

dotenv.config();

const properties = [
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

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing properties
    await Property.deleteMany({});
    console.log('Cleared existing properties');

    // Insert new properties
    await Property.insertMany(properties);
    console.log('Added sample properties');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 