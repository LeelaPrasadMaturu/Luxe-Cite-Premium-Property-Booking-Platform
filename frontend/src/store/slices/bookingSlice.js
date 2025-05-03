import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookings: [],
  selectedBooking: null,
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setBookings: (state, action) => {
      state.bookings = action.payload;
    },
    setSelectedBooking: (state, action) => {
      state.selectedBooking = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateBookingStatus: (state, action) => {
      const { id, status } = action.payload;
      const booking = state.bookings.find(b => b.id === id);
      if (booking) {
        booking.status = status;
      }
      if (state.selectedBooking?.id === id) {
        state.selectedBooking.status = status;
      }
    },
  },
});

export const {
  setBookings,
  setSelectedBooking,
  setLoading,
  setError,
  updateBookingStatus,
} = bookingSlice.actions;

export default bookingSlice.reducer; 