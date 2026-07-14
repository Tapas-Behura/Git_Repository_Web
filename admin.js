/* ============================================
   Glam Studio Nibedita - Admin Panel Logic
   ============================================ */

// ========== CONFIG ==========
const ADMIN_CREDENTIALS_KEY = 'glamAdmin_credentials';
const PRODUCTS_KEY          = 'glamProducts';
const PHOTOS_KEY            = 'glamPhotos';
const SESSION_KEY           = 'glamAdmin_session';

// Default credentials (username / password)
const DEFAULT_USER = 'admin';
const DEFAULT_PASS = 'glamstudio2024';

// ========== DEFAULT PRODUCT DATA ==========
const DEFAULT_PRODUCTS = [
    { id: 1, name: 'Brightening Face Cream', category: 'face',   price: 599,  discount: 0,  size: '50ml',  desc: 'Vitamin C enriched day cream for radiant, even-toned skin.',        badge: 'Best Seller', stars: 5,   image: '' },
    { id: 2, name: 'Nourishing Night Cream',  category: 'face',   price: 749,  discount: 0,  size: '50ml',  desc: 'Deep moisturising retinol cream for overnight skin repair.',         badge: '',            stars: 4.5, image: '' },
    { id: 3, name: 'Glow Booster Serum',      category: 'face',   price: 899,  discount: 0,  size: '30ml',  desc: 'Hyaluronic acid & niacinamide serum for instant glow.',              badge: 'New',         stars: 5,   image: '' },
    { id: 4, name: 'Silky Body Lotion',        category: 'body',   price: 449,  discount: 0,  size: '200ml', desc: 'Shea butter & aloe vera lotion for soft, glowing skin.',             badge: 'Best Seller', stars: 5,   image: '' },
    { id: 5, name: 'Coffee Body Scrub',        category: 'body',   price: 349,  discount: 0,  size: '150g',  desc: 'Exfoliating coffee scrub for smooth, renewed skin.',                 badge: '',            stars: 4.5, image: '' },
    { id: 6, name: 'Argan Oil Hair Serum',     category: 'hair',   price: 699,  discount: 0,  size: '100ml', desc: 'Frizz-control serum for shiny, smooth, manageable hair.',            badge: 'New',         stars: 5,   image: '' },
    { id: 7, name: 'Deep Repair Hair Mask',    category: 'hair',   price: 549,  discount: 0,  size: '200g',  desc: 'Keratin-rich mask for damaged, dry and frizzy hair.',                badge: '',            stars: 4.5, image: '' },
    { id: 8, name: 'Luxe Lip Gloss',           category: 'makeup', price: 299,  discount: 0,  size: '5ml',   desc: 'High-shine moisturising lip gloss in 6 gorgeous shades.',            badge: '',            stars: 5,   image: '' },
    { id: 9, name: 'Flawless Foundation',      category: 'makeup', price: 999,  discount: 0,  size: '30ml',  desc: 'Full-coverage, long-lasting foundation in 12 shades.',               badge: 'Popular',     stars: 4.5, image: '' },
];

// ========== STATE ==========
let products = [];
let photos   = {};
let editingProductId = null;
let deleteTargetId   = null;

// ========== STORAGE HELPERS ==========
function loadProducts() {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
}

function saveProducts() {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

function loadPhotos() {
    const raw = localStorage.getItem(PHOTOS_KEY);
    return raw ? JSON.parse(raw) : {};
}

function savePhotos() {
    localStorage.setItem(PHOTOS_KEY, JSON.stringify(photos));
}

function getCredentials() {
    const raw = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
    return raw ? JSON.parse(raw) : { user: DEFAULT_USER, pass: DEFAULT_PASS };
}

function saveCredentials(user, pass) {
    localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify({ user, pass }));
}

function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === '1';
}

function setSession() {
    sessionStorage.setItem(SESSION_KEY, '1');
}

function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
}

// ========== TOAST ==========
const toast = document.getElementById('adminToast');
let toastTimer;

