const storeContainer = document.getElementById('store');

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let stars = '';

  for (let i = 0; i < fullStars; i++) {
    stars += '★';
  }

  if (hasHalfStar) {
    stars += '☆';
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars += '☆';
  }

  return stars;
}

function calculateDiscount(price, originalPrice) {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

function displayProducts(products) {
  storeContainer.innerHTML = "";

  products.forEach((product, index) => {
    const discount = calculateDiscount(product.price, product.originalPrice);

    const card = document.createElement('div');
    card.classList.add('product-card');
    card.style.animationDelay = `${index * 0.1}s`;

    card.innerHTML = `
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.name}" class="product-image" />
        <div class="product-badge">${product.badge}</div>
      </div>

      <div class="product-content">
        <div class="product-name">${product.name}</div>

        <div class="product-rating">
          <span class="stars">${generateStars(product.rating)}</span>
          <span class="rating-count">(${product.ratingCount})</span>
        </div>

        <div class="product-description">${product.description}</div>

        <div class="product-price-container">
          <div class="product-price">${product.price.toFixed(2)} €</div>
          ${product.originalPrice ? `<div class="original-price">${product.originalPrice.toFixed(2)} €</div>` : ''}
          ${discount > 0 ? `<div class="discount">-${discount}%</div>` : ''}
        </div>

        <div class="buttons">
          <a href="${product.amazonLink}" target="_blank" class="btn-amazon"> شراء من أمازون</a>
        </div>
      </div>
    `;

    storeContainer.appendChild(card);
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.product-card').forEach(card => {
    observer.observe(card);
  });
}

// Charger le JSON et afficher les produits
fetch('produits.json')
  .then(response => response.json())
  .then(data => {
    displayProducts(data);
  })
  .catch(error => {
    storeContainer.innerHTML = '<p>Erreur lors du chargement des produits.</p>';
    console.error('Erreur fetch produits:', error);
  });
