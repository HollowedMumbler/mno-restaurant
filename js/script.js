// ── DATA ──────────────────────────────────────────────────────
const MENU = [
  { id:1,  name:'Calamari Rings',      price:145, cat:'Appetizers' },
  { id:2,  name:'Chicken Wings',       price:165, cat:'Appetizers' },
  { id:3,  name:'Cheese Sticks',       price:95,  cat:'Appetizers' },
  { id:4,  name:'Nachos with Salsa',   price:120, cat:'Appetizers' },
  { id:5,  name:'Soup of the Day',     price:85,  cat:'Appetizers' },

  { id:6,  name:'Grilled Chicken',     price:220, cat:'Mains' },
  { id:7,  name:'Pork Sinigang',       price:195, cat:'Mains' },
  { id:8,  name:'Beef Steak',          price:295, cat:'Mains' },
  { id:9,  name:'Pork BBQ Ribs',       price:320, cat:'Mains' },
  { id:10, name:'Seafood Pasta',       price:260, cat:'Mains' },
  { id:11, name:'Fish & Chips',        price:210, cat:'Mains' },
  { id:12, name:'Vegetable Stir Fry',  price:175, cat:'Mains' },

  { id:13, name:'Garlic Rice',         price:60,  cat:'Sides' },
  { id:14, name:'Steamed Rice',        price:40,  cat:'Sides' },
  { id:15, name:'Mixed Vegetables',    price:80,  cat:'Sides' },
  { id:16, name:'French Fries',        price:75,  cat:'Sides' },
  { id:17, name:'Coleslaw',            price:55,  cat:'Sides' },

  { id:18, name:'Halo-Halo',           price:120, cat:'Desserts' },
  { id:19, name:'Chocolate Lava Cake', price:135, cat:'Desserts' },
  { id:20, name:'Leche Flan',          price:95,  cat:'Desserts' },
  { id:21, name:'Mango Panna Cotta',   price:110, cat:'Desserts' },

  { id:22, name:'Iced Tea',            price:55,  cat:'Drinks' },
  { id:23, name:'Coke Float',          price:75,  cat:'Drinks' },
  { id:24, name:'Fresh Buko Juice',    price:70,  cat:'Drinks' },
  { id:25, name:'Bottled Water',       price:35,  cat:'Drinks' },
  { id:26, name:'Hot Coffee',          price:80,  cat:'Drinks' },
  { id:27, name:'Fruit Shake',         price:95,  cat:'Drinks' },
];

let cart = [];
let orders = JSON.parse(localStorage.getItem('mno_orders') || '[]');
let sales = JSON.parse(localStorage.getItem('mno_sales') || '[]');
let orderCounter = parseInt(localStorage.getItem('mno_counter') || '1000');

// ── SAVE ──────────────────────────────────────────────────────
function save() {
  localStorage.setItem('mno_orders', JSON.stringify(orders));
  localStorage.setItem('mno_sales', JSON.stringify(sales));
  localStorage.setItem('mno_counter', orderCounter);
}

// ── CLOCK ─────────────────────────────────────────────────────
function updateClock() {
  const clock = document.getElementById('clock');

  if (clock) {
    clock.textContent = new Date().toLocaleTimeString('en-PH', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

setInterval(updateClock, 1000);
updateClock();

// ── ROLE SWITCH ───────────────────────────────────────────────
function switchRole(role) {

  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });

  document.querySelectorAll('.role-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  document.getElementById('view-' + role)?.classList.add('active');
  document.getElementById('btn-' + role)?.classList.add('active');

  if (role === 'cashier') renderCashier();
  if (role === 'kitchen') renderKitchen();
  if (role === 'manager') renderManager();
}

// ── WAITER ────────────────────────────────────────────────────
const CATS = [
  'Appetizers',
  'Mains',
  'Sides',
  'Desserts',
  'Drinks'
];

let activecat = 'Appetizers';
let customizeMode = false;
let remarkTargetId = null;

function renderCatTabs() {

  const tabs = document.getElementById('cat-tabs');

  if (!tabs) return;

  tabs.innerHTML = CATS.map(cat => `
    <button
      onclick="setcat('${cat}')"
      id="tab-${cat}"
      class="
        px-4 py-1.5 rounded-lg text-sm font-500 transition-all border
        ${
          cat === activecat
            ? 'bg-gray-900 text-white border-gray-900'
            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
        }
      ">

      ${cat}

    </button>
  `).join('');
}

function setcat(cat) {
  activecat = cat;
  renderCatTabs();
  renderMenu();
}

function renderMenu() {

  const grid = document.getElementById('menu-grid');

  if (!grid) return;

  const items = MENU.filter(item => item.cat === activecat);

  grid.innerHTML = items.map(item => `
    <button
      onclick="addToCart(${item.id})"
      class="
        bg-white border border-gray-100 rounded-2xl p-4 text-left
        hover:border-gray-300 hover:shadow-sm transition-all
      ">

      <p class="font-500 text-gray-800 text-sm leading-tight">
        ${item.name}
      </p>

      <p class="mono text-gray-900 font-600 text-base mt-2">
        ₱${item.price}
      </p>

    </button>
  `).join('');
}

function addToCart(id) {

  const item = MENU.find(menuItem => menuItem.id === id);

  if (!item) return;

  const existing = cart.find(cartItem => cartItem.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      ...item,
      qty: 1,
      remark: ''
    });
  }

  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function toggleCustomize() {

  customizeMode = !customizeMode;

  const btn = document.getElementById('customize-btn');

  if (!btn) return;

  btn.textContent = customizeMode
    ? '✓ Done'
    : '✏️ Customize';

  btn.className = customizeMode
    ? 'text-xs px-3 py-1.5 rounded-lg border border-gray-900 bg-gray-900 text-white transition-all'
    : 'text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-800 transition-all';

  renderCart();
}

function renderCart() {

  const container = document.getElementById('cart-items');
  const empty = document.getElementById('cart-empty');

  if (!container || !empty) return;

  if (cart.length === 0) {

    container.innerHTML = '';
    empty.style.display = 'flex';

  } else {

    empty.style.display = 'none';

    container.innerHTML = cart.map(item => `
      <div class="text-sm">

        <div class="flex items-center justify-between">

          <span class="text-gray-700">
            ${item.name}
            <span class="text-gray-400">×${item.qty}</span>
          </span>

          <span class="mono text-gray-600">
            ₱${item.price * item.qty}
          </span>

        </div>

      </div>
    `).join('');
  }

  const subtotal = cart.reduce((sum, item) => {
    return sum + (item.price * item.qty);
  }, 0);

  const tax = subtotal * 0.12;
  const total = subtotal + tax;

  document.getElementById('cart-sub').textContent =
    '₱' + subtotal.toFixed(2);

  document.getElementById('cart-tax').textContent =
    '₱' + tax.toFixed(2);

  document.getElementById('cart-total').textContent =
    '₱' + total.toFixed(2);
}

// ── INIT ──────────────────────────────────────────────────────
renderCatTabs();
renderMenu();
renderCart();