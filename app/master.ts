import { b, Component, div, getLabel, getPropertyKey, h1, h2, img, IValidated, Label, Router, SelectOption, transient, Validator, VElement } from 'solenya'
import { media } from 'typestyle'
import { layoutClass, layoutContentClass, layoutFooterClass, layoutHeaderClass } from '../util/layout'
import { markdownElement } from '../util/markdown'
import { ageOptions, chanceOfDeath, climateOptions, genderOptions, healthServiceOptions, hygieneOptions, ifrOptions, Person, populationIROptions, preconditionOptions, socialContactOptions } from './data'
import { help, Indexed } from './help'
import { MediaWidth } from './styles'
import { inputUnit, mySlider } from './widgets'

export class Master extends Component implements IValidated, Indexed<Person>
{    
    @Label ("Age") age = 4   
    @Label ("Preconditions") preconditions = 0    
    @Label ("Social Contact") socialContact = 2    
    @Label ("Hygiene") hygiene = 1    
    @Label ("Gender") gender = 1
    @Label ("Health Services") healthServices = 1    
    @Label ("Climate") climate = 1    
    @Label ("Population IR") populationIR = 6
    @Label ("IFR") ifr = 2

    @transient focusedPropertyKey?: string
    @transient validator: Validator = new Validator(this)
    
    get personData() {
        return <Person>{
            age: ageOptions[this.age].data,
            preconditions: preconditionOptions[this.preconditions].data,            
            socialContact: socialContactOptions[this.socialContact].data,
            hygiene: hygieneOptions[this.hygiene].data,
            healthServices: healthServiceOptions[this.healthServices].data,
            gender: genderOptions[this.gender].data,
            climate: climateOptions[this.climate].data,
            populationIR: populationIROptions[this.populationIR].data,
            ifr: ifrOptions[this.ifr].data,            
        }
    }

    view(): VElement
    {        
        return (
            div({                
                class: layoutClass,
                style: {
                     position: "relative"                    
                }         
            },                                 
                div({ class: layoutHeaderClass, style: { background: "black", borderBottom: "1px solid white" } },                    
                    this.headerContent()
                ),
                div({                                        
                    class: layoutContentClass + " d-flex",                    
                    style: {
                        ...media({ minWidth: MediaWidth.medium }, {alignItems:"center"}),                        
                        backgroundSize: 'fixed',                    
                        background: "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7)), url('https://coronulator.s3.amazonaws.com/corona.jpg')",
                        width: '100%'                        
                    }
                },                   
                    div({ class: "container py-3" },
                        this.content(),                        
                    )                    
                ),
                div({ class: layoutFooterClass, style: { backgroundColor: "black"} },
                    this.footerContent()
                )             
            )
        )
    }

    updated(payload: any) {
        if (this.dataKeys().any (k => k == payload.key))
            this.focusedPropertyKey = payload.key
    }

    content() {
        return (
            div(
                div({ class: "d-flex my-3 justify-content-center"},
                  b("Asssuming you have not been tested and have no symptoms:")
              ),
                div({ class: "row align-items-stretch" },
                    div({ class: "col-lg-6" },
                        this.nominalSliderInput(() => this.age, ageOptions),
                        this.nominalSliderInput(() => this.preconditions, preconditionOptions),
                        this.nominalSliderInput(() => this.socialContact, socialContactOptions),                        
                        this.nominalSliderInput(() => this.hygiene, hygieneOptions),                        
                        this.nominalSliderInput(() => this.gender, genderOptions),
                        this.nominalSliderInput(() => this.healthServices, healthServiceOptions),
                        this.nominalSliderInput(() => this.climate, climateOptions),
                        this.nominalSliderInput(() => this.populationIR, populationIROptions),
                        this.nominalSliderInput(() => this.ifr, ifrOptions),
                    ),
                    div({ class: "col-lg-6 d-flex flex-column justify-content-between" },
                        div({ class: "mt-3" },this.currentFocusView()),
                        this.bigChanceView()                    
                    )
                )                
            )
        )
    }

    currentFocusView() {
        if (!this.focusedPropertyKey)
            return (
                div(
                    h2("Welcome to the Coronavirus Calculator."),
                    markdownElement({}, "This guesstimates the chance coronavirus will kill you with [this calculation](https://stackblitz.com/edit/corona?file=app%2Fdata.ts).")
                )
            )
            
        const focus = help(this).find(x => getPropertyKey(x.value) == this.focusedPropertyKey!)

        return ! focus ? undefined :
            div({ key: this.focusedPropertyKey},
               h2(getLabel (this, getPropertyKey (this.focusedPropertyKey))),
               div (focus.label)
            )
    }

    nominalSliderInput<T>(prop: () => number, options: SelectOption<T>[]) {
        return inputUnit(this, prop, props =>
            mySlider({
                ...props,                
                min: 0,
                max: options.length - 1,
                style: { currentTickLabel: m => options[m].label as string },
                inputAttrs: {
                    onfocus: () => this.focusedPropertyKey = getPropertyKey (prop)
                }
            }),
            {
                outerAttrs: { class: "my-3 row w-100 align-items-center" },                
                inputWithValidationAttrs: { style: { flex: 1 } },
                labelAttrs: {
                    class: "pr-3 d-flex align-items-center",
                    style: { width: "150px", justifyContent: "flex-end", cursor: "pointer" },
                    onclick: e => {
                      this.update(() => {
                        this.focusedPropertyKey = getPropertyKey(prop)
                      })
                      e.preventDefault()
                    }
                }
            }
        )
    }   

    bigChanceView() {
        const x = chanceOfDeath (this.personData)
        return (
            div (
                div({ style: {
                  fontSize: "550%",
                  ...media({ maxWidth: MediaWidth.small }, { fontSize: "350%" })
                }},
                    x >= 0.01 ?
                      (x*100).toPrecision(2)+"%" :
                      "1 in " + Math.round(1/x).toLocaleString()
                )     
            )
        )
    }

    headerContent() {
        return (
            div({ class: "my-2 container" },
                h1({
                    style: { cursor: "pointer" },
                    onclick: () => this.update(() => this.focusedPropertyKey = undefined)
                },
                    "Will coronavirus kill me?"
                ),
                markdownElement({}, "Feel free to [email me](mailto:coronulator@gmail.com) improvements to this [editable calculator](https://stackblitz.com/edit/corona?file=app%2Fdata.ts).")
            )
        )
    }

    footerContent() {
        return (
             div ({ class: "pt-2 container d-flex justify-content-center"},
                  markdownElement ({}, "For expert information, please visit the [Johns Hopkins Coronavirus Resource Center](https://coronavirus.jhu.edu/).")
             )
        )
    }
}