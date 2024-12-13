import { Href } from "expo-router";

export  const services = [{
    title: "Bike",
    image: require("../../assets/images/electric.png"),
    route: "/(root)/(screens)/find-destination" as Href<string>
},
{
    title: "Car",
    image: require("../../assets/images/car.png"),
    route: "/(root)/(screens)/find-destination" as Href<string>
},]