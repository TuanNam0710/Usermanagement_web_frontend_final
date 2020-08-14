import request from '../utils/request'

export function index(params) {
    return request({
        url: '/users',
        method: 'get',
        params,
    });
}

export function store(data) {
    return request({
        url: '/users',
        method: 'post',
        data,
    });
}

export function update(id, data) {
    return request({
        url: `/users/${id}`,
        method: 'put',
        data,
    });
}

export function destroy(id) {
    return request({
        url: `users/${id}`,
        method: 'delete',
    });
}