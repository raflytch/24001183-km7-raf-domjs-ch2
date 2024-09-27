class App {
  constructor() {
    this.clearButton = document.getElementById("clear-btn");
    this.loadButton = document.getElementById("load-btn");
    this.carContainerElement = document.getElementById("cars-container");
    this.driverType = document.getElementById("tipeDriver");
    this.date = document.getElementById("tanggal");
    this.pickupTime = document.getElementById("waktuJemput");
    this.passengerCount = document.getElementById("jumlahPenumpang");

    this.addEventListeners();
  }

  addEventListeners() {
    this.driverType.addEventListener("change", this.checkFormValidity);
    this.date.addEventListener("input", this.checkFormValidity);
    this.pickupTime.addEventListener("change", this.checkFormValidity);
  }

  checkFormValidity = () => {
    if (
      this.driverType.value !== "default" &&
      this.date.value !== "" &&
      this.pickupTime.value !== "false"
    ) {
      this.loadButton.disabled = false;
    } else {
      this.loadButton.disabled = true;
    }
  };

  async init() {
    this.clear();
    await this.load();
    this.run();
  }

  run = () => {
    Car.list.forEach((car) => {
      const node = document.createElement("div");
      node.classList.add("col-lg-4", "my-2");
      node.innerHTML = car.render();
      this.carContainerElement.appendChild(node);
    });
  };

  async load() {
    const cars = await Binar.listCars();
    Car.init(cars);
    console.log(cars);
  }

  async loadFilter() {
    const cars = await Binar.listCars((data) => {
      const pickupDateData = new Date(data.availableAt).getTime();
      const date = new Date(
        `${this.date.value} ${this.pickupTime.value}`
      ).getTime();
      const checkTime = pickupDateData >= date;
      const availableAt =
        this.driverType.value === "true" && data.available ? true : false;
      const notAvailableAt =
        this.driverType.value === "false" && !data.available ? true : false;
      const passengers = data.capacity >= this.passengerCount.value;
      if (
        this.driverType.value !== "default" &&
        this.date.value !== "" &&
        this.pickupTime.value !== "false" &&
        this.passengerCount.value >= 0
      ) {
        return (availableAt || notAvailableAt) && checkTime && passengers;
      } else if (
        this.driverType.value !== "default" &&
        this.passengerCount.value > 0
      ) {
        return (availableAt || notAvailableAt) && passengers;
      } else if (
        this.date.value !== "" &&
        this.pickupTime.value !== "false" &&
        this.passengerCount.value > 0
      ) {
        return checkTime && passengers;
      } else if (this.date.value !== "" && this.pickupTime.value !== "false") {
        return checkTime;
      } else if (this.driverType.value !== "default") {
        return availableAt || notAvailableAt;
      } else {
        return passengers;
      }
    });
    console.log(cars);
    Car.init(cars);
  }

  clear = () => {
    let child = this.carContainerElement.firstElementChild;

    while (child) {
      child.remove();
      child = this.carContainerElement.firstElementChild;
    }
  };
}
