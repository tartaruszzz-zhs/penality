# Pen Match Backend API

基于 Node.js + Express + MySQL 的钢笔性格匹配系统后端 API。

## 功能特性

- ✅ 用户注册与登录
- ✅ JWT 身份认证
- ✅ 性格测试题目管理
- ✅ 用户答案记录
- ✅ 钢笔性格类型计算
- ✅ 相同性格用户匹配
- ✅ 输入验证与安全

## 技术栈

- **Node.js** - 运行环境
- **Express** - Web 框架
- **MySQL** - 关系型数据库
- **bcryptjs** - 密码加密
- **jsonwebtoken** - JWT 认证
- **mysql2** - MySQL 驱动（支持 Promise）

## 项目结构

```
pen_match_backend/
├── db/
│   ├── connection.js      # MySQL 连接池
│   ├── schema.sql         # 数据库表结构
│   └── seed.sql           # 初始数据
├── middleware/
│   └── auth.js            # JWT 认证中间件
├── routes/
│   ├── auth.js            # 注册/登录路由
│   ├── questions.js       # 题目路由
│   ├── pentype.js         # 性格类型路由
│   └── match.js           # 匹配路由
├── utils/
│   └── validation.js      # 输入验证工具
├── .env                   # 环境变量配置
├── .gitignore
├── package.json
└── server.js              # 服务器入口
```

## 数据库设计

### 表结构

1. **users** - 用户表
   - id, username, password (hashed), email, pen_type, created_at

2. **pen_types** - 钢笔类型表
   - id, type_name, description, characteristics

3. **questions** - 题目表
   - id, question_text, option_a/b/c/d, pen_type_a/b/c/d

4. **answers** - 答案表
   - id, user_id, question_id, selected_option, answered_at

### 钢笔性格类型

系统包含 8 种钢笔性格类型：
- **FountainPen (钢笔)** - 坚守与秩序
- **Marker (马克笔)** - 热烈与张扬
- **Crayon (蜡笔)** - 纯真与野性
- **Stylus (触控笔)** - 理性与未来
- **Quill (羽毛笔)** - 深沉与忧郁
- **Brush (毛笔)** - 禅意与超脱
- **Chalk (粉笔)** - 奉献与传承
- **Pencil (铅笔)** - 温和与适应

## 安装与启动

### 1. 安装依赖

```bash
cd pen_match_backend
npm install
```

### 2. 配置环境变量

编辑 `.env` 文件，修改数据库连接信息：

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pen_match
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

### 3. 初始化数据库

```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库并导入结构
source db/schema.sql

# 导入初始数据（6种性格类型 + 15道题目）
source db/seed.sql
```

### 4. 启动服务器

```bash
# 开发模式（使用 nodemon 自动重启）
npm run dev

# 生产模式
npm start
```

服务器将在 `http://localhost:3000` 启动。

## API 接口文档

### 用户认证

#### 注册

```
POST /register
Content-Type: application/json

{
  "username": "testuser",
  "password": "Test123",
  "email": "test@example.com"
}

Response:
{
  "success": true,
  "userId": 1,
  "message": "注册成功"
}
```

#### 登录

```
POST /login
Content-Type: application/json

{
  "username": "testuser",
  "password": "Test123"
}

Response:
{
  "success": true,
  "token": "eyJhbGci...",
  "userId": 1,
  "username": "testuser",
  "penType": "优雅派"
}
```

### 题目与答案

#### 获取所有题目

```
GET /questions

Response:
{
  "success": true,
  "questions": [
    {
      "id": 1,
      "question_text": "你更喜欢哪种工作方式？",
      "option_a": "注重细节，追求完美",
      "option_b": "高效完成，注重结果",
      "option_c": "创新思考，寻找新方法",
      "option_d": "遵循传统，稳步推进"
    }
  ]
}
```

#### 提交答案

```
POST /answer
Content-Type: application/json

{
  "user_id": 1,
  "question_id": 1,
  "selected_option": "A"
}

Response:
{
  "success": true,
  "message": "答案已保存"
}
```

### 性格类型

#### 获取用户的钢笔性格类型

```
GET /pen-type/:userId

Response:
{
  "success": true,
  "penType": {
    "name": "优雅派",
    "description": "如同细腻的钢笔尖，你注重细节和美感",
    "characteristics": "精致、优雅、注重品质、追求完美、有艺术气质",
    "distribution": {
      "优雅派": 8,
      "实干派": 4,
      "创新派": 3
    }
  }
}
```

### 用户匹配

#### 获取相同性格类型的用户

```
GET /match/:userId

Response:
{
  "success": true,
  "penType": "优雅派",
  "matchCount": 5,
  "matches": [
    {
      "userId": 2,
      "username": "user2",
      "penType": "优雅派",
      "joinedAt": "2025-12-01T01:00:00.000Z"
    }
  ]
}
```

## 性格匹配算法

系统使用简单而有效的计分算法：

1. 用户完成所有题目后，每个选项对应一种钢笔性格类型
2. 统计所有答案中每种性格类型出现的次数
3. 出现次数最多的性格类型即为该用户的钢笔性格
4. 返回性格类型详情和分布情况

例如：用户答了15道题
- 优雅派: 8次
- 实干派: 4次
- 创新派: 3次

→ 该用户的性格类型为"优雅派"

## 安全特性

- ✅ 密码使用 bcrypt 加密存储
- ✅ JWT token 身份认证
- ✅ SQL 注入防护（参数化查询）
- ✅ 输入验证与清理
- ✅ 用户名/邮箱唯一性检查
- ✅ 密码强度验证

## 前端集成

前端项目位于 `../pen_match_frontend`，确保 API 地址配置正确：

```javascript
// src/api.js 或 src/config.js
const API_BASE = 'http://localhost:3000'
```

## 开发建议

1. **开发环境**: 使用 `npm run dev` 启动，支持代码修改后自动重启
2. **日志查看**: 服务器会输出所有 HTTP 请求日志
3. **错误处理**: 所有 API 返回统一格式的成功/失败响应
4. **数据库连接**: 启动时会自动测试 MySQL 连接

## 常见问题

### 数据库连接失败

- 检查 MySQL 服务是否启动
- 确认 `.env` 中的数据库凭据是否正确
- 确保数据库 `pen_match` 已创建

### JWT 认证失败

- 检查 `.env` 中的 `JWT_SECRET` 是否设置
- 确认前端请求头包含 `Authorization: Bearer <token>`

### 端口冲突

- 修改 `.env` 中的 `PORT` 值
- 或使用 `PORT=3001 npm start` 临时指定端口

## License

MIT
