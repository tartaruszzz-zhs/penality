import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuestions, postAnswer, getPenType } from '../api';

export default function Questions() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [guestAnswers, setGuestAnswers] = useState([]); // 游客模式：暂存答案
  const [showAuthPrompt, setShowAuthPrompt] = useState(false); // 是否显示登录提示

  useEffect(() => {
    // 获取题目（不检查登录状态，允许游客答题）
    async function fetchQuestions() {
      try {
        const res = await getQuestions();
        if (res.success) {
          setQuestions(res.questions);
        } else {
          alert('获取题目失败');
        }
      } catch (err) {
        console.error(err);
        alert('网络错误');
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  const handleAnswer = async (selectedOption, penType) => {
    // 移除 submitting 状态检查，因为现在只是本地操作，非常快
    // if (submitting) return; 
    // setSubmitting(true);

    const currentQuestion = questions[currentIndex];

    // 无论是否登录，都先暂存答案到本地状态
    const newAnswers = [...guestAnswers, {
      question_id: currentQuestion.id,
      selected_option: selectedOption
    }];
    setGuestAnswers(newAnswers);

    // 如果是最后一题
    if (currentIndex === questions.length - 1) {
      const userId = localStorage.getItem('userId');

      if (userId) {
        // 如果已登录，批量提交所有答案
        setSubmitting(true); // 显示加载状态
        try {
          const res = await import('../api').then(module => module.submitBatchAnswers(userId, newAnswers));
          if (res.success) {
            const resultRes = await getPenType(userId);
            if (resultRes.success) {
              localStorage.setItem('penType', resultRes.penType.name);
              navigate(`/result/${userId}`);
            } else {
              alert('计算结果失败');
            }
          } else {
            alert('提交失败: ' + res.message);
          }
        } catch (err) {
          console.error(err);
          alert('网络错误，提交失败');
        } finally {
          setSubmitting(false);
        }
      } else {
        // 未登录，显示简要分析
        localStorage.setItem('pendingAnswers', JSON.stringify(newAnswers));
        setShowAuthPrompt(true);
      }
    } else {
      // 不是最后一题，直接下一题
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (loading) return <div className="page-container" style={{ justifyContent: 'center', alignItems: 'center' }}>加载题目中...</div>;
  if (questions.length === 0) return <div className="page-container">暂无题目</div>;

  // 计算本地结果
  const calculateGuestResult = () => {
    if (guestAnswers.length === 0) return null;

    const counts = {};
    guestAnswers.forEach(ans => {
      // Find the pen type for the selected option
      const question = questions.find(q => q.id === ans.question_id);
      if (question) {
        let type = '';
        if (ans.selected_option === 'A') type = question.pen_type_a;
        if (ans.selected_option === 'B') type = question.pen_type_b;
        if (ans.selected_option === 'C') type = question.pen_type_c;
        if (ans.selected_option === 'D') type = question.pen_type_d;

        if (type) {
          counts[type] = (counts[type] || 0) + 1;
        }
      }
    });

    // Find max
    let maxType = '';
    let maxCount = 0;
    for (const [type, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        maxType = type;
      }
    }
    return maxType;
  };

  // 显示简要分析和登录提示
  if (showAuthPrompt) {
    const resultType = calculateGuestResult();

    return (
      <div className="page-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="auth-card" style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h2 className="auth-title">🎉 测试完成！</h2>

          <div style={{ margin: '2rem 0', padding: '1.5rem', background: '#f5f5f5', borderRadius: '8px' }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>您的初步分析结果</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e74c3c', marginBottom: '1rem' }}>
              {resultType || '未知类型'}
            </div>
            <p style={{ color: '#666', fontStyle: 'italic' }}>
              "你有着独特的思维方式和潜在的创造力..."
            </p>
            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#999' }}>
              🔒 详细性格特征、职业建议及匹配笔友功能已锁定
            </div>
          </div>

          <p style={{ marginBottom: '2rem', color: '#666' }}>
            登录以解锁您的完整性格报告
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              className="btn-primary"
              onClick={() => navigate('/login')}
              style={{ width: 'auto', padding: '0.8rem 2rem' }}
            >
              解锁完整报告 (手机号登录)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  // 安全检查：如果没有当前问题，返回加载状态
  if (!currentQuestion) {
    return <div className="page-container" style={{ justifyContent: 'center', alignItems: 'center' }}>加载中...</div>;
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="page-container">
      <nav className="nav">
        <div className="logo">测测笔格</div>
        <div className="links">
          <span>进度: {currentIndex + 1} / {questions.length}</span>
        </div>
      </nav>

      <div className="quiz-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="question-card">
          <h2 className="question-text">{currentQuestion.question_text}</h2>

          <div className="options-grid">
            <button
              className="option-btn"
              onClick={() => handleAnswer('A', currentQuestion.pen_type_a)}
              disabled={submitting}
            >
              A. {currentQuestion.option_a}
            </button>

            <button
              className="option-btn"
              onClick={() => handleAnswer('B', currentQuestion.pen_type_b)}
              disabled={submitting}
            >
              B. {currentQuestion.option_b}
            </button>

            <button
              className="option-btn"
              onClick={() => handleAnswer('C', currentQuestion.pen_type_c)}
              disabled={submitting}
            >
              C. {currentQuestion.option_c}
            </button>

            <button
              className="option-btn"
              onClick={() => handleAnswer('D', currentQuestion.pen_type_d)}
              disabled={submitting}
            >
              D. {currentQuestion.option_d}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
