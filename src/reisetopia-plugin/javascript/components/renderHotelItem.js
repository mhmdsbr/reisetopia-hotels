export const renderHotelItem = (hotel) => {
    return `
        <div class="ra-hotels-list__item">
            <h5>${hotel.title}</h5>
            <p><span>Location:</span> ${hotel.country}, ${hotel.city}</p>
            <p><span>Price Range:</span> ${hotel['priceRange'].min}, ${hotel['priceRange'].max}</p>
            ${hotel.rating ? `<p><span>Rating:</span> ${hotel.rating}/5</p>` : ''}
        </div>
    `;
};
