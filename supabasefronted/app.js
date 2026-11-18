const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');

// Function to fetch all products from the server
async function fetchProducts() {
  const response = await fetch('http://localhost:3000/products');
  const products = await response.json();

  // Clear product list
  productList.innerHTML = '';

  // Add each product to the list
  products.forEach(product => {
    const tr = document.createElement('tr');
    // tr.innerHTML = `${product.name} - $${product.price} - ${product.description}`;
    const name = document.createElement('td')
    name.innerHTML = product.name
    name.classList.add('td-name')
    tr.appendChild(name)

    const price = document.createElement('td')
    price.innerHTML = `$${product.price}`
    tr.appendChild(price)

    const description = document.createElement('td')
    description.innerHTML = product.description ? product.description : ''
    tr.appendChild(description)

    const actions = document.createElement('td')
    actions.classList.add('td-actions')
    // Add delete button for each product
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.addEventListener('click', async () => {
      await deleteProduct(product.id);
      await fetchProducts();
    });
    actions.appendChild(deleteButton);

    // Add update button for each product
    const updateButton = document.createElement('button');
    updateButton.innerHTML = 'Update';
    updateButton.addEventListener('click', () => {
      addProductForm.elements['id'].value = product.id;
      addProductForm.elements['name'].value = product.name;
      addProductForm.elements['price'].value = product.price;
      addProductForm.elements['description'].value = product.description;
    });
    actions.appendChild(updateButton);

    tr.appendChild(actions)

    productList.appendChild(tr);
  });
}


// Event listener for Add Product form submit button
addProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const id = addProductForm.elements['id'].value
  const name = addProductForm.elements['name'].value;
  const price = addProductForm.elements['price'].value;
  const description = addProductForm.elements['description'].value;
  if (id) {
    await updateProduct(id, name, price, description);
  } else {
    await addProduct(name, price, description);
  }
  addProductForm.reset();
  await fetchProducts();
});

addProductForm.addEventListener('reset', function () {
  addProductForm.elements['id'].value = '';
})

// Function to add a new product
async function addProduct(name, price, description) {
  const response = await fetch('http://localhost:3000/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, price, description })
  });
  return response.json();
}

// Function to add a new product
async function updateProduct(id, name, price, description) {
  const response = await fetch('http://localhost:3000/products/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, price, description })
  });
  return response.json();
}

// Function to delete a new product
async function deleteProduct(id) {
  const response = await fetch('http://localhost:3000/products/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    //body: JSON.stringify({id})
  });
  return response.json();
}

// Fetch all products on page load
fetchProducts();
