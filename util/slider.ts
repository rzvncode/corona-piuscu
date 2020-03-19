import { div, getPropertyKey, getPropertyValue, HAttributes, InputProps, inputRange, mergeAttrs, setPropertyValue } from "solenya"
import { style } from "typestyle"
import { NestedCSSProperties } from "typestyle/lib/types"
import { getBrowserType } from "./browser"
import { ieOnlyClass } from "./layout"
import { constrain } from "./util"
import $ from 'jquery'

export const slider = (props: SliderProps) => {
    const ss = { ...props, style: { ...defaultSliderStyleProps } }
    for (const p of Object.keys(props.style))
        ss.style[p] = props.style[p]

    const height =
        ss.style.thumbHeight +
        (ss.style.ticks == 'none' ? 0 : ss.style.tickHeight) +
        (ss.style.ticks != 'labeledTicks' ? 0 : ss.style.labelHeight + ss.style.tickLabelMargin)

    return (
        div({
            class: sliderStyle(ss.style) + " d-flex w-100",
            style: {
                minHeight: `${height}px`
            }
        },
            !ss.style.showCurrent ?
                undefined :
                div({
                    id: getPropertyKey(props.prop) + "_thumbLabel",
                    class: "solenya-thumb-label d-flex align-items-center justify-content-center",
                    style: { zIndex: 1000, userSelect: "none", pointerEvents: "none", outline: "none", whiteSpace: "nowrap" }
                },
                    div({
                        class: ieOnlyClass({ transform: "translate(-50%,-50%)" }),
                        style: { position: "absolute", fontWeight: "bold"},
                        onclick: ev => $(ev.target!).blur()
                    },
                        ss.style.currentTickLabel(getPropertyValue(props.target, props.prop))
                    )
                ),
            div({
                class: "d-flex w-100 align-items-center",
                style: {
                    position: "relative",

                }
            },
                inputRange({
                    target: props.target,
                    prop: props.prop,
                    attrs: mergeAttrs(props.inputAttrs, {
                        min: props.min,
                        max: props.max,
                        step: props.step || 1,
                        name: getPropertyKey(props.prop),
                        id: getPropertyKey(props.prop),
                        onAttached: el => attachSlider(el, ss),
                        style: {
                            cursor: "pointer",
                            position: "relative",
                            zIndex: 100
                        }
                    })
                }),
                ss.style.ticks == "none" ? undefined :
                    div({
                        class: ticksStyle(ss.style.tickHeight, ss.style.tickLabelMargin),
                        style: {
                            position: "absolute",
                            left: 0,
                            right: 0,
                            top: "50%",
                            padding: `0 ${ss.style.thumbWidth / 2}px`,
                            display: "flex",
                            justifyContent: "space-between"
                        }
                    },
                        range(0, (props.max - props.min) / (ss.style.tickStep || props.step || 1) + 1).map(x =>
                            div({ style: { borderLeftColor: getPropertyValue(props.target, props.prop) <= x ? props.style.trackColor : props.style.trackProgressColor } },
                                ss.style.ticks != "labeledTicks" ?
                                    undefined :
                                    div(ss.style.tickLabel(props.min + (x * (ss.step || 1))))
                            )
                        )
                    )
            )
        )
    )
}

