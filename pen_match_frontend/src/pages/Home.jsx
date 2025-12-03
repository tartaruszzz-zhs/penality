import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <nav className="nav">
        <div className="logo">测测笔格</div>
        <div className="links">
          <a href="/">首页</a>
          <a href="/questions">测试</a>
          <a href="/about">关于</a>
        </div>
      </nav>

      <div className="content">
        <div
          className="hero-wrapper"
          onClick={() => navigate('/questions')} // 点击整个图片区域
          style={{ cursor: 'pointer' }}
        >
          <img
            src="/assets/home-hero.png"
            alt="比格犬首页"
            className="hero-image"
          />
          {/* 可选：半透明遮罩+文字 */}
          <div className="hero-text">开始测试</div>
        </div>
      </div>

      <footer className="footer">
        &copy; 2025 pen_match. 比格吉祥物守护你的笔格！
      </footer>
    </div>
  );
}
