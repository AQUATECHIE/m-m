// Sample product data
const products = [
    { id: 1, name: "muchers", price: 19.99, image: "./images/product10.jpg" },
    { id: 2, name: "muchers", price: 39.99, image: "./images/product10.jpg" },
    { id: 3, name: "muchers", price: 59.99, image: "./images/product10.jpg" },
    { id: 4, name: "muchers", price: 79.99, image: "./images/product10.jpg" },
    { id: 5, name: "muchers", price: 14.99, image: "./images/product10.jpg" },
    { id: 6, name: "muchers", price: 99.99, image: "./images/product10.jpg" }
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
                            <p class="card-text">$${product.price.toFixed(2)}</p>
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