function showToast(msg, type = 'success') {
    clearTimeout(toastTimer);
    toast.textContent = '';
    const icon = document.createElement('i');
    icon.className = type === 'success' ? 'fas fa-check-circle'
                   : type === 'error'   ? 'fas fa-times-circle'
                   : 'fas fa-info-circle';
    toast.appendChild(icon);
    toast.appendChild(document.createTextNode(' ' + msg));
    toast.className = `admin-toast show ${type}`;
    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
    products = loadProducts();
    photos   = loadPhotos();

    if (isLoggedIn()) {
        showDashboard();
    } else {
        showLogin();
    }
});

// ========== LOGIN ==========
const loginPage      = document.getElementById('loginPage');
const adminDashboard = document.getElementById('adminDashboard');

function showLogin() {
    loginPage.style.display      = 'flex';
    adminDashboard.style.display = 'none';
}

function showDashboard() {
    loginPage.style.display      = 'none';
    adminDashboard.style.display = 'flex';
    renderProductsTable();
    renderPhotoSlots();
}

// Login form
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const user     = document.getElementById('adminUser').value.trim();
    const pass     = document.getElementById('adminPass').value;
    const creds    = getCredentials();
    const errorEl  = document.getElementById('loginError');
    const loginBtn = document.getElementById('loginBtn');

    if (user === creds.user && pass === creds.pass) {
        errorEl.textContent = '';
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        setTimeout(() => {
            setSession();
            showDashboard();
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<span>Sign In</span><i class="fas fa-arrow-right"></i>';
        }, 800);
    } else {
        errorEl.textContent = 'Incorrect username or password.';
        document.getElementById('adminPass').value = '';
        document.getElementById('adminPass').focus();
    }
});

// Show/hide password
document.getElementById('togglePass').addEventListener('click', () => {
    const inp  = document.getElementById('adminPass');
    const icon = document.querySelector('#togglePass i');
    if (inp.type === 'password') {
        inp.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        inp.type = 'password';
        icon.className = 'fas fa-eye';
    }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    clearSession();
    showLogin();
    showToast('Logged out successfully.', 'info');
});

// ========== SIDEBAR NAVIGATION ==========
const sidebarToggle = document.getElementById('sidebarToggle');
const adminSidebar  = document.getElementById('adminSidebar');

sidebarToggle.addEventListener('click', () => {
    adminSidebar.classList.toggle('mobile-open');
});

// Close sidebar on outside click (mobile)
document.addEventListener('click', (e) => {
    if (!adminSidebar.contains(e.target) && e.target !== sidebarToggle) {
        adminSidebar.classList.remove('mobile-open');
    }
});

document.querySelectorAll('.nav-item[data-panel]').forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active nav
        document.querySelectorAll('.nav-item[data-panel]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Show panel
        const panelId = btn.dataset.panel;
        document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
        document.getElementById('panel-' + panelId).classList.add('active');

        // Update page title
        const titles = { products: 'Products', photos: 'Site Photos', settings: 'Settings' };
        document.getElementById('pageTitle').textContent = titles[panelId] || 'Dashboard';

        // Close mobile sidebar
        adminSidebar.classList.remove('mobile-open');
    });
});

// ========== PRODUCTS TABLE ==========
function starsHTML(rating) {
    let html = '';
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    for (let i = 0; i < full; i++) html += '<i class="fas fa-star" style="color:#d4af37;font-size:11px;"></i>';
    if (half) html += '<i class="fas fa-star-half-alt" style="color:#d4af37;font-size:11px;"></i>';
    return html;
}

function categoryPill(cat) {
    const labels = { face: 'Face Care', hair: 'Hair Care', body: 'Body Care', makeup: 'Makeup' };
    return `<span class="category-pill cat-${cat}">${labels[cat] || cat}</span>`;
}

