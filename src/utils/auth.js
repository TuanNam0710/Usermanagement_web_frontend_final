import Cookies from "js-cookie"

const TokenKey = "access_token"

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token, rememberMe = false) {
    return rememberMe ? Cookies.set(TokenKey, token, { expires: 365 }) : Cookies.set(TokenKey, token);
}

export function removeToken(token) {
    return Cookies.remove(token);
}

export function removeCookie(cookie) {
    return Cookies.remove(TokenKey);
}