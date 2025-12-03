import { API_BASE } from '../config';

export async function login(username, password) {
  // 占位函数，前端可正常调用
  return { success: true, message: '模拟登录成功' };
}

export async function register(username, password) {
  return { success: true, message: '模拟注册成功' };
}