function renderProductsTable(filterCat = 'all', searchTerm = '') {
    const tbody    = document.getElementById('productsTableBody');
    const emptyEl  = document.getElementById('tableEmpty');
    tbody.innerHTML = '';

    const term     = searchTerm.toLowerCase();
    const filtered = products.filter(p => {
        const matchCat  = filterCat === 'all' || p.category === filterCat;
        const matchSearch = !term || p.name.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term);
        return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
        emptyEl.style.display = 'block';
        return;
    }
    emptyEl.style.display = 'none';

    filtered.forEach(p => {
        const tr = document.createElement('tr');

        // Image cell
        const imgCell = p.image
            ? `<div class="table-product-img"><img src="${p.image}" alt="${p.name}"></div>`
            : `<div class="table-product-img"><div class="no-img"><i class="fas fa-box"></i></div></div>`;

        tr.innerHTML = `
            <td>${imgCell}</td>
            <td>
                <div class="product-name-cell">${p.name}</div>
                <div class="product-desc-cell">${p.desc.substring(0, 60)}${p.desc.length > 60 ? '...' : ''}</div>
            </td>
            <td>${categoryPill(p.category)}</td>
            <td class="price-cell">
                ₹${p.price.toLocaleString()}
                ${p.discount > 0 ? `<div class="table-sale-price">₹${Math.round(p.price * (1 - p.discount / 100)).toLocaleString()}</div>` : ''}
            </td>
            <td>${p.discount > 0 ? `<span class="discount-pill">${p.discount}% OFF</span>` : '—'}</td>
            <td>${p.size || '—'}</td>
            <td>${p.badge ? `<span class="badge-pill">${p.badge}</span>` : '—'}</td>
            <td>
                <div class="action-btns">
                    <button class="action-btn action-edit" data-id="${p.id}" title="Edit">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="action-btn action-delete" data-id="${p.id}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>`;
        tbody.appendChild(tr);
    });

    // Wire edit & delete buttons
    tbody.querySelectorAll('.action-edit').forEach(btn => {
        btn.addEventListener('click', () => openEditModal(parseInt(btn.dataset.id)));
    });
    tbody.querySelectorAll('.action-delete').forEach(btn => {
        btn.addEventListener('click', () => openDeleteModal(parseInt(btn.dataset.id)));
    });
}

// Search & filter listeners
document.getElementById('productSearch').addEventListener('input', (e) => {
    renderProductsTable(document.getElementById('categoryFilter').value, e.target.value);
});

document.getElementById('categoryFilter').addEventListener('change', (e) => {
    renderProductsTable(e.target.value, document.getElementById('productSearch').value);
});

// ========== PRODUCT MODAL (Add / Edit) ==========
const productModalBg  = document.getElementById('productModalBg');
const productForm     = document.getElementById('productForm');
const imgUploadArea   = document.getElementById('imgUploadArea');
const imgUploadPreview = document.getElementById('imgUploadPreview');
const imgUploadActions = document.getElementById('imgUploadActions');
const pImageFile      = document.getElementById('pImageFile');
const pImageData      = document.getElementById('pImageData');

function openAddModal() {
    editingProductId = null;
    document.getElementById('modalTitle').textContent = 'Add Product';
    productForm.reset();
    pImageData.value = '';
    resetImagePreview();
    document.getElementById('productFormError').textContent = '';
    productModalBg.classList.add('active');
    document.getElementById('pName').focus();
}

function openEditModal(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    editingProductId = id;
    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('productId').value   = p.id;
    document.getElementById('pName').value       = p.name;
    document.getElementById('pCategory').value   = p.category;
    document.getElementById('pPrice').value      = p.price;
    document.getElementById('pDiscount').value   = p.discount || 0;
    document.getElementById('pSize').value       = p.size;
    document.getElementById('pDesc').value       = p.desc;
    document.getElementById('pBadge').value      = p.badge || '';
    document.getElementById('pStars').value      = p.stars;
    pImageData.value = p.image || '';
    if (p.image) {
        imgUploadPreview.innerHTML = `<img src="${p.image}" alt="Product image">`;
        imgUploadActions.style.display = 'flex';
    } else {
        resetImagePreview();
    }
    document.getElementById('productFormError').textContent = '';
    productModalBg.classList.add('active');
    document.getElementById('pName').focus();
}

