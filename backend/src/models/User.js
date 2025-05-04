import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: true,
    maxlength: [72, 'Password cannot be longer than 72 characters']
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  }],
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'Name cannot be longer than 255 characters']
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return v.length >= 10;
      },
      message: 'Phone number must be at least 10 characters long'
    }
  },
  role: {
    type: String,
    enum: ['GUEST', 'ADMIN'],
    default: 'GUEST',
    validate: {
      validator: function(v) {
        return ['GUEST', 'ADMIN'].includes(v);
      },
      message: 'Role must be either GUEST or ADMIN'
    }
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Add pre-save middleware to check for empty fields
userSchema.pre('validate', function(next) {
  if (this.name === '' || this.email === '' || this.phone === '') {
    next(new Error('Name, email, and phone cannot be empty'));
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User; 