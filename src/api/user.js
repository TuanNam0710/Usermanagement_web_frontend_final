import request from '../utils/request';
export function login(data) {
    return request({
        url: "/auth/login",
        method: "post",
        data,
    });
}

export function register(data) {
    return request({
        url: "/register",
        method: "post",
        data,
    });
}

export function getInfo(token) {
    return request({
        url: "/auth/me",
        method: "post",
    });
}

export function logout() {
    return request({
        url: "/auth/logout",
        method: "post",
    });
}

export function forgot(data) {
    return request({
        url: '/i-forgot/send-email',
        method: 'post',
        data,
    })
}

export function checkOTP(data) {
    return request({
        url: '/reset-password/check-otp',
        method: 'post',
        data,
    })
}

export function resetPassword(data_user) {
    return request({
        url: 'reset-password/reset',
        method: 'post',
        data: data_user,
    })
}