function closeProductModal() {
    productModalBg.classList.remove('active');
    editingProductId = null;
}

function resetImagePreview() {
    imgUploadPreview.innerHTML = `<i class="fas fa-image"></i><span>Click or drag to upload</span>`;
    imgUploadActions.style.display = 'none';
}

// Open file picker on preview click
imgUploadArea.addEventListener('click', (e) => {
    if (!e.target.closest('#imgUploadActions')) {
        pImageFile.click();
    }
});

// Drag and drop
imgUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    imgUploadArea.style.borderColor = 'var(--primary)';
});
imgUploadArea.addEventListener('dragleave', () => {
    imgUploadArea.style.borderColor = '';
});
imgUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    imgUploadArea.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleImageFile(file);
});

pImageFile.addEventListener('change', () => {
    if (pImageFile.files[0]) handleImageFile(pImageFile.files[0]);
});

function handleImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const dataUrl = e.target.result;
        pImageData.value = dataUrl;
        imgUploadPreview.innerHTML = `<img src="${dataUrl}" alt="Preview">`;
        imgUploadActions.style.display = 'flex';
    };
    reader.readAsDataURL(file);
}

document.getElementById('changeImgBtn').addEventListener('click', () => pImageFile.click());
document.getElementById('removeImgBtn').addEventListener('click', () => {
    pImageData.value = '';
    pImageFile.value = '';
    resetImagePreview();
});

// Open/close product modal
document.getElementById('addProductBtn').addEventListener('click', openAddModal);
document.getElementById('closeProductModal').addEventListener('click', closeProductModal);
document.getElementById('cancelProductBtn').addEventListener('click', closeProductModal);
productModalBg.addEventListener('click', (e) => {
    if (e.target === productModalBg) closeProductModal();
});

// Form submit
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('productFormError');
    errorEl.textContent = '';

    const name     = document.getElementById('pName').value.trim();
    const category = document.getElementById('pCategory').value;
    const price    = parseInt(document.getElementById('pPrice').value);
    const discount = Math.min(99, Math.max(0, parseInt(document.getElementById('pDiscount').value) || 0));
    const size     = document.getElementById('pSize').value.trim();
    const desc     = document.getElementById('pDesc').value.trim();
    const badge    = document.getElementById('pBadge').value;
    const stars    = parseFloat(document.getElementById('pStars').value) || 5;
    const image    = pImageData.value;

    if (!name)        { errorEl.textContent = 'Product name is required.'; return; }
    if (!category)    { errorEl.textContent = 'Please select a category.'; return; }
    if (!price || price < 1) { errorEl.textContent = 'Please enter a valid price.'; return; }

    if (editingProductId !== null) {
        // Update existing
        const idx = products.findIndex(p => p.id === editingProductId);
        if (idx !== -1) {
            products[idx] = { ...products[idx], name, category, price, discount, size, desc, badge, stars, image };
            showToast(`"${name}" updated successfully.`, 'success');
        }
    } else {
        // Add new
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, name, category, price, discount, size, desc, badge, stars, image });
        showToast(`"${name}" added to shop.`, 'success');
    }

    saveProducts();
    renderProductsTable(
        document.getElementById('categoryFilter').value,
        document.getElementById('productSearch').value
    );
    closeProductModal();
});

// ========== DELETE MODAL ==========
const deleteModalBg = document.getElementById('deleteModalBg');

function openDeleteModal(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    deleteTargetId = id;
    document.getElementById('deleteProductName').textContent = p.name;
    deleteModalBg.classList.add('active');
}

function closeDeleteModal() {
    deleteModalBg.classList.remove('active');
    deleteTargetId = null;
}

document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
deleteModalBg.addEventListener('click', (e) => {
    if (e.target === deleteModalBg) closeDeleteModal();
});

