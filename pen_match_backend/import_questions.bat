@echo off
chcp 65001
echo 正在导入新题目到数据库...
echo 请输入您的MySQL密码
mysql --default-character-set=utf8mb4 -u root -p pen_match < "db\seed_new.sql"
if %errorlevel% == 0 (
    echo.
    echo ✓ 题目导入成功！
    echo ✓ 已添加8种笔类型
    echo ✓ 已添加30道心理测试题
) else (
    echo.
    echo ✗ 导入失败，请检查MySQL连接
)
pause