const attachSlider = (el: Element, props: SliderProps) => {

    const hel = el as HTMLInputElement

    if (!hel["data_ready"]) {
        hel["data_ready"] = true
        setTimeout(() => attachSlider(el, props), 200) // otherwise rect won't work with modal
    }

    const syncLabelPosition = () => {
        const label = $("#" + getPropertyKey(props.prop) + "_thumbLabel")
        const fraction = (getPropertyValue(props.target, props.prop) - props.min) / (props.max - props.min)
        const width = hel.getBoundingClientRect().width - 1
        const left = props.style.thumbWidth! / 2 + fraction * (width - props.style.thumbWidth!)
        label.css("transform", `translate(${left}px, -1px)`)
    }

    const setVisualProgressFromValue = () => {
        const percent = (parseFloat(hel.value) - props.min) / (props.max - props.min) * 100
        const cl = props.style.trackProgressColor
        const cr = props.style.trackColor
        if (! ["Edge","Internet Explorer"].any(b => b == getBrowserType()))
            hel.style.background = `linear-gradient(to right, ${cl} 0%, ${cl} ${percent}%, ${cr} ${percent}%, ${cr} 100%)`
        syncLabelPosition()
    }

    const setValueFromVisualProgress = (ev: MouseEvent) => {
        const rect = hel.getBoundingClientRect()
        const pixelFraction = constrain((ev.clientX - rect.left) / rect.width, 0, 1)
        const progress = parseFloat(hel.min) + pixelFraction * (parseFloat(hel.max) - parseFloat(hel.min))
        const step = parseFloat(hel.step)
        const normalizedProgress = Math.round(progress / step) * step

        hel.value = "" + normalizedProgress
        setPropertyValue(props.target, props.prop, normalizedProgress)
        setVisualProgressFromValue()

        ev.preventDefault()

        return false
    }

    const focusLabel = (focused: boolean) => {
        const label = $("#" + getPropertyKey(props.prop) + "_thumbLabel")
        label.css("color", focused ? props.style.thumbFocusColor! : props.style.thumbColor!)
        label.css("background-color", focused ? props.style.thumbFocusBackgroundColor! : props.style.thumbBackgroundColor!)
    }

    setVisualProgressFromValue()
    focusLabel(false)
    el.addEventListener("input", ev => setVisualProgressFromValue())
    el.addEventListener("change", ev => syncLabelPosition())
    el.addEventListener("focus", ev => focusLabel(true))
    el.addEventListener("blur", ev => focusLabel(false))
    window.addEventListener("resize", ev => syncLabelPosition())
    window.addEventListener("focus", ev => syncLabelPosition())
    el.parentElement!.addEventListener("click", ev => setValueFromVisualProgress(ev as MouseEvent))
    el.parentElement!.addEventListener("click", ev => setValueFromVisualProgress(ev as MouseEvent))
}

export interface SliderProps extends InputProps<number> {
    min: number
    max: number
    step?: number,
    style: Partial<SliderStyleProps>
    inputAttrs?: HAttributes
}

export interface SliderStyleProps {
    trackColor: string
    trackProgressColor: string
    tickHeight: number
    labelHeight: number
    ticks: "none" | "ticks" | "labeledTicks"
    tickStep: number
    tickColor: string

    thumbBackgroundColor: string
    thumbColor: string
    thumbRadius: number
    thumbHeight: number
    thumbWidth: number
    thumbShadowSize: number
    thumbShadowBlur: number
    thumbShadowColor: string
    thumbBorderWidth: number
    thumbBorderColor: string
    thumbFocusColor: string
    thumbFocusBackgroundColor: string    

    trackRadius: number
    trackHeight: number
    trackShadowSize: number
    trackShadowBlur: number
    trackShadowColor: string
    trackBorderWidth: number
    trackBorderColor: string

    trackWidth: string
    tickLabelMargin: number
    tickLabel: (value: number) => string
    currentTickLabel: (value: number) => string
    showCurrent: boolean    
}

const defaultSliderStyleProps: SliderStyleProps = {
    trackColor: "lime",
    trackProgressColor: "red",    
    labelHeight: 16,
    tickHeight: 5,
    tickStep: 1,
    ticks: "ticks",
    tickColor: "white",

    thumbBackgroundColor: "#444",
    thumbColor: "white",
    thumbRadius: 15,
    thumbHeight: 30,
    thumbWidth: 30,
    thumbShadowSize: 4,
    thumbShadowBlur: 4,
    thumbShadowColor: "rgba(0, 0, 0, .2)",
    thumbBorderWidth: 1,
    thumbBorderColor: "#eceff1",
    thumbFocusColor: "black",
    thumbFocusBackgroundColor: "white",

    trackWidth: "100%",
    trackHeight: 12,
    trackShadowSize: 0,
    trackShadowBlur: 0,
    trackShadowColor: "rgba(0, 0, 0, .2)",
    trackBorderWidth: 1,
    trackBorderColor: "#AF006E",

    tickLabelMargin: 5,
    trackRadius: 0,
    tickLabel: value => "" + value,
    currentTickLabel: value => "" + value,
    showCurrent: true
}

