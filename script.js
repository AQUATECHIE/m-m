// Sample product data
const products = [
    { id: 1, name: "coconut-poundo 500g", price: 6500, image: "./images/mm-coconut-pundo.jpg" },
    { id: 2, name: "coconut-flour 500g", price: 4500, image: "./images/coconut-flour.jpg" },
    { id: 3, name: "unripe-plantain-flour 1kg", price: 6500, image: "./images/unripe-plantain-flour.jpg" },
    { id: 4, name: "coconut-flakes-sweetened 150g", price: 2500, image: "./images/coconut-flakes-sweetned.jpg" },
    { id: 5, name: "coconut-flakes-unsweetened 150g", price: 2500, image: "./images/coconut-flakes-unsweetned.jpg" },
    { id: 6, name: "coconut-chinchin 220g", price: 2800, image: "./images/coconut-chinchin.jpg" },
    { id: 7, name: "mixed-nut 200g", price: 4500, image: "./images/mixed-nut-200g.jpg" },
    { id: 8, name: "mixed-nut 100g", price: 2500, image: "./images/mixed-nut.jpg" },
    { id: 9, name: "coconut-oil 500ml", price: 11500, image: "./images/coconut-oil-500ml.jpg" },
    { id: 10, name: "coconut-oil 1ltr", price: 21500, image: "./images/coconut-oil-1ltr.jpg" },
    { id: 11, name: "coconut-candy 150g", price: 2500, image: "./images/coconut-candy.jpg" },
    { id: 12, name: "coconut-water", price: 2500, image: "./images/coconut-water.jpg" },
];

// Cart array (loaded from localStorage if exists)
let cart = JSON.parse(localStorage.getItem('cart')) || [];
cart = cart.filter(item => item && item.product && typeof item.quantity === 'number');

// Function to update cart count in navbar
function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        cartCount.textContent = totalItems || 0;
    }
}

// Function to save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to display products (used on index.html and products.html)
function displayProducts(productArray = products) {
    const productList = document.getElementById("product-list");
    if (productList) {
        productList.innerHTML = '';
        productArray.forEach(product => {
            const productHTML = `
                <div class="col-md-4 mb-4">
                    <div class="card product-card" onclick="addToCart(${product.id})" style="cursor: pointer;">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.price.toFixed(2)}</p>
                            <button class="btn btn-success" onclick="event.stopPropagation(); addToCart(${product.id})">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
            productList.innerHTML += productHTML;
        });
    }
}

// Function to add to cart with quantity handling
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.product.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ product, quantity: 1 });
        }
        saveCart();
        updateCartCount();
        alert(`${product.name} added to cart! Total items: ${cart.reduce((sum, item) => sum + item.quantity, 0)}`);
    }
}

// Typing effect (only for index.html)
function typeEffect() {
    const typedText = document.getElementById("typed-text");
    if (typedText) {
        const text = "Mouth Munchers";
        let i = 0;
        function type() {
            if (i < text.length) {
                typedText.textContent += text.charAt(i);
                i++;
                setTimeout(type, 200);
            } else {
                typedText.style.borderRight = "none";
            }
        }
        setTimeout(type, 500);
    }
}

// Load products and start typing effect when page loads
window.onload = function() {
    const isIndexPage = document.querySelector('.hero-section');
    displayProducts(isIndexPage ? products.slice(0, 3) : products);
    updateCartCount();
    typeEffect();
};