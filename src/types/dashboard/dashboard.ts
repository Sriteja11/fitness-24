export interface FoodItem {
    name: string;
    calories: number;
    protein: number;
    fat?: number;
    quantity?: number; // in grams/ml
}

export interface FoodNutritionalInfo {
    foodItemName: string;
    foodItemCalories: number;
    foodItemProtein: number;
    foodItemCarbs: number;
    foodItemFat: number;
}

export interface UserProfile {
    activity: string;
    name: string;
    height: number; // in cm
    weight: number; // in kg
    gender: 'male' | 'female';
    age: number;
}

export interface Mode {
    label: string;
    value: string;
    multiplier: number; // multiplier for BMR calculation
}
