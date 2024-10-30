// function untuk display popup box
function displayPopUp(product)
{
    document.getElementById('popUpImg').src = product.image_link || 'images/noImage.png'
    // kalau product takde image, display noImage.png
    popUpImg.onerror = function() {
        this.onerror = null;
        this.src = 'images/noImage.png';
    }

    document.getElementById('popUpName').innerHTML = product.name
    document.getElementById('popUpRating').innerHTML = `Rating: ${product.rating || '0'} ⭐`
    document.getElementById('popUpPrice').innerHTML = `$ ${product.price}`
    document.getElementById('popUpProductType').innerHTML = `Product Type: ${product.product_type}`
    document.getElementById('popUpBrand').innerHTML = `Brand: ${product.brand}`

    const popUpProductLink = document.getElementById('popUpProductLink')
    popUpProductLink.onclick = () => window.open(product.product_link, "_blank")
    
    const popUpWebLink = document.getElementById('popUpWebLink')
    popUpWebLink.onclick = () => window.open(product.website_link, "_blank")

    document.getElementById('popUpDesc').innerHTML = `Description:<br>${product.description || 'N/A'}`
    document.getElementById('popUpColor').innerHTML = `Available Colors: ${product.product_colors.length && product.product_colors.length > 0 ? product.product_colors.length : '1'}`
    document.getElementById('popUpTag').innerHTML = `Tag: ${product.tag_list && product.tag_list.length > 0 ? product.tag_list.join(', ') : 'N/A'}`
    // nak tunjuk popup box (nak flex)
    document.getElementById('popUpBox').style.display = "flex"
}

// nak tutup popup box
function closePopUp()
{
    document.getElementById('popUpBox').style.display="none"
}

// nak display product
function displayProducts(products)
{
    const productContainer = document.getElementById("productContainer");
    productContainer.innerHTML = ""; // Clear previous content

    // looping create productContainer and masukkan data untuk setiap data yg di-fetched
    products.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.className = "product"
        
        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <img src="${product.image_link}" onerror="this.onerror=null; this.src='images/noImage.png';">
            <p>Rating: ${product.rating || "0"} ⭐</p>
            <b>Price: $ ${product.price || 0}</b>
            <p>Brand: ${product.brand}</p>
            <p>Product Type: ${product.product_type}</p>
            <p>Available Colors: ${product.product_colors.length && product.product_colors.length > 0 ? product.product_colors.length : '1'}</p>
            <br>
            <button class="seeMoreBtn">See More</button>
            <button class="addtoWishlist">Add To Wishlist</button>
        `;

        // tambah click event untuk display popup box of product
        productDiv.querySelector(".seeMoreBtn").addEventListener("click", () => displayPopUp(product))
        // tambah click event untuk add product to wishlist
        productDiv.querySelector(".addtoWishlist").addEventListener("click", () => addtoWishlist(product))

        productContainer.appendChild(productDiv)
    });
}

// nak display products not found message
function displayNoProductsFoundMessage() {
    const productContainer = document.getElementById("productContainer");
    productContainer.innerHTML = "<p>Sorry, no product found :(</p>";
}

// tekan butang All
function AllProducts()
{
    displayTitle()
    // for fetching data
    fetch(`http://makeup-api.herokuapp.com/api/v1/products.json`)
    // berjaya fetch, convert from json to js
    .then((response) => response.json())
    // print data
    .then((data) => {
        // print data (tapi dalam console)
        console.log(data)
        // get element productContainer
        const productContainer = document.getElementById("productContainer");
        // Clear previous content
        productContainer.innerHTML = ""
        // call function untuk display
        displayProducts(data)
        console.log("berjaya fetch dan display data")
    })
    .catch((error) => console.error("Error fetching data:", error))
}

// nak display title
function displayTitle()
{
    // get dulu id productInput dgn searchTitle
    const input = document.getElementById("productInput").value
    const titleElement = document.getElementById("titleElement")
    // check input empy ke tak
    if (input != "")
    {
        titleElement.innerHTML = `${input} Products 💗`
    }
    else
    {
        titleElement.innerHTML = "All Products 💗"
    }
}

// tekan butang, nak fill search box
function fillSearchBox(productType) 
{
    document.getElementById('productInput').value = productType;
}

// bila click search(by product type) atau tekan productTypeBtn
function searchProduct()
{
    // ambik input dari user
    const productType = document.getElementById("productInput").value
    displayTitle()
    //untuk fetch
    fetch(`http://makeup-api.herokuapp.com/api/v1/products.json?product_type=${productType}`)
    // bila berjaya fetch, convert data from JSON to JavaScript
    .then((response) => response.json())
    // bila berjaya convert, print data
    .then((data) => {
        // print data (tapi dalam console)
        console.log(data)
        // kalau product type tak jumpa
        if (data.length == 0 )
        {
            searchByBrand(productType)
        }
        // kalau jumpa product type
        else
        {
            // call function untuk display
            displayProducts(data)
            console.log("berjaya fetch dan display searched product")
        }
    })
    .catch((error) => console.error("Error fetching data:", error))
}

