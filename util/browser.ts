import * as Bowser from "bowser"

const browser = Bowser.getParser(window.navigator.userAgent)

export const getBrowserType = () =>
    browser.getBrowserName() as "Chrome" | "Safari" | "Internet Explorer" | "Firefox" | "Edge"