export const sliderStyle = (p: SliderStyleProps) => {
    const shadow = (shadowSize: number, shadowBlur: number, shadowColor: string) => <NestedCSSProperties>{
        boxShadow: `${shadowSize}px ${shadowSize}px ${shadowBlur}px ${shadowColor}, 0 0 ${shadowSize}px ${shadowColor}`
    }

    const border = (width: number, color: string) => <NestedCSSProperties>{
        border: `${width}px solid ${color}`,
    }

    const track = <NestedCSSProperties>{
        cursor: "pointer",
        height: p.trackHeight + "px",
        transition: "all .2s ease",
        width: p.trackWidth
    }

    const trackShadow = shadow(p.trackShadowSize, p.trackShadowBlur, p.trackShadowColor)

    const trackBorder = border(p.trackBorderWidth, p.trackBorderColor)

    const thumb = <NestedCSSProperties>{
        ...shadow(p.thumbShadowSize, p.thumbShadowBlur, p.thumbShadowColor),
        background: p.thumbBackgroundColor,
        border: `${p.thumbBorderWidth}px solid ${p.thumbBorderColor}`,
        borderRadius: p.thumbRadius + "px",
        cursor: "pointer",
        height: p.thumbHeight + "px",
        width: p.thumbWidth + "px"
    }

    const focusThumbName = // limitation of either typestyle or thumb css; only 1 can be specified
        getBrowserType() == "Firefox" ? "&::-moz-range-thumb" :
            getBrowserType() == "Internet Explorer" ? "&::-ms-thumb" :
                "&::-webkit-slider-thumb"

    return style({
        display: "block",
        $nest: {
            "> *": {
                display: "flex",
                flex: "1 1 auto"
            },
            "> *:nth-child(2)": {
                flex: "2 1 auto",
                $nest: {
                    input: {
                        zIndex: 100
                    }
                }
            },
            input: {
                width: "100%",
                maxWidth: "100%",
                minWidth: "100%",
                padding: 0,
                margin: 0,
                fontSize: "8px"
            },            
            "[type='range']": {
                "-webkit-appearance": "none",
                width: p.trackWidth,
                $nest: {
                    "&:focus": {
                        outline: 0,
                        $nest: {
                            [focusThumbName]: {                                
                                backgroundColor: p.thumbFocusBackgroundColor                                
                            }
                        }
                    },
                    "&::-webkit-slider-runnable-track": {
                        ...track,
                        ...trackShadow,
                        ...trackBorder,
                        borderRadius: p.trackRadius + "px"
                    },
                    "&::-webkit-slider-thumb": {
                        ...thumb,
                        "-webkit-appearance": "none",
                        marginTop: ((-p.trackBorderWidth * 2 + p.trackHeight / 2) - p.thumbHeight / 2) + "px"
                    },
                    "&::-moz-range-track": {
                        maxHeight: p.trackHeight + "px",
                        ...track,
                        ...trackShadow,
                        ...trackBorder,
                        background: p.trackColor,
                        borderRadius: p.trackRadius + "px",
                    },
                    "&::-moz-range-progress": {
                        height: p.trackHeight + "px",
                        backgroundColor: p.trackProgressColor
                    },
                    "&::-moz-range-thumb": {
                        ...thumb,
                    },
                    "&::-ms-track": {
                        ...track,
                        background: "transparent",
                        borderColor: "transparent",
                        borderWidth: `${p.thumbHeight / 2}px 0`,
                        color: "transparent"
                    },
                    "&::-ms-fill-lower": {
                        ...trackShadow,
                        ...trackBorder,
                        background: p.trackProgressColor,
                        borderRadius: `${p.trackRadius * 2}px`,
                    },
                    "&::-ms-fill-upper": {
                        ...trackShadow,
                        ...trackBorder,
                        background: p.trackColor,
                        borderRadius: `${p.trackRadius * 2}px`,
                    },
                    "&::-ms-thumb": {
                        ...thumb,
                        marginTop: 0
                    }
                }
            }
        }
    })
}

const ticksStyle = (height: number, tickLabelMargin: number) => style({
    $nest: {
        "> div": {
            borderLeftWidth: "1px",
            borderLeftStyle: "solid",
            height: height * 2 + "px",
            position: "relative",
            $nest: {
                "> div": {
                    position: "absolute",
                    top: "50%",
                    transform: `translate(-50%, ${tickLabelMargin}px)`
                }
            }
        }
    }
})

const range = (start: number, count: number, step: number = 1) =>
    Array.apply(0, Array(count))
        .map((element, index) => (index * step) + start)