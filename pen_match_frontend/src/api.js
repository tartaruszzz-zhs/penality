import { API_BASE } from "./config";

export async function sendCode(phone) {
  const res = await fetch(`${API_BASE}/auth/send-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  })
  return res.json()
}

export async function verifyLogin(phone, code) {
  const res = await fetch(`${API_BASE}/auth/verify-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, code })
  })
  return res.json()
}

export async function getQuestions() {
  const res = await fetch(`${API_BASE}/questions`)
  return res.json()
}

export async function postAnswer(user_id, question_id, selected_option) {
  const res = await fetch(`${API_BASE}/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, question_id, selected_option })
  })
  return res.json()
}

export async function submitBatchAnswers(user_id, answers) {
  const res = await fetch(`${API_BASE}/answer/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, answers })
  })
  return res.json()
}

export async function getPenType(userId) {
  const res = await fetch(`${API_BASE}/pen-type/${userId}`)
  return res.json()
}

export async function getMatches(userId) {
  const res = await fetch(`${API_BASE}/match/${userId}`)
  return res.json()
}

export async function getAIAnalysis(userId) {
  const res = await fetch(`${API_BASE}/ai-analysis/${userId}`)
  return res.json()
}

export async function generateAIAnalysis(userId, mockPayment = true) {
  const res = await fetch(`${API_BASE}/ai-analysis/${userId}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mockPayment })
  })
  return res.json()
}

