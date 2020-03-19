import { style } from "typestyle"
import { NestedCSSProperties } from "typestyle/lib/types"

export const layoutClass = style ({
    display: 'flex',
    flex: '0 1 auto',
    flexFlow: 'column',
    minHeight: '100vh', 
    width: '100%'
})

export const layoutHeaderClass = style({
    flex: '0 1 auto'
})

export const layoutContentClass = style({
    flex: '1 1 auto'
})

export const layoutFooterClass = style({
    flex: '0 1 auto'
})

export const ieOnlyMedia = "@media screen and (-ms-high-contrast:active), all and (-ms-high-contrast:none)"

export const ieOnlyClass = (value: NestedCSSProperties) => style({
    $debugName: "ieOnly",
    $nest: {
        [ieOnlyMedia]: value
    }
})