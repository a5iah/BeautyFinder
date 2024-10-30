const { app, BrowserWindow } = require('electron');
const fs = require('fs')
const path = require('path')

let wishlistPath = path.join(__dirname, 'wishlist')

// nak read/get data dari semua txt files dalam wishlist
function displayWishlist()
{
    // get all files from wishlist folder
    fs.readdir(wishlistPath, (err,files) => 
    {
        if(err)
        {
            console.log(err)
            return
        }
        // mula2 initialize-kan an array untuk simpan semua product
        let allProducts = []
        // setkan num of files processed to 0 -> untuk track num of files processed
        let filesProcessed = 0
        // iterate through each file
        files.forEach(file => 
        {
            let filePath = path.join(wishlistPath, file)
            // read content setiap file
            fs.readFile(filePath, 'utf-8', (err, data) => 
            {
                if (err)
                {
                    console.log(err)
                    return
                }
                // parse data, call parsing function
                let productData = parseProductData(data)
                // add product data to array allProduct
                allProducts.push(productData)
                // tambah satu kat fileProcessed
                filesProcessed ++
                // only display all products at once kalau semua file dah di process
                if (filesProcessed == files.length)
                {
                    // display data --ambik yg array tadi
                    displayProducts(allProducts)
                }
            })
        })
    })
}

// nak parse-kan data
function parseProductData(data)
{
    let lines = data.split('\n')
    let product = {}
    // buang relevant fields dari data
    lines.forEach(line => 
    {
        let [key, value] = line.split(': ')
        if (key && value)
        {
            product[key.trim()] = value.trim()
        }
    })
    return product
}

// function untuk display popup box
function displayPopUp(product)
{
    document.getElementById('popUpImg').src = product['Product Image'] || 'images/noImage.png'
    // kalau product takde image, display noImage.png
    popUpImg.onerror = function() {
        this.onerror = null;
        this.src = 'images/noImage.png';
    }

    document.getElementById('popUpName').innerHTML = product['Product Name']
    document.getElementById('popUpRating').innerHTML = `Rating: ${product['Rating'] || '0'} ⭐`
    document.getElementById('popUpPrice').innerHTML = `$ ${product['Price']}`
    document.getElementById('popUpProductType').innerHTML = `Product Type: ${product['Product Type']}`
    document.getElementById('popUpBrand').innerHTML = `Brand: ${product['Brand']}`

    const popUpProductLink = document.getElementById('popUpProductLink')
    popUpProductLink.onclick = () => window.open(product['Product Link'], "_blank")
    
    const popUpWebLink = document.getElementById('popUpWebLink')
    popUpWebLink.onclick = () => window.open(product['Website Link'], "_blank")

    document.getElementById('popUpDesc').innerHTML = `Description:<br>${product['Description'] || 'N/A'}`
    document.getElementById('popUpColor').innerHTML = `Available Colors: ${product['Available Colors'] || '1'}`
    document.getElementById('popUpTag').innerHTML = `Tag: ${product['Tag'] || 'N/A'}`
    document.getElementById('popUpNote').innerHTML = `Note: ${product['Note'] || 'No note yet'}`
    // nak tunjuk popup box (nak flex)
    document.getElementById('popUpBox').style.display = "flex"
}

// nak tutup popup box
function closePopUp()
{
    document.getElementById('popUpBox').style.display="none"
}

// nak display setiap product
function displayProducts(products)
{
    const wishlistContainer = document.getElementById("wishlistContainer")
    wishlistContainer.innerHTML = ""
    // loop through each product dan create a productBox
    products.forEach((product) => 
    {
        const productDiv = document.createElement("div")
        productDiv.className = "productBox"
        // simpan file path based on product name for saving later
        let fileName = `${product['Product Name'].replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
        let filePath = path.join(wishlistPath, fileName)
        // initialize-kan note dulu
        let note = product['Note'] || ""
        // lepastu keluarkan data
        productDiv.innerHTML = `
            <img src="${product['Product Image'] || 'images/noImage.png'}" onerror="this.onerror=null; this.src='images/noImage.png';">
            <div class="productText">
                <h3>${product['Product Name']}</h3>
                <p>Rating: ${product['Rating'] || "0"} ⭐</p>
                <b>Price: $ ${product['Price']}</b>
                <p>Brand: ${product['Brand']}</p>
                <p>Product Type: ${product['Product Type']}</p>
                <p>Available Colors: ${product['Available Colors'] || '1'}</p>
                <p><strong>Note:</strong> <span class="noteText">${note || 'No note yet'}</span></p>
                <textarea class="noteEdit" style="display:none;" rows="4">${note}</textarea>
                <div class="doButton">
                    <button class="seeMoreBtn">See More</button>
                    <button class="btnUpdate">Update Note</button>
                    <button class="btnDelete">Delete</button>
                </div>
            </div>
        `

        // tambah click event untuk display popup box of product
        productDiv.querySelector(".seeMoreBtn").addEventListener("click", () => displayPopUp(product))
        // tambah click event untuk update button
        // yg ni dia sekali untuk toggle note display/editing mode
        productDiv.querySelector(".btnUpdate").addEventListener("click", () => 
        {
            const noteText = productDiv.querySelector(".noteText")
            const noteEdit = productDiv.querySelector(".noteEdit")

            if(noteText.style.display=="none")
            {   // kalau note tengah di-edit,
                // get value dulu,
                note = noteEdit.value
                // update displayed note
                noteText.innerText = note
                // show the note
                noteText.style.display = "inline"
                // hide textarea
                noteEdit.style.display = "none"
                // save updated note back to file
                product['Note'] = note
                // call function save updated data
                saveProductData(filePath, product)
            }
            else
            {   // kalau note tengah di-display,
                // hide note
                noteText.style.display = "none"
                // show textarea
                noteEdit.style.display = "block"
                // focus on textarea
                noteEdit.focus()
            }
        })
        // tambah click event untuk delete button
        productDiv.querySelector(".btnDelete").addEventListener("click",() => 
        {
            if (confirm(`Are you sure you want to remove ${product['Product Name']} from your wishlist? 🥺`))
            {
                // call function untuk delete product data
                deleteProduct(filePath, productDiv)
            }
        })

        wishlistContainer.appendChild(productDiv)
    })
}

// nak save updated data
function saveProductData(filePath, product)
{
    let contents = `
        Product Name: ${product['Product Name']}
        Product Image: ${product['Product Image']}
        Rating: ${product['Rating'] || "0"}
        Price: ${product['Price']}
        Brand: ${product['Brand']}
        Product Type: ${product['Product Type']}
        Product Link: ${product['Product Link']}
        Website Link: ${product['Website Link']}
        Description: ${product['Description']}
        Available Colors: ${product['Available Colors']}
        Tags: ${product['Tags'] || 'N/A'}
        Note: ${product['Note'] || 'No note yet'}
    `

    // write updated contents back to file
    fs.writeFile(filePath, contents.trim(), function(err)
    {
        if (err)
        {
            return console.log("Can't save product to wishlist: ", err)
        }
        alert("Note successfully updated ✨")
        console.log("berjaya update product data")
    })
}

// nak delete note
function deleteProduct(filePath, productDiv)
{
    fs.unlink(filePath, (err) => 
    {
        if(err)
        {
            console.log("Error deletingt file:", err)
            alert("Could not delete product from wishlist, maybe this product like you 🥺")
        }
        else
        {
            alert("Product successfully deleted from wishlist, sayonara~ 👋")
            // untuk remove product box dari display
            productDiv.remove()
            console.log("berjaya delete product")
        }
    })
}

// bila page load, call function ni untuk terus display semua data
displayWishlist()