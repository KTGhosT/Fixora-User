import React, { useState } from "react";
import "./Accessories.css"; 

function Accessories({ addToCart }) {
  const allAccessories = [

    // Carpenter//
    { id: 1, name: "Cordless drill", price: 1200, img: "src/assets/images/Carpenter/t1.png", category: "Carpenter" },
    { id: 2, name: "Carpenter's Square", price: 800, img: "src/assets/images/Carpenter/t2.png", category: "Carpenter" },
    { id: 3, name: "Measuring", price: 1200, img: "src/assets/images/Carpenter/t3.png", category: "Carpenter" },
    { id: 4, name: "large canvas/nylon", price: 800, img: "src/assets/images/Carpenter/t4.png", category: "Carpenter" },
    { id: 5, name: "Hammer", price: 1200, img: "src/assets/images/Carpenter/t5.png", category: "Carpenter" },
    { id: 6, name: "Glove", price: 800, img: "src/assets/images/Carpenter/t6.png", category: "Carpenter" },
    { id: 7, name: "Combo", price: 1200, img: "src/assets/images/Carpenter/t7.png", category: "Carpenter" },
    { id: 8, name: "canvas tool belt with multiple pockets", price: 800, img: "src/assets/images/Carpenter/t8.png", category: "Carpenter" },
    { id: 9, name: "Chisels (Wood Chisel Set)", price: 1200, img: "src/assets/images/Carpenter/t9.png", category: "Carpenter" },
    { id: 10, name: "Measuring Tape Belt Holder", price: 800, img: "src/assets/images/Carpenter/t10.png", category: "Carpenter" },
    { id: 11, name: " Pencil or Marking Knife", price: 1200, img: "src/assets/images/Carpenter/t11.png", category: "Carpenter" },
    { id: 12, name: "Table Saw", price: 800, img: "src/assets/images/Carpenter/t12.png", category: "Carpenter" },
    { id: 13, name: "Workbench", price: 1200, img: "src/assets/images/Carpenter/t13.png", category: "Carpenter" },
    { id: 14, name: "Nail Gun", price: 800, img: "src/assets/images/Carpenter/t14.png", category: "Carpenter" },
    { id: 15, name: " Router", price: 1200, img: "src/assets/images/Carpenter/t15.png", category: "Carpenter" },
    { id: 16, name: "Spirit Level (Bubble Level)", price: 800, img: "src/assets/images/Carpenter/t16.png", category: "Carpenter" },
    { id: 17, name: "Belt Sander", price: 1200, img: "src/assets/images/Carpenter/t17.png", category: "Carpenter" },
    { id: 18, name: "Miter Saw", price: 800, img: "src/assets/images/Carpenter/t18.png", category: "Carpenter" },
    { id: 19, name: "Vise", price: 1200, img: "src/assets/images/Carpenter/t19.png", category: "Carpenter" },
    { id: 20, name: " Bevel Gauge", price: 800, img: "src/assets/images/Carpenter/t20.png", category: "Carpenter" },
    { id: 21, name: "Planer Machine", price: 1200, img: "src/assets/images/Carpenter/t21.png", category: "Carpenter" },
    { id: 22, name: "Clamps (C-Clamps, G-Clamps, Bar Clamps)", price: 800, img: "src/assets/images/Carpenter/t22.png", category: "Carpenter" },
    { id: 23, name: "Dust Mask & Safety Glasses,", price: 800, img: "src/assets/images/Carpenter/t23.png", category: "Carpenter" },
    { id: 24, name: "Angle Grinder", price: 800, img: "src/assets/images/Carpenter/t24.png", category: "Carpenter" },
    { id: 25, name: " Hand Saw", price: 800, img: "src/assets/images/Carpenter/t25.png", category: "Carpenter" },
    { id: 26, name: "Jigsaw", price: 800, img: "src/assets/images/Carpenter/t26.png", category: "Carpenter" },
    { id: 27, name: "Combination Square", price: 800, img: "src/assets/images/Carpenter/t27.png", category: "Carpenter" },
    { id: 28, name: "Circular Saw", price: 800, img: "src/assets/images/Carpenter/t28.png", category: "Carpenter" },
    { id: 29, name: " Chalk Line", price: 800, img: "src/assets/images/Carpenter/t29.png", category: "Carpenter" },

    //House Keeping//
    { id: 30, name: "Name blade", price: 500, img: "src/assets/images/HouseKeeping/ht1.png", category: "Housekeeping" },
    { id: 31, name: "Floor Squeegee", price: 700, img: "src/assets/images/HouseKeeping/ht2.png", category: "Housekeeping" },
    { id: 32, name: "Cleaning Cloths (Microfiber, Cotton)", price: 500, img: "src/assets/images/HouseKeeping/ht3.png", category: "Housekeeping" },
    { id: 33, name: "Toilet Cleaner", price: 700, img: "src/assets/images/HouseKeeping/ht4.png", category: "Housekeeping" },
    { id: 34, name: "Floor Cleaner", price: 500, img: "src/assets/images/HouseKeeping/ht5.png", category: "Housekeeping" },
    { id: 35, name: "Carpet Brush", price: 700, img: "src/assets/images/HouseKeeping/ht6.png", category: "Housekeeping" },
    { id: 36, name: "Multi-Surface Spray", price: 500, img: "src/assets/images/HouseKeeping/ht7.png", category: "Housekeeping" },
    { id: 37, name: "Air Freshener", price: 700, img: "src/assets/images/HouseKeeping/ht8.png", category: "Housekeeping" },
    { id: 38, name: "Vacuum Cleaner", price: 500, img: "src/assets/images/HouseKeeping/ht9.png", category: "Housekeeping" },
    { id: 39, name: "Scrubbing Brush", price: 700, img: "src/assets/images/HouseKeeping/ht10.png", category: "Housekeeping" },
    { id: 40, name: "Furniture Polish", price: 500, img: "src/assets/images/HouseKeeping/ht11.png", category: "Housekeeping" },
    { id: 41, name: "Duster (Feather / Microfiber)", price: 700, img: "src/assets/images/HouseKeeping/ht12.png", category: "Housekeeping" },
    { id: 42, name: "Gloves (Rubber or Disposable)", price: 500, img: "src/assets/images/HouseKeeping/ht13.png", category: "Housekeeping" },
    { id: 43, name: "Bucket", price: 700, img: "src/assets/images/HouseKeeping/ht14.png", category: "Housekeeping" },
    { id: 44, name: "Glass Cleaner", price: 700, img: "src/assets/images/HouseKeeping/ht15.png", category: "Housekeeping" },
    { id: 45, name: "Broom", price: 700, img: "src/assets/images/HouseKeeping/ht16.png", category: "Housekeeping" },


    //Gardener//
    { id: 46, name: "Compost Bin", price: 400, img: "src/assets/images/Gardener/gt1.png", category: "Gardener" },
    { id: 47, name: "Shovel / Spade", price: 900, img: "src/assets/images/Gardener/gt2.png", category: "Gardener" },
    { id: 48, name: "Hoe", price: 400, img: "src/assets/images/Gardener/gt3.png", category: "Gardener" },
    { id: 49, name: "Hand Trowel", price: 900, img: "src/assets/images/Gardener/gt4.png", category: "Gardener" },
    { id: 50, name: "Combo", price: 400, img: "src/assets/images/Gardener/gt5.png", category: "Gardener" },
    { id: 51, name: "Combo", price: 900, img: "src/assets/images/Gardener/gt6.png", category: "Gardener" },
    { id: 52, name: "GWheelbarrow", price: 400, img: "src/assets/images/Gardener/gt7.png", category: "Gardener" },
    { id: 53, name: "Soil Scoop", price: 900, img: "src/assets/images/Gardener/gt8.png", category: "Gardener" },
    { id: 54, name: "Rake", price: 400, img: "src/assets/images/Gardener/gt9.png", category: "Gardener" },
    { id: 55, name: "Garden Scissors", price: 900, img: "src/assets/images/Gardener/gt10.png", category: "Gardener" },
    { id: 56, name: "Spray Bottle", price: 400, img: "src/assets/images/Gardener/gt11.png", category: "Gardener" },
    { id: 57, name: "Tool bag", price: 900, img: "src/assets/images/Gardener/gt12.png", category: "Gardener" },
    { id: 58, name: "Seed Trays", price: 900, img: "src/assets/images/Gardener/gt13.png", category: "Gardener" },
    { id: 59, name: "Weeder", price: 900, img: "src/assets/images/Gardener/gt14.png", category: "Gardener" },
    { id: 60, name: "Transplanter", price: 900, img: "src/assets/images/Gardener/gt15.png", category: "Gardener" },
    { id: 61, name: "Toolmaster Apron:", price: 900, img: "src/assets/images/Gardener/gt16.png", category: "Gardener" },


    //Electrician//
    { id: 62, name: "Screwdrivers", price: 600, img: "src/assets/images/Electe/et1.png", category: "Electrician" },
    { id: 63, name: "Soldering Iron / Soldering Station", price: 1500, img: "src/assets/images/Electe/et2.png", category: "Electrician" },
    { id: 64, name: "Tool Belt / Utility Pouch ", price: 600, img: "src/assets/images/Electe/et3.png", category: "Electrician" },
    { id: 65, name: "Multimeter (Digital)", price: 1500, img: "src/assets/images/Electe/et4.png", category: "Electrician" },
    { id: 67, name: "Extension Cord / Power Reel", price: 600, img: "src/assets/images/Electe/et5.png", category: "Electrician" },
    { id: 68, name: "Utility Knife / Cutter ", price: 1500, img: "src/assets/images/Electe/et6.png", category: "Electrician" },
    { id: 69, name: "Pliers (Combination / Needle Nose / Cutting)", price: 600, img: "src/assets/images/Electe/et7.png", category: "Electrician" },
    { id: 70, name: "Wire Stripper.", price: 1500, img: "src/assets/images/Electe/et8.png", category: "Electrician" },
    { id: 71, name: "Heat Gun", price: 600, img: "src/assets/images/Electe/et9.png", category: "Electrician" },
    { id: 72, name: "Electrical Tape", price: 1500, img: "src/assets/images/Electe/et10.png", category: "Electrician" },
    { id: 73, name: "Electric Drill ", price: 600, img: "src/assets/images/Electe/et11.png", category: "Electrician" },
    { id: 74, name: "Cable Cutter", price: 1500, img: "src/assets/images/Electe/et12.png", category: "Electrician" },
    { id: 75, name: "Crimping Tool", price: 1500, img: "src/assets/images/Electe/et13.png", category: "Electrician" },

    //DEvice Reapir//
    { id: 76, name: "Screwdriver Set", price: 1200, img: "src/assets/images/Device Repair/dt2.png", category: "Device Repair" },
    { id: 77, name: " Clamp Meter", price: 800, img: "src/assets/images/Device Repair/dt3.png", category: "Device Repair" },
    { id: 78, name: "Multimeter (Digital / Analog)", price: 1200, img: "src/assets/images/Device Repair/dt4.png", category: "Device Repair" },
    { id: 79, name: "Pliers (Cutting, Needle Nose, Combination) ", price: 800, img: "src/assets/images/Device Repair/dt5.png", category: "Device Repair" },
    { id: 80, name: "Circuit Board Analyzer / Checker", price: 1200, img: "src/assets/images/Device Repair/dt6.png", category: "Device Repair" },
    { id: 81, name: "Screw pin", price: 800, img: "src/assets/images/Device Repair/dt7.png", category: "Device Repair" },
    { id: 82, name: "Screwdriver Set", price: 1200, img: "src/assets/images/Device Repair/dt8.png", category: "Device Repair" },
    { id: 83, name: "Continuity Tester", price: 800, img: "src/assets/images/Device Repair/dt9.png", category: "Device Repair" },
    { id: 84, name: "Anti-Static Wrist Strap (ESD Band)", price: 1200, img: "src/assets/images/Device Repair/dt10.png", category: "Device Repair" },
    //Plumber//
    { id: 85, name: "Basin Wrench – For hard-to-reach nuts", price: 900, img: "src/assets/images/plumber/pt1.png", category: "Plumber" },
    { id: 86, name: "Pipe Threader Machine", price: 900, img: "src/assets/images/plumber/pt2.png", category: "Plumber" },
    { id: 87, name: "Drain Cleaning Machine", price: 300, img: "src/assets/images/plumber/pt3.png", category: "Plumber" },
    { id: 88, name: "Water Pump / Pressure Pump ", price: 900, img: "src/assets/images/plumber/pt4.png", category: "Plumber" },
    { id: 89, name: "Slip Joint Pliers", price: 300, img: "src/assets/images/plumber/pt6.png", category: "Plumber" },
    { id: 90, name: "Pipe Wrench (Large & Small)", price: 900, img: "src/assets/images/plumber/pt7.png", category: "Plumber" },
    { id: 91, name: "Adjustable Wrench / Spanner", price: 300, img: "src/assets/images/plumber/pt8.png", category: "Plumber" },
  ];

  const categories = [...new Set(allAccessories.map(acc => acc.category))];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const filteredAccessories = allAccessories.filter(acc => acc.category === selectedCategory);

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Workers Accessories</h2>

      {/* Category Buttons */}
      <div className="mb-4 text-center">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn me-2 mb-2 ${selectedCategory === cat ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accessories Grid */}
      <div className="row">
        {filteredAccessories.map((item) => (
          <div key={item.id} className="col-md-3 mb-4">
            <div className="card h-100">
              <img src={item.img} className="card-img-top" alt={item.name} />
              <div className="card-body text-center">
                <h5>{item.name}</h5>
                <p>Rs. {item.price}</p>
                <button className="btn btn-success" onClick={() => addToCart(item)}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Accessories;
