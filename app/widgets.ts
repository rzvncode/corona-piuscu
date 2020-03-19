import { Component, div, getPropertyKey, HAttributes, InputProps, IValidated, mergeAttrs, PropertyRef, VElement, HValue, span, getFriendlyName, label, a } from "solenya"
import { slider, SliderProps } from '../util/slider'
import { theme } from './styles'

export const mySlider = (props: SliderProps) =>
    slider({                    
        ...props,
        style: {
            ...props.style,
            trackProgressColor: theme.primary,
            trackColor: theme.secondary,
            trackBorderWidth: 0,                   
            ticks: "ticks",            
            thumbRadius: 30,
            thumbWidth: 60,
            thumbHeight: 26,
            trackHeight: 10        
        }
    })         

export interface InputUnitProps  {
    label?: string,
    outerAttrs?: HAttributes,
    inputAttrs?: HAttributes,
    labelAttrs?: HAttributes,
    inputWithValidationAttrs?: HAttributes    
}

export const inputUnit = <T>
(    
    target: IValidated & Component,
    prop: PropertyRef<T>,           
    createInput: (props: InputProps<T>) => VElement,    
    props: InputUnitProps = {}
) =>
    div (props.outerAttrs,
        label (
            mergeAttrs (props.labelAttrs, {
                for: getPropertyKey(prop),            
                style: { fontSize: "95%", fontWeight: "bold" }
            }),
            props.label || getFriendlyName(target, prop)
        ),
        div (props.inputWithValidationAttrs,
            createInput ({
                target,
                prop,
                attrs: mergeAttrs (props.inputAttrs, {
                    id: getPropertyKey (prop),
                    class: "form-control"
                })                   
            })
        )
    )