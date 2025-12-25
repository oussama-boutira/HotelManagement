// Hotel management module

// Default hotel image
const DEFAULT_HOTEL_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";

// Create hotel card HTML
const createHotelCard = (hotel) => {
  const isFavorite = hotel.is_favorite;
  const isOwner = getUser()?.id === hotel.user_id;

  return `
        <div class="group cursor-pointer" data-hotel-id="${hotel.id}">
            <div class="relative aspect-square overflow-hidden rounded-xl bg-gray-200 mb-3">
                <!-- Favorite button -->
                <div class="absolute top-3 right-3 z-10">
                    <button 
                        class="heart-btn favorite-btn ${
                          isFavorite ? "text-primary" : "text-white/70"
                        }"
                        data-hotel-id="${hotel.id}"
                        data-is-favorite="${isFavorite}"
                        onclick="event.stopPropagation(); toggleFavorite(${
                          hotel.id
                        })"
                    >
                        <span class="material-symbols-outlined ${
                          isFavorite ? "filled" : ""
                        } text-[28px] drop-shadow-md">
                            favorite
                        </span>
                    </button>
                </div>
                
                <!-- Status badge -->
                ${
                  hotel.status === "full"
                    ? `
                    <div class="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white shadow-sm">
                        Full
                    </div>
                `
                    : ""
                }
                
                <!-- Guest favorite badge -->
                ${
                  hotel.stars === 5
                    ? `
                    <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-text-main shadow-sm">
                        Guest favorite
                    </div>
                `
                    : ""
                }
                
                <!-- Image -->
                <div 
                    class="w-full h-full bg-center bg-cover bg-no-repeat image-zoom"
                    style="background-image: url('${
                      hotel.image_url || DEFAULT_HOTEL_IMAGE
                    }')"
                    onclick="viewHotel(${hotel.id})"
                ></div>
            </div>
            
            <div onclick="viewHotel(${hotel.id})">
                <div class="flex justify-between items-start">
                    <h3 class="font-bold text-text-main dark:text-white text-[15px] truncate">${
                      hotel.name
                    }</h3>
                    <div class="flex items-center gap-1 text-[15px]">
                        <span class="material-symbols-outlined filled text-[14px] text-text-main dark:text-white">star</span>
                        <span class="text-text-main dark:text-white">${
                          hotel.stars || 0
                        }</span>
                    </div>
                </div>
                <p class="text-text-secondary dark:text-gray-400 text-[15px] leading-snug">${
                  hotel.city
                }</p>
                <p class="text-text-secondary dark:text-gray-400 text-[15px] leading-snug">
                    ${
                      hotel.amenities?.slice(0, 2).join(" · ") ||
                      "No amenities listed"
                    }
                </p>
                <div class="mt-1.5 flex items-baseline gap-1">
                    <span class="font-bold text-text-main dark:text-white text-[15px]">$${
                      hotel.price_per_night
                    }</span>
                    <span class="text-text-main dark:text-white text-[15px]">night</span>
                </div>
            </div>
        </div>
    `;
};

