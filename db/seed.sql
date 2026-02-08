-- Sample data for ResearchBridge
INSERT INTO users (id, name, role, department, major, grade, campus, email)
VALUES
  ('20240101', '测试学生', 'student', '计算机学院', '计算机科学与技术', '大三', '本部校区', 'student@university.edu.cn'),
  ('20240102', '陈同学', 'student', '计算机学院', '计算机科学与技术', '大三', '本部校区', 'chen@student.edu.cn'),
  ('20240103', '林同学', 'student', '软件学院', '软件工程', '大四 (已保研)', '沙河校区', 'lin@student.edu.cn'),
  ('20240104', '赵同学', 'student', '材料学院', '电子工程', '大二', '本部校区', 'zhao@student.edu.cn'),
  ('T001', '张教授', 'teacher', '计算机学院', NULL, NULL, '本部校区', 'zhang@university.edu.cn'),
  ('T002', '李老师', 'teacher', '网络空间安全学院', NULL, NULL, '沙河校区', 'li@university.edu.cn'),
  ('T003', '王博士', 'teacher', '材料学院', NULL, NULL, '本部校区', 'wang@university.edu.cn');

INSERT INTO projects (title, description, tags, department, level, status, campus, capacity, deadline, teacher_id)
VALUES
  ('基于大模型的医学影像分析', '利用最新的大语言模型与多模态模型对医学影像进行解读和辅助诊断。', '[\"AI\",\"医疗\",\"深度学习\"]', '计算机学院', '导师纵向课题', '招募中', '本部校区', 8, '2026-03-30', 'T001'),
  ('高性能区块链共识算法研究', '研究在超大规模节点下的低延迟共识机制，并解决性能瓶颈。', '[\"区块链\",\"分布式系统\"]', '网络空间安全学院', '国创项目', '招募中', '沙河校区', 6, '2026-04-15', 'T002'),
  ('柔性电子材料的稳定性优化', '通过分子工程手段提高柔性屏幕材料在极端环境下的使用寿命。', '[\"材料科学\",\"物理\"]', '材料学院', '校企横向项目', '名额已满', '本部校区', 4, '2026-02-28', 'T003');

INSERT INTO project_members (project_id, student_id)
VALUES
  (1, '20240102'),
  (1, '20240104'),
  (2, '20240103');

INSERT INTO project_join_requests (project_id, student_id, status)
VALUES
  (1, '20240101', 'pending');

INSERT INTO notifications (user_id, title, body)
VALUES
  ('T001', '新的加入申请', '20240101 申请加入你的项目：基于大模型的医学影像分析'),
  ('20240101', '申请已提交', '你的加入申请已提交，等待导师审核');
