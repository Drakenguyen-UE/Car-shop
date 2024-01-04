const BASE_URL = "http://localhost:8080";

const formLicensePlate = document.getElementById("license-plate");
const formRepairDate = document.getElementById("repair-date");
const formCustomerName = document.getElementById("customer-name");
const formCatalog = document.getElementById("catalog");
const formCarMaker = document.getElementById("car-maker");
const form = document.getElementById("car-update-form");
const tbody = document.getElementById("cars");
const loading = document.getElementById("loading");

form.addEventListener("submit", async function(e) { // e viết tắt của event
    e.preventDefault();
    await update();
    findAll();
    this.reset();
});

findAll();

async function findAll() {
    showLoading();
    const response = await fetch(`${BASE_URL}/api/v1/cars`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });
    const body = await response.json();
    console.log(body);

    showAllCars(body.content);
    hideLoading();
}

async function showAllCars(cars) {
    tbody.innerHTML = "";
    for (const car of cars) {
        const row = tbody.insertRow(); // tbody là table body

        const licensePlate = document.createTextNode(car.licensePlate);
        row.insertCell().appendChild(licensePlate); // Cách 1 với appendChild

        const repairDate = car.repairDate;
        row.insertCell().innerText = repairDate; // Cách 2 với innerText

        const customerName = car.customerName;
        row.insertCell().innerText = customerName;
        
        const catalog = car.catalogs;
        row.insertCell().innerText = catalog;

        const carMaker = car.carMaker;
        row.insertCell().innerText = carMaker;

        const btnEdit = document.createElement("button");
        btnEdit.innerText = "🖊️";
        btnEdit.addEventListener("click", function () {
            formLicensePlate.value = car.licensePlate;
            formRepairDate.value = car.repairDate;
            formCustomerName.value = car.customerName;
            formCatalog.value = car.catalogs;
            formCarMaker.value = car.carMaker;
        });
        const btnDelete = document.createElement("button");
        btnDelete.innerText = "❌";
        btnDelete.addEventListener("click", async function () {
            const confirmed = confirm("Do you want to delete this car?")
            if (confirmed) {
                showLoading();
                await deleteById(car.licensePlate, car.repairDate);
                tbody.removeChild(row);
                hideLoading();
            } 
        });
        row.insertCell().append(btnEdit, btnDelete); // truyền 2 cái 1 lúc thì dùng append
    }
}

async function update() {
    const response = await fetch(`${BASE_URL}/api/v1/cars`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            licensePlate: formLicensePlate.value,
            repairDate: formRepairDate.value,
            customerName: formCustomerName.value,
            catalogs: formCatalog.value,
            carMaker: formCarMaker.value
        })
    });
    const body = await response.json();
    console.log(body);
}

async function deleteById(licensePlate, repairDate) {
    const response = await fetch(`${BASE_URL}/api/v1/cars`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            licensePlate: licensePlate,
            repairDate: repairDate
        })
    });
}

function showLoading() {
    loading.style.display = "flex";
}

function hideLoading() {
    setTimeout(function () {
        loading.style.display = "none";
    }, Math.random*2);
}