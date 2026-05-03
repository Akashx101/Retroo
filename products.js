const retrooDB = {
    products: [
        { id: 'p1', name: 'Goldcock Lite', type: 'Sunglasses', oldPrice: '₹599', newPrice: '₹299', img: 'https://i.ibb.co/BHCDmSjL/IMG-20260430-204634.png', sale: true },
        { id: 'p2', name: 'Lite de-sept', type: 'Sunglasses', oldPrice: '₹300', newPrice: '₹199', img: 'https://i.ibb.co/C3mWdkwy/1777524952467.png', sale: true },
        { id: 'p3', name: 'Silver Kada', type: 'bracelet', oldPrice: '₹399', newPrice: '₹249', img: 'https://i.ibb.co/KcHCyQnQ/IMG-20260503-190323.png', sale: true },
        { id: 'p4', name: 'Steel Pendant', type: 'pendant', oldPrice: '₹2,100', newPrice: '₹1,299', img: 'https://images.unsplash.com/photo-1599643478514-4a4e51111611?q=80&w=600&auto=format&fit=crop&grayscale', sale: true }
    ],

    getStorage: (key) => { try { return JSON.parse(localStorage.getItem(key)) || []; } catch(e) { return []; } },
    setStorage: (key, data) => { try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) {} },

    toggleWishlist: function(id, event) {
        if(event) event.stopPropagation(); 
        let wishlist = this.getStorage('retroo_wishlist');
        const index = wishlist.indexOf(id);
        if(index > -1) wishlist.splice(index, 1); else wishlist.push(id);
        this.setStorage('retroo_wishlist', wishlist);
        this.init(); 
    },

    addToCart: function(id) {
        let cart = this.getStorage('retroo_cart');
        let item = cart.find(i => i.id === id);
        if(item) item.qty++; else cart.push({id: id, qty: 1});
        this.setStorage('retroo_cart', cart);
        alert("ADDED TO CART"); 
    },
    
    renderCart: function() {
        const container = document.getElementById('cart-container');
        if(!container) return;
        let cart = this.getStorage('retroo_cart');
        
        if(cart.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 40px;"><i class="ph-thin ph-shopping-cart" style="font-size: 48px;"></i><p style="margin-top: 10px;">Your cart is empty.</p><button class="btn" style="margin-top: 20px;" onclick="window.location.href='/'">Shop Now</button></div>`;
            return;
        }

        let html = '';
        cart.forEach(cartItem => {
            let product = this.products.find(p => p.id === cartItem.id);
            if(product) {
                html += `
                <div style="display: flex; gap: 15px; border: 1px solid var(--border); padding: 15px; margin-bottom: 15px;">
                    <img src="${product.img}" style="width: 80px; height: 100px; object-fit: cover;">
                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
                        <h3 style="font-size: 12px; text-transform: uppercase;">${product.name}</h3>
                        <p style="color: var(--text-muted); font-size: 10px;">QTY: ${cartItem.qty}</p>
                        <p style="margin-top: 5px;">${product.newPrice}</p>
                    </div>
                </div>`;
            }
        });
        
        html += `<button class="btn" style="width: 100%; margin-top: 10px;" onclick="document.getElementById('checkout-modal').style.display='block'">PROCEED TO CHECKOUT</button>`;
        container.innerHTML = html;
    },

    placeOrder: function() {
        document.getElementById('checkout-modal').style.display = 'none';
        document.getElementById('success-overlay').style.display = 'flex';

        let cart = this.getStorage('retroo_cart');
        let orders = this.getStorage('retroo_orders');
        let address = document.getElementById('address-input').value;
        
        let newOrder = {
            orderId: 'RT-' + Math.floor(1000 + Math.random() * 9000),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            items: cart,
            location: address,
            status: 'Processing'
        };
        
        orders.unshift(newOrder); 
        this.setStorage('retroo_orders', orders);
        this.setStorage('retroo_cart', []); 

        setTimeout(() => { window.location.href = '/orderhistory'; }, 2500);
    },

    renderOrders: function() {
        const container = document.getElementById('order-history-container');
        if(!container) return;
        let orders = this.getStorage('retroo_orders');
        
        if(orders.length === 0) {
            container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 40px; font-size: 11px; text-transform: uppercase;">No past orders found.</p>`;
            return;
        }

        container.innerHTML = orders.map(order => `
            <div style="border: 1px solid var(--border); padding: 20px; font-size: 11px; margin-bottom: 15px;">
                <p><strong>Order #${order.orderId}</strong> - ${order.status}</p>
                <p style="color: var(--text-muted); margin-top: 5px;">Placed on ${order.date}</p>
                <p style="color: var(--text-muted); margin-top: 5px; font-size: 9px;">Shipping to: ${order.location}</p>
                <hr style="border-color: var(--border); margin: 10px 0;">
                ${order.items.map(item => {
                    let p = this.products.find(x => x.id === item.id);
                    return p ? `<p>${item.qty}x ${p.name}</p>` : '';
                }).join('')}
            </div>
        `).join('');
    },

    renderProductHome: function() {
        const container = document.getElementById('product-home-container');
        if(!container) return;
        
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');
        const product = this.products.find(p => p.id === productId);

        if(!product) {
            container.innerHTML = `<h2 style="text-align:center; margin-top: 50px;">Product not found</h2>`;
            return;
        }

        container.innerHTML = `
            <div class="split-image"><img src="${product.img}" alt="${product.name}" style="width:100%; height: 60vh; object-fit: cover;"></div>
            <div class="split-text" style="padding: 30px;">
                <h2 style="font-size: 24px; font-family: 'Syncopate', sans-serif; text-transform: uppercase;">${product.name}</h2>
                <p style="font-size: 14px; margin: 15px 0;"><span class="old-price" style="text-decoration: line-through; color: #666; margin-right: 10px;">${product.oldPrice || ''}</span> ${product.newPrice}</p>
                <p style="color: var(--text-muted); line-height: 1.6; font-size: 11px;">Precision-engineered minimalist design. Water-resistant and built to withstand the elements while maintaining a raw, streetwear aesthetic.</p>
                <button class="btn" style="width: 100%; margin-top: 30px; padding: 15px; font-size: 12px;" onclick="retrooDB.addToCart('${product.id}')">ADD TO CART</button>
            </div>
        `;
    },

    renderGrid: function(containerId, itemsToRender = this.products) {
        const container = document.getElementById(containerId);
        if(!container) return;
        const wishlist = this.getStorage('retroo_wishlist');
        
        container.innerHTML = itemsToRender.map(p => {
            const isLiked = wishlist.includes(p.id);
            const heartIcon = isLiked ? 'ph-fill ph-heart liked' : 'ph-thin ph-heart';
            return `
            <div class="product-card" onclick="window.location.href='/producthome?id=${p.id}'">
                <img src="${p.img}" alt="${p.name}">
                <i class="${heartIcon} like-btn" onclick="retrooDB.toggleWishlist('${p.id}', event)"></i>
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <div class="price-wrap"><span>${p.newPrice}</span></div>
                </div>
            </div>`}).join('');
    },

    init: function() {
        if(document.getElementById('home-product-grid')) this.renderGrid('home-product-grid');
        if(document.getElementById('wishlist-grid')) {
            let wIds = this.getStorage('retroo_wishlist');
            let wProds = this.products.filter(p => wIds.includes(p.id));
            this.renderGrid('wishlist-grid', wProds);
        }
        if(document.getElementById('new-drops-grid')) this.renderGrid('new-drops-grid');
        if(document.getElementById('cart-container')) this.renderCart();
        if(document.getElementById('order-history-container')) this.renderOrders();
        if(document.getElementById('product-home-container')) this.renderProductHome();
    }
};

document.addEventListener("DOMContentLoaded", () => retrooDB.init());

// ==========================================
// THE IFRAME BROADCASTER (For InfinityFree)
// ==========================================
(function() {
    if (window.top !== window.self) {
        const currentPath = window.location.pathname + window.location.search;
        window.parent.postMessage({ type: "URL_CHANGE", path: currentPath }, "*");
    }
})();