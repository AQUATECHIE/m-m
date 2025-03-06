document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const order = JSON.parse(urlParams.get('order'));
    const orderId = 'ORD' + Math.random().toString(36).substr(2, 9);
    
    document.getElementById('order-id').textContent = orderId;
    
    const summary = document.getElementById('order-summary');
    order.forEach(item => {
        summary.innerHTML += `<p>${item.name} - $${item.price}</p>`;
    });

    document.getElementById('confirm-payment').addEventListener('click', () => {
        // Here you would typically integrate with a payment gateway
        // For this example, we'll simulate payment success
        sendOrderEmail(order, orderId);
        alert('Payment successful! Order confirmed.');
    });
});

function sendOrderEmail(order, orderId) {
    // This would typically be handled server-side with Node.js and Nodemailer
    console.log('Email would be sent with:', { order, orderId });
    // Implement server-side code separately
}