// Create hotel list card (for my properties)
const createHotelListCard = (hotel) => {
  const statusClasses = {
    available: "bg-primary text-[#111816]",
    full: "bg-red-500 text-white",
  };

  return `
        <div class="group flex flex-col sm:flex-row items-stretch gap-4 rounded-xl bg-surface-light dark:bg-surface-dark p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:shadow-lg transition-shadow border border-transparent dark:border-[#2A3E38]">
            <!-- Thumbnail -->
            <div 
                class="w-full sm:w-48 h-48 sm:h-32 shrink-0 bg-center bg-no-repeat bg-cover rounded-lg relative overflow-hidden cursor-pointer"
                style="background-image: url('${
                  hotel.image_url || DEFAULT_HOTEL_IMAGE
                }')"
                onclick="viewHotel(${hotel.id})"
            >
                <div class="absolute top-2 left-2 sm:hidden">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      statusClasses[hotel.status] || statusClasses.available
                    }">
                        ${hotel.status === "full" ? "Full" : "Live"}
                    </span>
                </div>
            </div>
            
            <!-- Content -->
            <div class="flex flex-1 flex-col justify-between py-1">
                <div class="flex justify-between items-start gap-2">
                    <div>
                        <h3 class="text-text-main dark:text-white text-lg font-bold leading-tight group-hover:text-primary transition-colors">${
                          hotel.name
                        }</h3>
                        <p class="text-text-secondary dark:text-gray-400 text-sm font-medium mt-1">${
                          hotel.city
                        }</p>
                    </div>
                    <!-- Desktop Badge -->
                    <span class="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      statusClasses[hotel.status] || statusClasses.available
                    }">
                        ${hotel.status === "full" ? "Full" : "Live"}
                    </span>
                </div>
                
                <div class="flex items-end justify-between mt-4 sm:mt-0">
                    <div class="flex flex-col">
                        <span class="text-text-main dark:text-white font-bold">$${
                          hotel.price_per_night
                        } <span class="text-text-secondary dark:text-gray-400 text-sm font-normal">/ night</span></span>
                        <span class="text-xs text-text-secondary dark:text-gray-500 mt-1">⭐ ${
                          hotel.stars
                        } stars</span>
                    </div>
                    
                    <!-- Actions -->
                    <div class="flex items-center gap-2">
                        <button onclick="viewHotel(${
                          hotel.id
                        })" aria-label="View" class="p-2 text-text-secondary hover:text-text-main dark:text-gray-400 dark:hover:text-white hover:bg-background-light dark:hover:bg-background-dark rounded-full transition-colors">
                            <span class="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                        <button onclick="editHotel(${
                          hotel.id
                        })" aria-label="Edit" class="p-2 text-text-secondary hover:text-primary dark:text-gray-400 dark:hover:text-primary hover:bg-background-light dark:hover:bg-background-dark rounded-full transition-colors">
                            <span class="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button onclick="deleteHotel(${
                          hotel.id
                        })" aria-label="Delete" class="p-2 text-text-secondary hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors">
                            <span class="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// Toggle favorite
const toggleFavorite = async (hotelId) => {
  if (!isLoggedIn()) {
    showToast("Please login to add favorites", "info");
    window.location.href = "/login.html";
    return;
  }

  const btn = document.querySelector(
    `.favorite-btn[data-hotel-id="${hotelId}"]`
  );
  if (!btn) return;

  const isFavorite = btn.dataset.isFavorite === "true";

  let result;
  if (isFavorite) {
    result = await api.removeFavorite(hotelId);
  } else {
    result = await api.addFavorite(hotelId);
  }

  if (result.ok) {
    // Update button state
    btn.dataset.isFavorite = (!isFavorite).toString();
    btn.classList.toggle("text-primary", !isFavorite);
    btn.classList.toggle("text-white/70", isFavorite);
    btn
      .querySelector(".material-symbols-outlined")
      .classList.toggle("filled", !isFavorite);

    showToast(
      isFavorite ? "Removed from favorites" : "Added to favorites",
      "success"
    );
  } else {
    showToast(result.data.message || "Failed to update favorite", "error");
  }
};

// View hotel details
const viewHotel = (hotelId) => {
  // For now, just show in modal or navigate
  console.log("View hotel:", hotelId);
  // Could implement modal or detail page
};

// Edit hotel
const editHotel = (hotelId) => {
  window.location.href = `/add-hotel.html?id=${hotelId}`;
};

// Delete hotel
const deleteHotel = async (hotelId) => {
  if (!confirm("Are you sure you want to delete this hotel?")) return;

  const result = await api.deleteHotel(hotelId);

  if (result.ok) {
    showToast("Hotel deleted successfully", "success");
    // Remove from DOM
    const card = document.querySelector(`[data-hotel-id="${hotelId}"]`);
    if (card) card.closest(".group")?.remove() || card.parentElement.remove();

    // Reload if needed
    if (window.loadHotels) window.loadHotels();
  } else {
    showToast(result.data.message || "Failed to delete hotel", "error");
  }
};

// Show toast notification
const showToast = (message, type = "info") => {
  // Remove existing toast
  document.querySelector(".toast")?.remove();

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add("show"), 10);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// Create pagination HTML
const createPagination = (pagination, onPageChange) => {
  const { currentPage, totalPages } = pagination;

  if (totalPages <= 1) return "";

  let html = '<div class="flex justify-center items-center gap-2 mt-8">';

  // Previous button
  html += `
        <button 
            class="pagination-btn px-4 py-2 rounded-lg border border-border-light dark:border-[#2A3E38] ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100 dark:hover:bg-[#253832]"
            }"
            ${currentPage === 1 ? "disabled" : ""}
            onclick="changePage(${currentPage - 1})"
        >
            <span class="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>
    `;

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      html += `<button class="pagination-btn active px-4 py-2 rounded-lg font-bold">${i}</button>`;
    } else if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      html += `<button class="pagination-btn px-4 py-2 rounded-lg border border-border-light dark:border-[#2A3E38] hover:bg-gray-100 dark:hover:bg-[#253832]" onclick="changePage(${i})">${i}</button>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html += `<span class="px-2">...</span>`;
    }
  }

  // Next button
  html += `
        <button 
            class="pagination-btn px-4 py-2 rounded-lg border border-border-light dark:border-[#2A3E38] ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100 dark:hover:bg-[#253832]"
            }"
            ${currentPage === totalPages ? "disabled" : ""}
            onclick="changePage(${currentPage + 1})"
        >
            <span class="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
    `;

  html += "</div>";
  return html;
};

// Export for use in other files
window.createHotelCard = createHotelCard;
window.createHotelListCard = createHotelListCard;
window.toggleFavorite = toggleFavorite;
window.viewHotel = viewHotel;
window.editHotel = editHotel;
window.deleteHotel = deleteHotel;
window.showToast = showToast;
window.createPagination = createPagination;
window.DEFAULT_HOTEL_IMAGE = DEFAULT_HOTEL_IMAGE;
