import { pricePerKmBike, pricePerKmCar } from "../constants/pricing"

export const calculatePricings = ({ distance, vehcileType }: { distance: number, vehcileType: string }) => {

    if (vehcileType == "Bike") {
        let initialPrice = Math.ceil(distance * pricePerKmBike);
        if (initialPrice < 50) {
            initialPrice = 60
        }
        let minimumPrice = Math.ceil((initialPrice-0.1 * initialPrice));
        return { initialPrice, minimumPrice }

    }
    else {
        let initialPrice = Math.ceil(distance * pricePerKmCar);
        if (initialPrice < 200) {
            initialPrice = 220
        }
        let minimumPrice = Math.ceil(initialPrice-0.2 * initialPrice)
        return { initialPrice, minimumPrice }
    }
}