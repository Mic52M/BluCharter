const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Read the pending reviews
const pendingReviews = JSON.parse(fs.readFileSync('pending_reviews.json', 'utf8'));
const approvedReviews = JSON.parse(fs.readFileSync('reviews.json', 'utf8'));

// Function to display a review
function displayReview(review) {
  console.log('\n=== Recensione ===');
  console.log(`Nome: ${review.name}`);
  console.log(`Valutazione: ${review.rating}/5`);
  console.log(`Testo: ${review.text}`);
  console.log(`Data: ${review.date}`);
  if (review.images && review.images.length > 0) {
    console.log('Immagini:');
    review.images.forEach(img => console.log(`- ${img}`));
  }
  console.log('================\n');
}

// Function to moderate reviews
async function moderateReviews() {
  for (let i = 0; i < pendingReviews.length; i++) {
    const review = pendingReviews[i];
    displayReview(review);
    
    const answer = await new Promise(resolve => {
      rl.question('Vuoi approvare questa recensione? (s/n): ', resolve);
    });
    
    if (answer.toLowerCase() === 's') {
      // Move the review to approved reviews
      approvedReviews.push(review);
      console.log('Recensione approvata!');
    } else {
      console.log('Recensione rifiutata.');
    }
  }
  
  // Save the updated files
  fs.writeFileSync('reviews.json', JSON.stringify(approvedReviews, null, 2));
  fs.writeFileSync('pending_reviews.json', '[]');
  
  console.log('\nModerazione completata!');
  rl.close();
}

// Start moderation
moderateReviews(); 