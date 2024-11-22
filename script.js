const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-itens");
const cartTotal = document.querySelector("#cart-modal p span"); // Total no modal
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

// Array para armazenar os itens do carrinho
let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
    cartModal.style.display = "flex";
    updateCartModal();
});

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none";
});

// Adicionar item ao carrinho ao clicar no botão
menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn");

    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));

        // Adicionar ao carrinho
        addToCart(name, price);
    }
});

function addToCart(name, price) {
    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }

    updateCartModal();
}

// Atualiza o modal do carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;

    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "items-center", "mb-4");

    cartItemElement.innerHTML = `
      <div class="flex flex-col space-y-1">
        <p class="font-bold">${item.name}</p>
        <p>Quantidade: ${item.quantity}</p>
        <p>Preço unitário: R$ ${item.price.toFixed(2)}</p>
        <p>Total: R$ ${(item.price * item.quantity).toFixed(2)}</p>
      </div>
      <button
        class="remove-from-cart-btn text-red-500 hover:text-red-700 px-2 py-1 rounded"
        data-name="${item.name}"
      >
        Remover
      </button>
    `;
  
      cartItemsContainer.appendChild(cartItemElement);
    });
  
    
    // Atualizar total e contador
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
    cartCounter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// função para remover do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}


// Finalizar pedido
checkoutBtn.addEventListener("click", function () {
   
     const isOpen = checkRestaurantOpen();
     if(!isOpen){
     
        Toastify({
            text: "Opa, o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();

     return;
   }
   
    const address = addressInput.value.trim();

    if (!address) {
        addressWarn.hidden = false;
        return;
    }

    addressWarn.hidden = true;

    // Enviar o pedido para api whats
    const cartItems = cart.map((item) =>{
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "77999819542"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    
    cart = []; // Limpa o carrinho
    updateCartModal();
    cartModal.style.display = "none";
});


// verificar a hora e manipular o card horario
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 23;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500")
}