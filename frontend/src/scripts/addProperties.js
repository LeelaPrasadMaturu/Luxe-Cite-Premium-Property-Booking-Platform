import fetch from 'node-fetch';

const properties = [
  {
    title: "Luxury Beachfront Villa",
    description: "Experience paradise in this stunning beachfront villa with panoramic ocean views, private pool, and direct beach access. Perfect for families or groups looking for a luxurious tropical getaway.",
    location: "Maldives",
    price: 500,
    images: [
      "https://images.pexels.com/photos/1179156/pexels-photo-1179156.jpeg",
      "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
      "https://images.pexels.com/photos/261395/pexels-photo-261395.jpeg",
      "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg"
    ],
    amenities: ["Private Pool", "Ocean View", "WiFi", "Air Conditioning", "Kitchen", "Parking"],
    maxGuests: 6,
    rating: 4.8
  },
  {
    title: "Mountain View Chalet",
    description: "Nestled in the Swiss Alps, this charming chalet offers breathtaking mountain views, cozy interiors, and modern amenities. Perfect for winter sports enthusiasts or summer hikers.",
    location: "Swiss Alps",
    price: 350,
    images: [
      "https://images.pexels.com/photos/754268/pexels-photo-754268.jpeg",
      "https://images.pexels.com/photos/3735158/pexels-photo-3735158.jpeg",
      "https://images.pexels.com/photos/5998138/pexels-photo-5998138.jpeg",
      "https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg"
    ],
    amenities: ["Mountain View", "Fireplace", "WiFi", "Kitchen", "Parking", "Hot Tub"],
    maxGuests: 4,
    rating: 4.9
  },
  {
    title: "Modern City Apartment",
    description: "Stylish apartment in the heart of New York City with stunning skyline views. Close to major attractions, shopping, and dining. Perfect for business travelers or tourists.",
    location: "New York City",
    price: 250,
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
      "https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg",
      "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg"
    ],
    amenities: ["City View", "WiFi", "Air Conditioning", "Kitchen", "Gym", "Parking"],
    maxGuests: 2,
    rating: 4.7
  },
  {
    title: "Historic Parisian Loft",
    description: "Charming loft in the heart of Paris with classic French architecture and modern amenities. Steps away from the Seine and major landmarks.",
    location: "Paris",
    price: 300,
    images: [
      "https://images.pexels.com/photos/1082355/pexels-photo-1082355.jpeg",
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
      "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg",
      "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg"
    ],
    amenities: ["Historic Building", "WiFi", "Air Conditioning", "Kitchen", "Elevator", "City View"],
    maxGuests: 3,
    rating: 4.8
  },
  {
    title: "Bali Jungle Villa",
    description: "Luxurious villa surrounded by lush tropical gardens in Bali. Features a private pool, outdoor shower, and traditional Balinese architecture.",
    location: "Bali",
    price: 400,
    images: [
      "https://images.pexels.com/photos/4846461/pexels-photo-4846461.jpeg",
      "https://images.pexels.com/photos/4846437/pexels-photo-4846437.jpeg",
      "https://images.pexels.com/photos/4846454/pexels-photo-4846454.jpeg",
      "https://images.pexels.com/photos/4846434/pexels-photo-4846434.jpeg"
    ],
    amenities: ["Private Pool", "Garden View", "WiFi", "Air Conditioning", "Kitchen", "Outdoor Shower"],
    maxGuests: 4,
    rating: 4.9
  }
];

const addProperties = async () => {
  for (const property of properties) {
    try {
      const response = await fetch('http://localhost:4000/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(property),
      });

      if (!response.ok) {
        throw new Error(`Failed to add property: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Successfully added property: ${data.title}`);
    } catch (error) {
      console.error(`Error adding property: ${error.message}`);
    }
  }
};

addProperties(); 