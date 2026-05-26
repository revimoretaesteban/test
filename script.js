// Funcionalidad de carrito mejorada con localStorage
class ShoppingCart {
    constructor() {
        this.cartKey = 'solotenisrd_cart';
        this.cart = this.loadCart();
        this.updateCartButton();
    }

    loadCart() {
        const saved = localStorage.getItem(this.cartKey);
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
        this.updateCartButton();
    }

    addProduct(name, price, image, brand) {
        const product = { id: Date.now(), name, price, image, brand };
        this.cart.push(product);
        this.saveCart();
    }

    removeProduct(id) {
        this.cart = this.cart.filter(p => p.id !== id);
        this.saveCart();
    }

    getTotal() {
        return this.cart.reduce((sum, p) => sum + parseInt(p.price.replace(/,/g, '')), 0);
    }

    updateCartButton() {
        const cartBtn = document.querySelector('.cart-btn');
        if (cartBtn) {
            cartBtn.textContent = `Carrito (${this.cart.length})`;
        }
    }

    getCart() {
        return this.cart;
    }
}

const shoppingCart = new ShoppingCart();

// Evento para el botón del carrito
document.addEventListener('DOMContentLoaded', function() {
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'carrito.html';
        });
    }

    // Obtener todos los checkboxes de filtros
    const filterCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
    const productCards = document.querySelectorAll('.product-card');

    // Agregar event listener a cada checkbox
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Función para aplicar los filtros
    function applyFilters() {
        // Obtener todas las marcas seleccionadas
        const selectedBrands = Array.from(filterCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => {
                // Obtener el texto del label que contiene el checkbox
                const labelText = checkbox.closest('label').textContent.trim().toLowerCase();
                return labelText;
            });

        // Mostrar u ocultar productos según los filtros
        productCards.forEach(card => {
            const cardBrand = card.getAttribute('data-brand').toLowerCase();

            // Si no hay filtros seleccionados, mostrar todos los productos
            if (selectedBrands.length === 0) {
                card.style.display = '';
            } else {
                // Mostrar solo si la marca coincide con algún filtro seleccionado
                if (selectedBrands.includes(cardBrand)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    }

    // Carrito funcionalidad mejorada
    const addBtns = document.querySelectorAll('.add-btn');

    addBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener datos del producto
            const card = this.closest('.product-card');
            const name = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').textContent.replace('$', '').replace(/,/g, '').trim();
            const image = card.querySelector('.product-img').src;
            const brand = card.getAttribute('data-brand');
            
            // Añadir al carrito
            shoppingCart.addProduct(name, price, image, brand);
            
            // Efecto visual de confirmación
            this.style.background = 'var(--acento)';
            this.textContent = '✓ Añadido';
            
            setTimeout(() => {
                this.style.background = '';
                this.textContent = 'Añadir';
            }, 1500);
        });
    });
});
