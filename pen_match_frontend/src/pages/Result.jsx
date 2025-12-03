import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPenType, getAIAnalysis, generateAIAnalysis } from '../api';

export default function Result() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiReport, setAiReport] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    async function fetchResult() {
      try {
        const res = await getPenType(id);
        if (res.success) {
          setResult(res.penType);
        } else {
          alert('获取结果失败');
        }
      } catch (err) {
        console.error(err);
        alert('网络错误');
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [id]);

  const handleUnlockAI = async () => {
    // Check if already purchased
    try {
      const existing = await getAIAnalysis(id);
      if (existing.success && existing.report && existing.isPaid) {
        // Already paid, show report directly
        setAiReport(existing.report);
        setShowAIModal(true);
        return;
      }
    } catch (err) {
      console.error(err);
    }

    // Show payment verification modal (not AI modal yet)
    setShowAIModal(true);
  };

  const handlePaymentVerify = async (verificationCode) => {
    setAiLoading(true);

    try {
      // In real app, verify payment code with backend
      // For demo, accept any 6-digit code
      if (verificationCode.length !== 6) {
        alert('请输入6位验证码');
        setAiLoading(false);
        return;
      }

      // Generate report with payment flag
      const res = await generateAIAnalysis(id, true); // true = paid
      if (res.success) {
        setAiReport(res.report);
      } else {
        alert('生成报告失败: ' + res.message);
        setShowAIModal(false);
      }
    } catch (err) {
      console.error(err);
      alert('网络错误');
      setShowAIModal(false);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <div className="page-container" style={{ justifyContent: 'center', alignItems: 'center' }}>分析性格中...</div>;
  if (!result) return <div className="page-container">暂无结果</div>;

  return (
    <div className="page-container">
      <nav className="nav">
        <div className="logo">测测笔格</div>
        <div className="links">
          <Link to="/">首页</Link>
          <span onClick={() => {
            localStorage.clear();
            navigate('/login');
          }} style={{ cursor: 'pointer', marginLeft: '1.5rem' }}>退出</span>
        </div>
      </nav>

      <div className="result-container">
        <div className="pen-type-card">
          <div className="pen-type-title">{result.name}</div>

          {result.slogan && (
            <div style={{
              fontSize: '1.2rem',
              fontStyle: 'italic',
              color: '#666',
              marginBottom: '2rem',
              textAlign: 'center',
              borderBottom: '1px solid #eee',
              paddingBottom: '1rem'
            }}>
              "{result.slogan}"
            </div>
          )}

          <div className="result-section">
            <h3>🖋️ 核心画像</h3>
            <div className="pen-type-desc">{result.description}</div>
          </div>

          {result.shadow_side && (
            <div className="result-section" style={{ marginTop: '2rem' }}>
              <h3 style={{ color: '#7f8c8d' }}>🌑 阴影面</h3>
              <p style={{ lineHeight: '1.6', color: '#555' }}>{result.shadow_side}</p>
            </div>
          )}

          {result.advice && (
            <div className="result-section" style={{ marginTop: '2rem', background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
              <h3 style={{ color: '#27ae60' }}>💡 大师建议</h3>
              <p style={{ lineHeight: '1.6', color: '#333', fontStyle: 'italic' }}>{result.advice}</p>
            </div>
          )}

          {/* AI Deep Analysis Unlock Card */}
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'white' }}>🤖 解锁 AI 深度分析</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem', opacity: 0.9 }}>
              基于您的30道题答案，由国际心理学大师为您生成专属的深度分析报告
            </p>
            <button
              onClick={handleUnlockAI}
              style={{
                background: 'white',
                color: '#667eea',
                border: 'none',
                padding: '0.8rem 2rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              立即解锁深度分析 💎
            </button>
          </div>

          <div className="action-buttons" style={{ marginTop: '3rem' }}>
            <Link to={"/match/" + result.name} className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto' }}>
              寻找笔友 ({result.name})
            </Link>
            <Link to="/questions" className="btn-secondary">
              重新测试
            </Link>
          </div>
        </div>
      </div>

      {/* AI Analysis Modal */}
      {showAIModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '2rem'
        }} onClick={() => { if (!aiLoading) setShowAIModal(false); }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
            padding: '2rem',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowAIModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#999'
              }}
            >×</button>

            {!aiReport && !aiLoading ? (
              // Payment verification step
              <div>
                <h2 style={{ marginBottom: '1rem', color: '#667eea' }}>🔐 付费验证</h2>
                <p style={{ marginBottom: '1.5rem', color: '#666' }}>
                  请输入支付验证码以解锁深度分析报告
                </p>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const code = e.target.code.value;
                  handlePaymentVerify(code);
                }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      支付验证码
                    </label>
                    <input
                      type="text"
                      name="code"
                      placeholder="请输入6位验证码"
                      maxLength={6}
                      required
                      style={{
                        width: '100%',
                        padding: '0.8rem',
                        fontSize: '1rem',
                        border: '2px solid #ddd',
                        borderRadius: '8px'
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#999', marginBottom: '1.5rem' }}>
                    💡 演示模式：输入任意6位数字即可解锁
                  </div>
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '1rem',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    确认支付并解锁
                  </button>
                </form>
              </div>
            ) : aiLoading ? (
              // Loading state
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤖</div>
                <p>国际心理学AI大师正在为您生成深度分析...</p>
              </div>
            ) : (
              // Show report
              <div>
                <h2 style={{ marginBottom: '1.5rem', color: '#667eea' }}>AI 深度性格分析报告</h2>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: '#333' }}>
                  {aiReport}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
