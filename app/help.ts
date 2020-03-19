import { SelectOption, PropertyRef } from "solenya"
import { markdownElement } from '../util/markdown'
import { Person } from './data'

export type Indexed<T> = {
    [P in keyof T]: number;
};

export const help = (m: Indexed<Person>): SelectOption<PropertyRef<number>>[] =>
[
    { value: () => m.age, label: markdownElement({}, "While coronavirus can infect anyone, it becomes substantially more dangerous with age. Children seem to have an extremely low fatality rate, but may nonetheless be potentially potent spreaders of the virus.") },
    { value: () => m.preconditions, label: markdownElement({}, "Preconditions such as heart disease, lung disease, compromised immune system, and diabetes, put you at a higher risk.") },
    { value: () => m.socialContact, label: markdownElement({}, "Social contact increases the chance of spreading the virus. If you can, work from home. Avoid crowds. Avoid public transporation if you can. And no moshpits.") },
    { value: () => m.hygiene, label: markdownElement({}, "Don't touch things lots of people haved touched or may have coughed, sneezed, or spat on. Wash your hands regularly, for 20 seconds. Greet without touching. Coronavirus can last for hours or even days on surfaces.") },
    { value: () => m.climate, label: markdownElement({}, "There is weak evidence that warmer, particularly warm humid climates, reduce the spread of the virus (as seen with the common cold). This could potentially give governments in currently warm seasonal climates a little more time to prepare.") },
    { value: () => m.gender, label: markdownElement({}, "Males seem to be the slighter weaker sex on this one. There's been various proposals as to why, such as men smoking more, or having a different immune system, but the evidence is currently inconclusive.") },
    { value: () => m.healthServices, label: markdownElement({}, "An efficient health care system is important, but a surge in infections requires special preparation. This includes extensive and accurate testing, additional treatment centers, supplemental staffing, and vital equipment such as respirators. Remember that by reducing social contact and being hygienic, the virus will spread more slowly which reduces the load on the health system.") },
    { value: () => m.populationIR, label: markdownElement({}, "The percentage of the population that this coronavirus will infect is difficult to predict at this early stage. For reference, the 2009 H1N1 flu pandemic infected between 11-21% of the human population (so roughly a *billion* people give or take a few hundred million). The hope is that a comprehensive response can both slow and lower the infection rate.") },
    { value: () => m.ifr, label: markdownElement({}, "The Infection Fatality Rate (IFR) is the average chance a person will die if they are infected. The IFR is lower than the Case Fatality Rate (CFR), the death rate of those positively diagnosed, because many people who are asymptomatic or have only mild symptoms never get diagnosed at all. The covid-19 IFR could be over 10 times higher than seasonal flu, but over ten times lower than for MERS (Middle East Respiratory Syndrome).") }
]