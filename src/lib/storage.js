export function saveVendor(vendorData) {
  const vendors = JSON.parse(localStorage.getItem("faster_vendors") || "[]");
  const newVendor = { id: Date.now(), ...vendorData, followers: 0 };
  vendors.push(newVendor);
  localStorage.setItem("faster_vendors", JSON.stringify(vendors));
  return newVendor;
}

export function saveProduct(productData) {
  const products = JSON.parse(localStorage.getItem("faster_products") || "[]");
  const newProduct = { id: Date.now(), ...productData };
  products.push(newProduct);
  localStorage.setItem("faster_products", JSON.stringify(products));
  return newProduct;
}
