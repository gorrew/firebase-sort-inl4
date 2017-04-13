let prodName = document.getElementById('prod-name');
let prodPrice = document.getElementById('prod-price');
let prodBtn = document.getElementById('add-prod');
let prodUl = document.getElementById('prod-ul');
let db = firebase.database();
let prodId = 0;
let sortName = document.getElementById('sort-name');
let sortPrice = document.getElementById('sort-price');
let sortId = document.getElementById('sort-id');
let btnAz = document.getElementById('sort-name');
let btnPrice = document.getElementById('sort-price');
let showAmount = document.getElementById('show-amount');

let addProd = () => {

    let prodAddTime = new Date().toLocaleTimeString();
    if (prodName.value.length <= 0 || prodPrice.value.length <= 0) {
        alert('Fel input')
    }
    else {
        let product = {
            productName: prodName.value,
            productPrice: Number(prodPrice.value),
            time: prodAddTime,
            id: prodId
        }
        db.ref('product/').push(product);
        prodName.value = '';
        prodPrice.value = '';
    }

}

db.ref('product/').on('value', function (snapshot) {
    let allProd = [];
    let dataobj = snapshot.val();
    prodUl.innerHTML = '';


    for (let obj in dataobj) {
        let allProd = dataobj[obj];
        let prodLi = document.createElement('li');
        let prodLiSpanName = document.createElement('span');
        let prodLiSpanPrice = document.createElement('span');

        if (dataobj[obj].id !== undefined) {
            prodId = dataobj[obj].id + 1;
        }


        prodLiSpanName.class = 'product-name';
        prodLiSpanPrice.class = 'product-price';
        prodLiSpanName.innerHTML = `${allProd.productName} - `;
        prodLiSpanPrice.innerHTML = `${allProd.productPrice}kr`;
        prodUl.appendChild(prodLi);
        prodLi.appendChild(prodLiSpanName);
        prodLi.appendChild(prodLiSpanPrice);
    }
})

function showProd(prods) {
    let prodLi = document.createElement('li');
    let prodLiSpanName = document.createElement('span');
    let prodLiSpanPrice = document.createElement('span');
    console.log(prods);
    if (prods.id !== undefined) {
        prodId = prods.id + 1;
    }


    prodLiSpanName.class = 'product-name';
    prodLiSpanPrice.class = 'product-price';
    prodLiSpanName.innerHTML = `${prods.productName} - `;
    prodLiSpanPrice.innerHTML = `${prods.productPrice}kr`;
    prodUl.appendChild(prodLi);
    prodLi.appendChild(prodLiSpanName);
    prodLi.appendChild(prodLiSpanPrice);
}

function sort(btn, type) {
    btn.addEventListener('click', function (event) {
        prodUl.innerHTML = '';
        db.ref('product/').orderByChild(type).once('value', function (snapshot) {
            snapshot.forEach(prodRef => {
                showProd(prodRef.val());
            })
        })
    })
}


showAmount.addEventListener('keypress', function (event) {
    if (event.keyCode == 13) {
        let antal = Number(showAmount.value);
        prodUl.innerHTML = '';
        console.log('inputAntalResultat: antal=' + antal);
        if (isNaN(antal)) {
            // varna användaren
        } else {
            db.ref('product/').limitToFirst(antal)
                .once('value', function (snapshot) {
                    snapshot.forEach(prodRef => {
                        showProd(prodRef.val());
                    })
                });
        }
    }
});


sort(btnAz, 'productName');
sort(btnPrice, 'productPrice');

prodBtn.addEventListener('click', addProd);