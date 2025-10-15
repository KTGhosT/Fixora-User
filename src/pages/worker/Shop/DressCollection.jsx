import React, { useState, useEffect } from "react";

function DressCollection({ addToCart }) {
  const allDresses = [
    // === Carpenter ===
    { id: 1, name: "Leather hiking/work style boots", price: 2500, img: "src/assets/images/Carpenter/c01.png", category: "Carpenter" },
    { id: 2, name: "Denim blue overalls/bib", price: 2500, img: "src/assets/images/Carpenter/c02.png", category: "Carpenter" },
    { id: 3, name: "Grey long-sleeve shirt", price: 2500, img: "src/assets/images/Carpenter/c03.png", category: "Carpenter" },
    { id: 4, name: "Leather/suede work gloves", price: 2500, img: "src/assets/images/Carpenter/c04.png", category: "Carpenter" },
    { id: 5, name: "Yellow safety hard hat", price: 2500, img: "src/assets/images/Carpenter/c05.png", category: "Carpenter" },
    { id: 6, name: "Leather/suede work gloves", price: 2500, img: "src/assets/images/Carpenter/c06.png", category: "Carpenter" },
    { id: 7, name: "Leather/suede work gloves", price: 2500, img: "src/assets/images/Carpenter/c07.png", category: "Carpenter" },

    // === Housekeeping ===
    { id: 8, name: "Matching Trousers or Pants for a male", price: 2200, img: "src/assets/images/HouseKeeping/h1.png", category: "Housekeeping" },
    { id: 9, name: " Housekeeping Dress / Uniform Frock (with apron) for a female", price: 2300, img: "src/assets/images/HouseKeeping/h2.png", category: "Housekeeping" },
    { id: 10, name: "Cap / Hat / Mask for a mal", price: 2000, img: "src/assets/images/HouseKeeping/h3.png", category: "Housekeeping" },
    { id: 11, name: "Housekeeping Shirt (short sleeve) for a male", price: 2400, img: "src/assets/images/HouseKeeping/h4.png", category: "Housekeeping" },
    { id: 12, name: "Apron (waist-length or bib-style)", price: 2200, img: "src/assets/images/HouseKeeping/h5.png", category: "Housekeeping" },
    { id: 13, name: "Front Apron for a female", price: 2300, img: "src/assets/images/HouseKeeping/h6.png", category: "Housekeeping" },
    { id: 14, name: "Housekeeping Shirt (short sleeve)", price: 2000, img: "src/assets/images/HouseKeeping/h7.png", category: "Housekeeping" },
    { id: 15, name: "Head Cap / Hair Net for a female", price: 2400, img: "src/assets/images/HouseKeeping/h8.png", category: "Housekeeping" },
    { id: 16, name: "Cleaning Jacket (for supervisors)", price: 2200, img: "src/assets/images/HouseKeeping/h9.png", category: "Housekeeping" },
    { id: 17, name: "Comfortable Non-slip Shoes for a male", price: 2300, img: "src/assets/images/HouseKeeping/h10.png", category: "Housekeeping" },
    { id: 18, name: "Housekeeping Shirt (short sleeve) for a mal", price: 2000, img: "src/assets/images/HouseKeeping/h11.png", category: "Housekeeping" },
    { id: 19, name: "Comfortable Flat Shoes (non-slip) for a female", price: 2400, img: "src/assets/images/HouseKeeping/h12.png", category: "Housekeeping" },


    // === Gardener ===
    { id: 20, name: "Gardener Uniform (Green)", price: 2100, img: "src/assets/images/Gardener/g1.png", category: "Gardener" },
    { id: 21, name: "Protective Hat & Gloves Set", price: 1500, img: "src/assets/images/Gardener/g2.png", category: "Gardener" },
    { id: 22, name: "Gardener Uniform (Green)", price: 2100, img: "src/assets/images/Gardener/g3.png", category: "Gardener" },
    { id: 23, name: "Protective Hat & Gloves Set", price: 1500, img: "src/assets/images/Gardener/g4.png", category: "Gardener" },
    { id: 24, name: "Gardener Uniform (Green)", price: 2100, img: "src/assets/images/Gardener/g5.png", category: "Gardener" },
    { id: 25, name: "Protective Hat & Gloves Set", price: 1500, img: "src/assets/images/Gardener/g6.png", category: "Gardener" },
    { id: 26, name: "Gardener Uniform (Green)", price: 2100, img: "src/assets/images/Gardener/g7.png", category: "Gardener" },
    { id: 27, name: "Protective Hat & Gloves Set", price: 1500, img: "src/assets/images/Gardener/g8.png", category: "Gardener" },
    { id: 28, name: "Gardener Uniform (Green)", price: 2100, img: "src/assets/images/Gardener/g9.png", category: "Gardener" },
    { id: 29, name: "Protective Hat & Gloves Set", price: 1500, img: "src/assets/images/Gardener/g10.png", category: "Gardener" },
    { id: 30, name: "Gardener Uniform (Green)", price: 2100, img: "src/assets/images/Gardener/g11.png", category: "Gardener" },
    { id: 31, name: "Protective Hat & Gloves Set", price: 1500, img: "src/assets/images/Gardener/g12.png", category: "Gardener" },


    // === Electrician ===
    { id: 32, name: "Electrician Full Uniform", price: 2700, img: "src/assets/images/Electe/e1.png", category: "Electrician" },
    { id: 33, name: "Safety Overalls", price: 2600, img: "src/assets/images/Electe/e2.png", category: "Electrician" },
    { id: 34, name: "Electe Full Uniform", price: 2700, img: "src/assets/images/Electe/e3.png", category: "Electrician" },
    { id: 35, name: "Safety Overalls", price: 2600, img: "src/assets/images/Electe/e4.png", category: "Electrician" },
    { id: 36, name: "Electe Full Uniform", price: 2700, img: "src/assets/images/Electe/e5.png", category: "Electrician" },
    { id: 37, name: "Safety Overalls", price: 2600, img: "src/assets/images/Electe/e6.png", category: "Electrician" },
    { id: 38, name: "Electe Full Uniform", price: 2700, img: "src/assets/images/Electe/e7.png", category: "Electrician" },
    { id: 39, name: "Safety Overalls", price: 2600, img: "src/assets/images/Electe/e8.png", category: "Electrician" },
    { id: 40, name: "Electe Full Uniform", price: 2700, img: "src/assets/images/Electe/e9.png", category: "Electrician" },
    { id: 41, name: "Safety Overalls", price: 2600, img: "src/assets/images/Electe/e10.png", category: "Electrician" },
    { id: 42, name: "Electe Full Uniform", price: 2700, img: "src/assets/images/Electe/e11.png", category: "Electrician" },
    { id: 43, name: "Safety Overalls", price: 2600, img: "src/assets/images/Electe/e12.png", category: "Electrician" },


    // === Plumber ===
    { id: 44, name: "Plumber Workwear Set", price: 2400, img: "src/assets/images/Plumber/p1.png", category: "Plumber" },
    { id: 45, name: "Tool Belt & Gloves Combo", price: 1900, img: "src/assets/images/Plumber/p2.png", category: "Plumber" },
    { id: 46, name: "Plumber Workwear Set", price: 2400, img: "src/assets/images/Plumber/p3.png", category: "Plumber" },
    { id: 48, name: "Tool Belt & Gloves Combo", price: 1900, img: "src/assets/images/Plumber/p4.png", category: "Plumber" },
    { id: 49, name: "Plumber Workwear Set", price: 2400, img: "src/assets/images/Plumber/p5.png", category: "Plumber" },
    { id: 50, name: "Tool Belt & Gloves Combo", price: 1900, img: "src/assets/images/Plumber/p6.png", category: "Plumber" },
    { id: 51, name: "Plumber Workwear Set", price: 2400, img: "src/assets/images/Plumber/p7.png", category: "Plumber" },


    // === Device Repair ===
    { id: 52, name: "Device Repair Uniform", price: 2500, img: "src/assets/images/Device Repair/d1.png", category: "Device Repair" },
    { id: 53, name: "Technician Outfit", price: 2600, img: "src/assets/images/Device Repair/d2.png", category: "Device Repair" },
    { id: 54, name: "Device Repair Uniform", price: 2500, img: "src/assets/images/Device Repair/d3.png", category: "Device Repair" },
    { id: 55, name: "Technician Outfit", price: 2600, img: "src/assets/images/Device Repair/d4.png", category: "Device Repair" },
    { id: 56, name: "Device Repair Uniform", price: 2500, img: "src/assets/images/Device Repair/d5.png", category: "Device Repair" },
    { id: 57, name: "Technician Outfit", price: 2600, img: "src/assets/images/Device Repair/d6.png", category: "Device Repair" },
    { id: 58, name: "Device Repair Uniform", price: 2500, img: "src/assets/images/Device Repair/d7.png", category: "Device Repair" },

  ];

  // Get unique categories dynamically
  const categories = [...new Set(allDresses.map((dress) => dress.category))];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  // ✅ Remember selected category when navigating or refreshing
  useEffect(() => {
    const saved = localStorage.getItem("selectedCategory");
    if (saved) setSelectedCategory(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedCategory", selectedCategory);
  }, [selectedCategory]);

  // Filter items
  const filteredDresses = allDresses.filter((dress) => dress.category === selectedCategory);

  return (
    <div className="container my-5 dress-page">
      <h2 className="text-center mb-4">Workers Dress Collection</h2>

      {/* Category Buttons */}
      <div className="category-buttons text-center mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn me-2 mb-2 ${selectedCategory === cat ? "btn-primary active-cat" : "btn-outline-primary"}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Dress Grid */}
      <div className="row">
        {filteredDresses.map((item) => (
          <div key={item.id} className="col-md-3 col-sm-6 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <img src={item.img} className="card-img-top" alt={item.name} />
              <div className="card-body text-center">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">Rs. {item.price.toLocaleString()}</p>
                <button className="btn btn-success" onClick={() => addToCart(item)}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inline CSS */}
      <style>{`
        .dress-page h2 {
          font-weight: 700;
          color: #222;
        }
        .category-buttons .btn {
          border-radius: 25px;
          padding: 8px 22px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .category-buttons .btn:hover {
          transform: translateY(-2px);
        }
        .active-cat {
          background-color: #0d6efd;
          color: #fff !important;
        }
        .card {
          border-radius: 12px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
        .card-img-top {
          height: 220px;
          object-fit: cover;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }
        .card-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: #333;
          min-height: 50px;
        }
        .card-text {
          color: #555;
          margin-bottom: 12px;
        }
        .btn-success {
          border-radius: 10px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .btn-success:hover {
          background-color: #2ea043;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

export default DressCollection;