document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    if (deleteTargetId === null) return;
    const p = products.find(x => x.id === deleteTargetId);
    products = products.filter(x => x.id !== deleteTargetId);
    saveProducts();
    renderProductsTable(
        document.getElementById('categoryFilter').value,
        document.getElementById('productSearch').value
    );
    showToast(`"${p?.name}" deleted.`, 'error');
    closeDeleteModal();
});

// ========== PHOTO MANAGEMENT ==========
const PHOTO_KEYS = [
    'site-logo',
    'banner-1','banner-2','banner-3','banner-4',
    'gallery-1','gallery-2','gallery-3','gallery-4','gallery-5','gallery-6',
    'about-1','about-2','about-3',
    'svc-haircut','svc-hairspa','svc-bridal','svc-nails','svc-facial',
    'svc-manicure','svc-straightening','svc-botox','svc-threading'
];

function renderPhotoSlots() {
    PHOTO_KEYS.forEach(key => {
        const previewEl = document.getElementById('prev-' + key);
        if (!previewEl) return;
        if (photos[key]) {
            previewEl.innerHTML = `<img src="${photos[key]}" alt="${key}">`;
            previewEl.classList.add('has-image');
        } else {
            previewEl.innerHTML = '<i class="fas fa-image"></i>';
            previewEl.classList.remove('has-image');
        }
    });
}

// Wire all upload inputs
document.querySelectorAll('.slot-upload-btn input[type="file"]').forEach(input => {
    input.addEventListener('change', () => {
        const key  = input.dataset.target;
        const file = input.files[0];
        if (!file || !file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            photos[key] = e.target.result;
            savePhotos();
            renderPhotoSlots();
            showToast(`Photo "${key}" updated.`, 'success');
        };
        reader.readAsDataURL(file);
        input.value = ''; // allow re-upload same file
    });
});

// Wire all remove buttons
document.querySelectorAll('.slot-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const key = btn.dataset.target;
        delete photos[key];
        savePhotos();
        renderPhotoSlots();
        showToast(`Photo "${key}" removed.`, 'info');
    });
});

// ========== SETTINGS PANEL ==========
document.getElementById('changePassForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const msgEl    = document.getElementById('settingsMsg');
    const current  = document.getElementById('currentPass').value;
    const newPass  = document.getElementById('newPass').value;
    const confirm  = document.getElementById('confirmPass').value;
    const creds    = getCredentials();

    if (current !== creds.pass) {
        msgEl.textContent = 'Current password is incorrect.';
        msgEl.className   = 'settings-msg error';
        return;
    }
    if (newPass.length < 6) {
        msgEl.textContent = 'New password must be at least 6 characters.';
        msgEl.className   = 'settings-msg error';
        return;
    }
    if (newPass !== confirm) {
        msgEl.textContent = 'New passwords do not match.';
        msgEl.className   = 'settings-msg error';
        return;
    }

    saveCredentials(creds.user, newPass);
    document.getElementById('changePassForm').reset();
    msgEl.textContent = '✓ Password updated successfully!';
    msgEl.className   = 'settings-msg success';
    showToast('Password changed.', 'success');
    setTimeout(() => { msgEl.textContent = ''; }, 4000);
});

// Export products as JSON
document.getElementById('exportDataBtn').addEventListener('click', () => {
    const json = JSON.stringify(products, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'glamstudio_products.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Products exported as JSON.', 'info');
});

// Reset to default products
document.getElementById('resetDataBtn').addEventListener('click', () => {
    if (!confirm('This will reset ALL products to the original defaults. Are you sure?')) return;
    products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
    saveProducts();
    renderProductsTable();
    showToast('Products reset to defaults.', 'info');
});

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProductModal();
        closeDeleteModal();
    }
    // Ctrl + N = add product (when dashboard is visible)
    if (e.ctrlKey && e.key === 'n' && document.getElementById('adminDashboard').style.display !== 'none') {
        e.preventDefault();
        openAddModal();
    }
});
