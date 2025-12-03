import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMatches } from '../api';

export default function Match() {
  const { type } = useParams();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await getMatches(userId);
        if (res.success) {
          setMatches(res.matches);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, [userId]);

  return (
    <div className="page-container">
      <nav className="nav">
        <div className="logo">测测笔格</div>
        <div className="links">
          <Link to={`/result/${userId}`}>返回结果</Link>
        </div>
      </nav>

      <div className="result-container">
        <h2>你的笔友匹配</h2>
        <p style={{ marginBottom: '2rem', color: '#666' }}>
          这些用户和你一样，都是 <strong>{type}</strong> 类型的性格
        </p>

        {loading ? (
          <div>寻找中...</div>
        ) : matches.length === 0 ? (
          <div className="pen-type-card">
            <p>暂时还没有找到同类型的其他用户，快邀请朋友来测测吧！</p>
          </div>
        ) : (
          <div className="match-grid">
            {matches.map(user => (
              <div key={user.id} className="user-card">
                <div className="user-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <h3>{user.username}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  加入时间: {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
