import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  properties: [],
  filteredProperties: [],
  selectedProperty: null,
  loading: false,
  error: null,
  filters: {
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    priceRange: [0, 1500],
    rating: 0,
    amenities: [],
    specialOffers: false,
  },
};

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setProperties: (state, action) => {
      state.properties = action.payload;
      state.filteredProperties = action.payload;
    },
    setSelectedProperty: (state, action) => {
      state.selectedProperty = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredProperties = state.properties;
    },
  },
});

// Helper function to filter properties based on filters
const filterProperties = (properties, filters) => {
  return properties.filter(property => {
    // Location filter
    if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }

    // Price range filter
    if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) {
      return false;
    }

    // Rating filter
    if (filters.rating > 0 && property.rating < filters.rating) {
      return false;
    }

    // Guest filter
    if (filters.guests > property.maxGuests) {
      return false;
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      const propertyAmenities = property.amenities.map(a => a.toLowerCase());
      if (!filters.amenities.every(amenity => propertyAmenities.includes(amenity.toLowerCase()))) {
        return false;
      }
    }

    // Special offers filter
    if (filters.specialOffers && !property.specialOffer) {
      return false;
    }

    return true;
  });
};

export const {
  setProperties,
  setSelectedProperty,
  setLoading,
  setError,
  updateFilters,
  clearFilters,
} = propertySlice.actions;

export default propertySlice.reducer; 