// bila click search(by brand)
function searchByBrand(brand)
{
    //untuk fetch
    fetch(`http://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}`)
    // bila berjaya fetch, convert data from JSON to JavaScript
    .then((response) => response.json())
    // bila berjaya convert, print data
    .then((data) => {
        // print data (tapi dalam console)
        console.log(data)
        // kalau product type tak jumpa
        if (data.length == 0 )
        {
            displayNoProductsFoundMessage()
        }
        // kalau jumpa product type
        else
        {
            // call function untuk display
            displayProducts(data)
            console.log("berjaya fetch dan display searched product")
        }
    })
    .catch((error) => console.error("Error fetching data:", error))
}

// apply price filter
function applyPriceFilter()
{
    // get the min and max price from user input
    const minPrice = parseFloat(document.getElementById("minPrice").value) || 0
    const maxPrice = parseFloat(document.getElementById("maxPrice").value) || 0
    // get user input untuk product type atau brand
    const productInput = document.getElementById("productInput").value

    // then, initialize API URL
    let apiURL = 'https://makeup-api.herokuapp.com/api/v1/products.json'

    // determine nak fetch API URL yg mana
    if (productInput)
    {
        // fetch by product_type dulu
        fetch(`${apiURL}?product_type=${productInput}`)
        .then(response => response.json())
        .then(data => 
        {
            if (data.length > 0)
            { // kalau product found, filter by price
                const filteredProducts = data.filter(product =>
                {
                    const price = parseFloat(product.price)
                    return !isNaN(price) && price >= minPrice && price <= maxPrice
                })
                if (filteredProducts.length > 0)
                { // kalau product within price range found
                    displayProducts(filteredProducts)
                    console.log('berjaya fetch dan display filtered products')
                }
                else
                {
                    displayNoProductsFoundMessage()
                }
            }
            else
            {   // kalau takde product found by product_type, fetch by band pulak
                fetch(`${apiURL}?brand=${productInput}`)
                .then(response => response.json())
                .then(data =>
                {
                    if (data.length > 0)
                    {   // kalau product found, filter by price
                        const filteredProducts = data.filter(product => 
                        {
                            const price = parseFloat(product.price)
                            return !isNaN(price) && price >= minPrice && price <= maxPrice
                        })
                        if (filteredProducts.length > 0)
                        { // kalau product within price range found
                            displayProducts(filteredProducts)
                            console.log('berjaya fetch dan display filtered products')
                        }
                        else
                        {
                            displayNoProductsFoundMessage()
                        }
                    }
                    
                })
            }
        })
    }
    else
    {   // kalau productInput empty
        fetch(apiURL)
        .then(response => response.json())
        .then(data =>
        {   //filter product by price range
            const filteredProducts = data.filter(product =>
            {
                const price = parseFloat(product.price)
                return !isNaN(price) && price >= minPrice && price <= maxPrice
            })
            if (filteredProducts.length > 0)
            { // kalau product within price range found
                displayProducts(filteredProducts)
                console.log('berjaya fetch dan display filtered products')
            }
            else
            {
                displayNoProductsFoundMessage()
            }
        })
        .catch(error => console.error("Error fetching all products:", error))
    }
}

// nak add product to wishlist (CREATE)
function addtoWishlist(product)
{
    // setkan file path & file name ke product name
    // nama file ni, kalau ada character yg bukan alphabet, atau number, akan digantikan dengan '_'
    let fileName = `${product.name.replace(/[^a-z0-9]/gi,'_').toLowerCase()}.txt`
    let filePath = path.join(wishlistPath, fileName)

    // apa content nak tulis dalam file
    let contents = `
        Product Name: ${product.name}
        Product Image: ${product.image_link}
        Rating: ${product.rating || "0"}
        Price: ${product.price || 0}
        Brand: ${product.brand}
        Product Type: ${product.product_type}
        Product Link: ${product.product_link}
        Website Link: ${product.website_link}
        Description: ${product.description}
        Available Colors: ${product.product_colors.length && product.product_colors.length > 0 ? product.product_colors.length : '1'}
        Tags: ${product.tag_list.join(', ') || 'N/A'}
        Note: 
    `

    // untuk write file txt ke dalam wishlist folder
    fs.writeFile(filePath, contents, function(err)
    {
        if (err)
        {
            return console.log("Can't save product to wishlist: ", err)
        }
        alert(`${product.name} successfully added to your wislist 💖`)
        console.log("Product berjaya add ke wishlist")
    })
}

// main program
// bila page load, akan buat ni
// yg ni semua relate to untuk add to wishlist function
const { error } = require('console')
const { app, BrowserWindow } = require('electron')
const fs = require('fs')
const path = require('path')
let wishlistPath = path.join(__dirname, 'wishlist')
// call function untuk display semua products
AllProducts()