function mapUser(row) {
  if (!row) return null;
  return {
    _id: row.id,
    login: row.login,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    createdAt: row.created_at,
  };
}

function mapVenue(row) {
  if (!row) return null;
  return {
    _id: row.id,
    name: row.name,
    type: row.type,
    description: row.description,
    capacity: row.capacity,
    imageUrl: row.image_url,
    createdAt: row.created_at,
  };
}

function mapBooking(row) {
  if (!row) return null;
  const booking = {
    _id: row.id,
    banquetDate: row.banquet_date,
    paymentMethod: row.payment_method,
    status: row.status,
    createdAt: row.created_at,
  };
  if (row.venue_id) {
    booking.venue = {
      _id: row.venue_id,
      name: row.venue_name,
      type: row.venue_type,
      imageUrl: row.venue_image_url,
    };
  }
  if (row.user_id) {
    booking.user = {
      _id: row.user_id,
      login: row.user_login,
      fullName: row.user_full_name,
      phone: row.user_phone,
      email: row.user_email,
    };
  }
  return booking;
}

function mapReview(row) {
  if (!row) return null;
  const review = {
    _id: row.id,
    text: row.text,
    rating: row.rating,
    createdAt: row.created_at,
  };
  if (row.booking_id) {
    review.booking = {
      _id: row.booking_id,
      banquetDate: row.booking_date,
      status: row.booking_status,
      venue: row.venue_id
        ? {
            _id: row.venue_id,
            name: row.venue_name,
            type: row.venue_type,
          }
        : undefined,
    };
  }
  return review;
}

module.exports = { mapUser, mapVenue, mapBooking, mapReview };
