import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendCode, verifyLogin, postAnswer, getPenType } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'code'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugCode, setDebugCode] = useState(''); // For demo purposes

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await sendCode(phone);
      if (res.success) {
        setStep('code');
        setDebugCode(res.debugCode); // Show code for testing
      } else {
        setError(res.message || '发送验证码失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await verifyLogin(phone, code);
      if (res.success) {
        // 保存用户信息
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.userId);
        localStorage.setItem('username', res.username);

        // 检查是否有待提交的答案
        const pendingAnswers = localStorage.getItem('pendingAnswers');
        if (pendingAnswers) {
          try {
            const answers = JSON.parse(pendingAnswers);
            // 批量提交所有答案
            await import('../api').then(module => module.submitBatchAnswers(res.userId, answers));
            localStorage.removeItem('pendingAnswers');

            const resultRes = await getPenType(res.userId);
            if (resultRes.success) {
              localStorage.setItem('penType', resultRes.penType.name);
              navigate(`/result/${res.userId}`);
              return;
            }
          } catch (err) {
            console.error('Error submitting pending answers:', err);
          }
        }

        // 跳转逻辑
        if (res.penType) {
          localStorage.setItem('penType', res.penType);
          navigate(`/result/${res.userId}`);
        } else {
          navigate('/questions');
        }
      } else {
        setError(res.message || '登录失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="auth-card">
        <h2 className="auth-title">手机号登录/注册</h2>
        {error && <div className="error-message">{error}</div>}

        {/* Debug Info for Demo */}
        {debugCode && (
          <div style={{ background: '#e6f7ff', padding: '10px', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', color: '#1890ff' }}>
            测试验证码: <strong>{debugCode}</strong>
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendCode}>
            <div className="form-group">
              <label>手机号</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入手机号"
                required
                pattern="^1[3-9]\d{9}$"
                title="请输入有效的11位手机号"
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? '发送中...' : '获取验证码'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>手机号: {phone}</label>
              <div style={{ marginTop: '0.5rem' }}>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="请输入6位验证码"
                  required
                  maxLength={6}
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? '登录中...' : '登录 / 注册'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => { setStep('phone'); setDebugCode(''); setError(''); }}
              style={{ marginTop: '1rem' }}
            >
              返回修改手机号
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
