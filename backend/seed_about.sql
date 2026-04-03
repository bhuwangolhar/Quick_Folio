-- Default About section data
INSERT INTO "Abouts" (
  "section",
  "heading",
  "subtitle",
  "description",
  "stat1_value",
  "stat1_label",
  "stat2_value",
  "stat2_label",
  "stat3_value",
  "stat3_label",
  "stat4_value",
  "stat4_label",
  "createdAt",
  "updatedAt"
) VALUES (
  '01 - ABOUT',
  'The person behind the code',
  'A passion for transforming ideas into elegant digital solutions that make an impact.',
  'I''m a Full Stack Developer with a deep fascination for building modern web applications that solve real-world problems. Currently focused on creating seamless user experiences with cutting-edge technologies.

Beyond coding, I believe in continuous learning and sharing knowledge with the developer community. I''m always excited to collaborate on innovative projects that push boundaries.',
  '10+',
  'PROJECTS COMPLETED',
  '5+',
  'TECH STACKS',
  '3+',
  'YEARS EXPERIENCE',
  '100%',
  'COMMITMENT',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;
