// Sample product data (shared across pages)
const products = [
    { id: 1, name: "oil", price: 19.99, image: "./images/img3.jpg" },
    { id: 2, name: "nuts", price: 39.99, image: "./images/product3.jpg" },
    { id: 3, name: "flour", price: 59.99, image: "./images/product10.jpg" },
    { id: 4, name: "flakes", price: 79.99, image: "./images/product1.jpg" },
    { id: 5, name: "Cap", price: 14.99, image: "./images/product5.jpg" },
    { id: 6, name: "Watch", price: 99.99, image: "./images/product12.jpg" }
];

// Cart array (loaded from localStorage if exists)
let cart = JSON.parse(localStorage.getItem('cart')) || [];
cart = cart.filter(item => item && item.product && typeof item.quantity === 'number');
console.log("Initial cart:", cart);

// Function to update cart count in navbar
function updateCartCount() {
    try {
        const cartCount = document.getElementById("cart-count");
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
            cartCount.textContent = totalItems || 0;
            console.log("Cart count updated to:", totalItems);
        }
    } catch (error) {
        console.error("Error updating cart count:", error);
    }
}

// Function to save cart to localStorage
function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log("Cart saved:", cart);
    } catch (error) {
        console.error("Error saving cart:", error);
    }
}

// Function to display products (used on index.html and products.html)
function displayProducts(productArray = products) {
    try {
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
    } catch (error) {
        console.error("Error displaying products:", error);
    }
}

// Function to add to cart with quantity handling
function addToCart(productId) {
    try {
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
            console.log("Item added:", product, "New cart:", cart);
        } else {
            console.error("Product not found for ID:", productId);
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
    }
}

// Typing effect (only for index.html)
function typeEffect() {
    try {
        const typedText = document.getElementById("typed-text");
        if (typedText) {
            const text = "Mouth munchers";
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
    } catch (error) {
        console.error("Error in typing effect:", error);
    }
}

// Initialize page based on context
function initializePage() {
    try {
        const isIndexPage = document.querySelector('.hero-section');
        if (isIndexPage) {
            displayProducts(products.slice(0, 3)); // Index shows 3 products
            typeEffect();
        } else if (document.getElementById("product-list")) {
            displayProducts(products); // Products page shows all
        }
        updateCartCount(); // Always update cart count
    } catch (error) {
        console.error("Error initializing page:", error);
    }
}

// Use DOMContentLoaded instead of window.onload to avoid overrides
document.addEventListener('DOMContentLoaded', initializePage);


function handleContactForm() {
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById("contact-name").value;
            const email = document.getElementById("contact-email").value;
            const message = document.getElementById("contact-message").value;

            if (!name || !email || !message) {
                document.getElementById("contact-result").innerHTML = '<p class="text-danger">Please fill in all fields.</p>';
                return;
            }

            fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            })
            .then(response => {
                console.log('Response status:', response.status); // Debug status
                console.log('Response ok:', response.ok); // Debug if successful
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text(); // Get raw text first to debug
            })
            .then(text => {
                console.log('Raw response:', text); // Log raw response
                try {
                    const data = JSON.parse(text); // Attempt to parse JSON
                    if (data.success) {
                        document.getElementById("contact-result").innerHTML = '<p class="text-success">Message sent successfully!</p>';
                        contactForm.reset();
                    } else {
                        document.getElementById("contact-result").innerHTML = '<p class="text-danger">Error: ' + data.error + '</p>';
                    }
                } catch (e) {
                    throw new Error('Invalid JSON: ' + text);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                document.getElementById("contact-result").innerHTML = '<p class="text-danger">Error: ' + error.message + '</p>';
            });
        });
    }
}

// Update window.onload to include contact form handling
window.onload = function() {
    // const isIndexPage = document.querySelector('.hero-section');
    // displayProducts(isIndexPage ? products.slice(0, 3) : products);
    // updateCartCount();
    // typeEffect();
    handleContactForm(); // Add this line
};