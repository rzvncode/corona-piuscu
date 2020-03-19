import { SelectOption } from "solenya"

export interface DataOption<T> extends SelectOption<T> {
    data: number
}

export const ageOptions: DataOption<number>[] = [
    { value: 0, data: 0.000, label: "0-9" },
    { value: 1, data: 0.002, label: "10-19" },
    { value: 2, data: 0.002, label: "20-29" },
    { value: 3, data: 0.002, label: "30-39" },
    { value: 4, data: 0.004, label: "40-49" },
    { value: 5, data: 0.013, label: "50-59" },
    { value: 6, data: 0.036, label: "60-69" },
    { value: 7, data: 0.08, label: "70-79" },
    { value: 8, data: 0.148, label: "80+" }
]

export const preconditionOptions: DataOption<number>[] = [
    { value: 0, data: 0.01, label: "None" },
    { value: 1, data: 0.03, label: "Minor" },
    { value: 2, data: 0.1, label: "Major" }
]

export const socialContactOptions: DataOption<number>[] = [
    { value: 0, data: 0.2, label: "None" },
    { value: 1, data: 0.5, label: "Small" },
    { value: 2, data: 0.8, label: "Av." },
    { value: 3, data: 0.9, label: "Large" },
    { value: 4, data: 1.0, label: "Huge" }
]

export const hygieneOptions: DataOption<number>[] = [
    { value: 0, data: 0.7, label: "Good" },
    { value: 1, data: 0.9, label: "Av." },
    { value: 2, data: 1.0, label: "Poor" }
]

export const genderOptions: DataOption<number>[] = [
    { value: 0, data: 0.8, label: "Female" },
    { value: 1, data: 0.9, label: "?" },
    { value: 2, data: 1.0, label: "Male" }
]

export const healthServiceOptions: DataOption<number>[] = [
    { value: 0, data: 0.2, label: "Good" },
    { value: 1, data: 0.5, label: "Av." },
    { value: 2, data: 1, label: "Poor" }
]

export const climateOptions: DataOption<number>[] = [
    { value: 0, data: 0.9, label: "Warm" },
    { value: 1, data: 1.0, label: "Cold" }
]

export const populationIROptions: DataOption<number>[] = [
    { value: 0, data: 0.001, label: "0.1%" },
    { value: 1, data: 0.002, label: "0.2%" },
    { value: 2, data: 0.005, label: "0.5%" },
    { value: 3, data: 0.01, label: "1%" },
    { value: 4, data: 0.02, label: "2%" },
    { value: 5, data: 0.05, label: "5%" },
    { value: 6, data: 0.1, label: "10%" },
    { value: 7, data: 0.2, label: "20%" },
    { value: 8, data: 0.5, label: "50%" },
]

export const ifrOptions: DataOption<number>[] = [
    { value: 0, data: 0.002, label: "0.2%" },
    { value: 1, data: 0.005, label: "0.5%" },
    { value: 2, data: 0.01, label: "1%" },
    { value: 3, data: 0.02, label: "2%" },
    { value: 4, data: 0.05, label: "5%" }
]

export interface Person {                
    age: number
    preconditions: number
    socialContact: number
    hygiene: number    
    gender: number
    healthServices: number    
    climate: number    
    populationIR: number
    ifr: number
}

export const chanceOfDeath = (p: Person) =>
    ((p.age + p.preconditions) / 2) *    
    p.socialContact *
    p.hygiene *
    p.gender *
    p.healthServices *    
    p.climate *    
    p.populationIR *
    p.ifr *
    90 // constant