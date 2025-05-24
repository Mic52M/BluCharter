const fs = require('fs');
const path = require('path');

// Read the pending reviews file
const pendingReviews = JSON.parse(fs.readFileSync('pending_reviews.json', 'utf8'));

// Process each review
pendingReviews.forEach((review, reviewIndex) => {
  if (review.images && Array.isArray(review.images)) {
    review.images.forEach((imageData, imageIndex) => {
      // Check if the image is base64 encoded
      if (imageData.startsWith('data:image')) {
        // Extract the base64 data
        const base64Data = imageData.split(',')[1];
        
        // Create the filename
        const filename = `review_${reviewIndex + 1}_${imageIndex + 1}.jpg`;
        const filepath = path.join('public', 'images', 'reviews', filename);
        
        // Save the image
        fs.writeFileSync(filepath, base64Data, 'base64');
        
        // Update the image path in the reviews array
        review.images[imageIndex] = `/images/reviews/${filename}`;
      }
    });
  }
});

// Save the updated pending reviews
fs.writeFileSync('pending_reviews.json', JSON.stringify(pendingReviews, null, 2)); 