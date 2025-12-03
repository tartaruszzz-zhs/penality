-- 设置客户端字符集
SET NAMES utf8mb4;

USE pen_match;

-- 禁用外键检查和严格模式
SET FOREIGN_KEY_CHECKS = 0;
SET SESSION sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

-- 彻底删除旧表
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS pen_types;
DROP TABLE IF EXISTS users;

-- 重新创建表（指定字符集和存储引擎）
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50),
    phone VARCHAR(20) UNIQUE NOT NULL,
    pen_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_pen_type (pen_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pen_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(50) UNIQUE NOT NULL,
    description LONGTEXT,
    characteristics LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question_text LONGTEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    pen_type_a VARCHAR(50) NOT NULL,
    pen_type_b VARCHAR(50) NOT NULL,
    pen_type_c VARCHAR(50) NOT NULL,
    pen_type_d VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE answers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    question_id INT NOT NULL,
    selected_option CHAR(1) NOT NULL,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_question (user_id, question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 重新启用外键检查
SET FOREIGN_KEY_CHECKS = 1;

-- 插入新的笔类型（8种）
INSERT INTO pen_types (type_name, description, characteristics) VALUES
('FountainPen', '钢笔 - 坚守与秩序', '你是理性的建构者，追求完美的秩序和永恒的价值。你相信规则、传统和精致的美学。'),
('Marker', '马克笔 - 热烈与张扬', '你是生命力的爆发，渴望被看见、被记住。你不怕犯错，因为存在本身就是意义。'),
('Crayon', '蜡笔 - 纯真与野性', '你保留着本能的直觉和孩童的真诚。你拒绝被驯化，保持着原始的生命力。'),
('Stylus', '触控笔 - 理性与未来', '你是逻辑的信徒，相信数据和效率。你追求精准，拥抱科技，向往人类的进化。'),
('Quill', '羽毛笔 - 深沉与忧郁', '你是灵魂的诗人，在孤独中感受深度。你拥抱痛苦，因为它赋予生命厚重的质感。'),
('Brush', '毛笔 - 禅意与超脱', '你是东方的智者，看淡执念，随遇而安。你明白万物无常，因此活在当下的流动中。'),
('Chalk', '粉笔 - 奉献与传承', '你是温柔的燃烧者，愿意消耗自己来点亮他人。你相信教育、启蒙和薪火相传。'),
('Pencil', '铅笔 - 温和与适应', '你是灵活的调和者，善于妥协和修正。你相信过程比结果重要，接受不完美。');

-- 插入30道心理测试题目
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, pen_type_a, pen_type_b, pen_type_c, pen_type_d) VALUES 
('当所有的灯光都熄灭，你认为"黑暗"的本质是？', 
 '是混乱的深渊，必须建立秩序来对抗它。', 
 '是巨大的画布，正好可以涂抹最耀眼的色彩。', 
 '是温柔的怀抱，万物在此回归原始的混沌。', 
 '是数据的缺失，需要扫描和填补的盲区。', 
 'FountainPen', 'Marker', 'Crayon', 'Stylus'),

('如果记忆可以被交易，你愿意用什么换取"遗忘一段痛苦"？', 
 '我不换。痛苦是我的墨水，它书写了我的深度。', 
 '用我的部分寿命。只要当下快乐，长短无所谓。', 
 '用这段记忆本身。像擦掉铅笔字一样，只留下痕迹。', 
 '不需要交易。痛苦本就是幻象，如风过疏竹。', 
 'Quill', 'Marker', 'Pencil', 'Brush'),

('你眼中的"真理"，长什么样子？', 
 '像一座宏伟的大理石宫殿，坚不可摧。', 
 '像写在黑板上的公式，教会人之后便随风而去。', 
 '像一条流动的河，会随着主观意识而变化。', 
 '像一行完美的源代码，运行着宇宙的底层逻辑。', 
 'FountainPen', 'Chalk', 'Brush', 'Stylus'),

('面对一个正在崩塌的世界，你会选择做一个？', 
 '记录者。在废墟中写下最后的史诗。', 
 '修补匠。能救一个是一个，尽力缝补裂痕。', 
 '守夜人。哪怕化为灰烬，也要发出最后的光。', 
 '旁观者。坐看云起云灭，崩塌也是一种美。', 
 'Quill', 'Pencil', 'Chalk', 'Brush'),

('如果必须给你的生命定义一种"遗憾"，你希望是？', 
 '未完成的杰作。留给后人无限的遐想。', 
 '燃烧后的灰烬。至少我曾毫无保留地给过。', 
 '错过的辉煌。本该成为王，却流浪在荒野。', 
 '童年的丢失。那个纯真的我，死在了成长的路上。', 
 'Pencil', 'Chalk', 'FountainPen', 'Crayon'),

('"自由"对你来说，更像是什么？', 
 '脱离肉体，意识不再被约束，永恒穿梭。', 
 '想哭就哭，想笑就笑，不被礼教束缚的野兽。', 
 '在严格的律动中找到的间隙，如格律诗。', 
 '一阵风。没有方向，也没有归宿。', 
 'Stylus', 'Crayon', 'FountainPen', 'Brush'),

('当你凝视深渊时，你觉得深渊在说什么？', 
 '"跳下来吧，这里有你从未体验过的疯狂。"', 
 '"这里很安静，没有数据的噪点。"', 
 '"你的悲伤如此迷人，让我拥抱你。"', 
 '"你看，万物皆空。"', 
 'Marker', 'Stylus', 'Quill', 'Brush'),

('假如你是一件艺术品，你希望被摆放在哪里？', 
 '国家博物馆的防弹玻璃后，接受万世瞻仰。', 
 '城市的涂鸦墙上，每天和路人对话，直到被覆盖。', 
 '学校的教室里，被孩子们的手指抚摸，直到磨损。', 
 '你卧室的床头，只有在深夜才被你看见。', 
 'FountainPen', 'Marker', 'Chalk', 'Quill'),

('你认为人与人之间，真正能互相理解吗？', 
 '不能。我们是孤独的岛屿，只能遥望。', 
 '能。只要我们的思维方式一致。', 
 '不需要理解。我们只需要在一起玩耍，像孩子一样。', 
 '可以尝试。理解是一个不断试错和修正的过程。', 
 'Quill', 'Stylus', 'Crayon', 'Pencil'),

('如果要把你的灵魂具象化，它会是？', 
 '一块正在燃烧的煤炭，温暖却在自我消耗。', 
 '精密运转的齿轮，冷静地咬合每一秒。', 
 '一棵老树，根扎在泥里，叶子随风而动。', 
 '一座金字塔，指向天空，渴望不朽。', 
 'Chalk', 'Stylus', 'Brush', 'FountainPen'),

('关于"爱"，你最认同的一句话是？', 
 '爱是给予，哪怕把自己磨成粉末。', 
 '爱是占有，我要在你的生命里涂满我的颜色。', 
 '爱是契约，是我们在混乱世界里订立的盟誓。', 
 '爱是直觉，喜欢就是喜欢，没有为什么。', 
 'Chalk', 'Marker', 'FountainPen', 'Crayon'),

('你最害怕变成什么样的人？', 
 '麻木的人。失去了痛感，也失去了美感。', 
 '无用的人。不再被别人需要，你的生死在此刻对于别人毫无意义。', 
 '虚伪的大人。戴着面具，忘记了怎么真诚地笑。', 
 '停滞的人。不再改变，固守在一个错误的答案里。', 
 'Quill', 'Stylus', 'Crayon', 'Pencil'),

('如果明天是世界末日，你今晚会做什么？', 
 '把我知道的所有知识写下来，装进漂流瓶。', 
 '去裸奔，去尖叫，去释放最后一点生命力。', 
 '整理好衣冠，像个贵族一样迎接终结。', 
 '什么也不做。末日也是自然的一部分。', 
 'Chalk', 'Crayon', 'FountainPen', 'Brush'),

('回首往昔岁月，你会因为什么而感到惋惜？', 
 '即便很小就意识到一切美好的事物都要去争取，但还是因为自己的不自信而放弃。', 
 '太过在意别人的眼光，而无法迈开步伐去成为自己想成为的人。', 
 '如果当时勇敢一些，或许我会和自己真心相爱的人在一起。', 
 '我没什么可遗憾的，我都走到了正确的一步。', 
 'FountainPen', 'Marker', 'Pencil', 'Stylus'),

('当你听到一首让你流泪的老歌，你会？', 
 '沉浸其中，享受这种忧伤的甜蜜。', 
 '赶紧切歌，我不喜欢这种失控的感觉。', 
 '跟着哼唱，像小时候一样毫无顾忌。', 
 '静静听完，感叹时光匆匆，缘来缘去。', 
 'Quill', 'Stylus', 'Crayon', 'Brush'),

('如果人生是一场考试，你希望如何交卷？', 
 '铃声响的一刻，刚好把最后一题教会别人。', 
 '提前交卷，并在卷子上画个鬼脸。', 
 '反复检查，直到每一个字都完美无缺。', 
 '写满草稿，虽然答案未定，但过程精彩。', 
 'Chalk', 'Crayon', 'FountainPen', 'Pencil'),

('你认为"成熟"意味着什么？', 
 '学会了控制情绪，像机器一样精准运作。', 
 '学会了妥协，明白黑白之间有大片的灰。', 
 '学会了隐藏，把真实的自己保护在坚硬的壳里。', 
 '学会了看淡，明白得失荣辱皆为浮云。', 
 'Stylus', 'Pencil', 'Quill', 'Brush'),

('如果能拥有一扇任意门，你想通往哪里？', 
 '通往未来，我想看人类进化的终点。', 
 '通往过去，我想挽回那个雨天的遗憾。', 
 '通往荒野，我想找回那个还没被驯化的自己。', 
 '通往舞台中央，让世界都看到我的光芒。', 
 'Stylus', 'Quill', 'Crayon', 'Marker'),

('你如何看待别人的批评？', 
 '如果符合逻辑，我接受并更新我的数据库。', 
 '愤怒或不屑，只有我能定义我自己。', 
 '有则改之，无则加勉，这是修行的助缘。', 
 '那是他们的偏见，与我何干？', 
 'Stylus', 'Marker', 'Chalk', 'FountainPen'),

('在一段关系中，你通常是？', 
 '付出者。燃烧自己，温暖对方。', 
 '引导者。设定规则，把握方向。', 
 '陪伴者。随时准备调整自己来适应对方。', 
 '依赖者。像孩子一样渴望无条件的宠爱。', 
 'Chalk', 'FountainPen', 'Pencil', 'Crayon'),

('看到街边的流浪猫，你会想？', 
 '在它的世界观中它自由吗？还是只是在受苦？', 
 '万物刍狗，它有它的命运。', 
 '想把它带回家，给它起个名字，给它一个家。', 
 '分析流浪动物对城市生态系统的影响。', 
 'Quill', 'Brush', 'Pencil', 'Stylus'),

('你认为"美"的最高境界是？', 
 '对称、秩序、黄金分割的理性之光。', 
 '破碎、短暂、瞬息即逝的樱花之死。', 
 '野性、粗砺、未经修饰的原始生命力。', 
 '留白、含蓄、言有尽而意无穷。', 
 'FountainPen', 'Quill', 'Crayon', 'Brush'),

('如果你的墓志铭只能写一个词，你会选？', 
 '启蒙 (Enlightenment)。', 
 '传奇 (Legend)。', 
 '无我 (Void)。', 
 '永恒 (Eternity)。', 
 'Chalk', 'Marker', 'Brush', 'FountainPen'),

('做决定时，你听谁的？', 
 '听大数据的分析，概率不会撒谎。', 
 '听直觉，身体的反应比大脑更快。', 
 '听内心的原则，哪怕与世界为敌。', 
 '听别人的建议，集思广益总没错。', 
 'Stylus', 'Crayon', 'FountainPen', 'Pencil'),

('你觉得孤独是？', 
 '一种可耻的失败，说明我不受欢迎。', 
 '一种必要的清净，正好可以复盘和充电。', 
 '一种诗意的栖居，灵魂在独处中升华。', 
 '一种常态。人生而孤独，死亦孤独。', 
 'Marker', 'Stylus', 'Quill', 'Brush'),

('假如你是一本书，你希望被谁读到？', 
 '渴望知识的孩子，我要成为他们的阶梯。', 
 '拥有权力的智者，我要影响历史的走向。', 
 '懂我的人，哪怕世上只有这一个。', 
 '所有人。我要成为畅销书，摆在最显眼的位置。', 
 'Chalk', 'FountainPen', 'Quill', 'Marker'),

('面对不公，你会？', 
 '拔剑而起，为了正义不惜玉石俱焚。', 
 '冷静收集证据，用法律和规则制裁他。', 
 '写文章揭露它，让思想成为武器。', 
 '感到愤怒，但不会主动出击，直到有人来帮我。', 
 'Marker', 'FountainPen', 'Chalk', 'Crayon'),

('你认为人类未来的希望在于？', 
 '科技的奇点。人机融合，超越肉体限制。', 
 '教育的普及。点亮每一盏心灯。', 
 '回归自然。找回失落的灵性与和谐。', 
 '艺术的复兴。只有美能拯救世界。', 
 'Stylus', 'Chalk', 'Brush', 'Quill'),

('最后，请凭直觉选出一个意象。', 
 '一支在这个世界孤独跳舞的红玫瑰。', 
 '一块已经被写满、又被擦去的黑板。', 
 '一张甚至还没有被涂色的白纸。', 
 '一块静静躺在河底千万年的石头。', 
 'Marker', 'Chalk', 'Pencil', 'Brush'),

('测试结束了，你希望得到什么样的结果？', 
 '只要别说我是个普通人就行，我希望我是特别的。', 
 '希望结果能给我一些实用的建议，让我变得更好。', 
 '无所谓，反正只是个游戏，准不准都行。', 
 '希望它能说出我内心深处连我自己都没察觉的东西。', 
 'Crayon', 'Pencil', 'Marker', 'FountainPen');
