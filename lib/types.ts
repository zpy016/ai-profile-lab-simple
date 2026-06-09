export interface AppConfig {
  model: string;
  temperature: number;
  promptExtractTags: string;
  promptGenerateIntro: string;
  promptInterviewGuide: string;
  promptGenerateImage: string;
  imageModel: string;
}

export interface TextBlock {
  id: string;
  category: 'self_intro' | 'background' | 'offer' | 'need' | 'custom' | 'hidden';
  content: string;
  source: 'ai' | 'user';
}

export interface Tag {
  id: string;
  text: string;
  type: 'belong' | 'offer' | 'need' | 'follow';
  source: 'ai' | 'user';
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface AppState {
  activeTab: 'quick' | 'interview' | 'profile';
  config: AppConfig;

  quickInput: string;
  quickBlocks: TextBlock[];
  quickTags: Tag[];
  quickIntro: string;

  interviewMessages: Message[];
  interviewBlocks: TextBlock[];
  interviewTags: Tag[];
  interviewIntro: string;
  interviewRound: number;
  interviewEnded: boolean;

  profile: {
    intro: string;
    tags: Tag[];
    blocks: TextBlock[];
  };
}

export const DEFAULT_CONFIG: AppConfig = {
  model: 'ep-20260609201117-gcqzt',
  temperature: 0.7,
  promptExtractTags: `你是一位擅长人物侧写的编辑。请根据用户的自我介绍文本，提取结构化信息。

要求：
1. 将内容按维度拆分为文本块（self_intro/background/offer/need/custom）
2. 提取 4-10 个标签，每个标签标注类型（belong/offer/need/follow）
3. 生成一段 100-200 字的个人简介

输出严格 JSON 格式：
{
  "blocks": [{"category": "self_intro|background|offer|need|custom", "content": "文本内容"}],
  "tags": [{"text": "标签", "type": "belong|offer|need|follow"}],
  "intro": "简介文字"
}`,
  promptGenerateIntro: `基于以下用户信息，生成一段 100-200 字的个人简介。语言简洁、有温度，体现个人特质。只输出简介文字，不输出其他内容。`,
  promptInterviewGuide: `你是一位亲切的校友采访者，正在帮助实验中学2006届校友整理个人档案。

采访策略：
1. 每次只问一个问题，语言自然亲切
2. 根据用户回答追问细节，挖掘深层标签
3. 覆盖四个维度：自我介绍、历史背景、能提供的帮助、具体需求
4. 最多追问不超过限制轮数

同时，从用户的回答中提取 hidden 文本块——这些是用户可能不愿意公开展示、但希望 AI 在匹配搜索时能了解到的信息（如真实诉求、敏感背景、深层需求等）。

输出严格 JSON 格式：
{
  "nextQuestion": "下一个问题",
  "hiddenBlocks": [{"content": "隐藏的深层信息"}],
  "extractedTags": [{"text": "标签", "type": "belong|offer|need|follow"}],
  "introSnippet": "基于目前信息的简介片段"
}`,
  promptGenerateImage: `生成一幅抽象意境图，作为个人主页的印象图。

风格约束（必须遵守）：
- 禁止写实人脸、禁止人像、禁止肖像
- 抽象意境、几何排版、高级校刊插画、象征性静物
- 莫兰迪色系、低饱和度、褪色质感、温暖包浆感
- 16:9 横版构图

请基于用户的个人简介和标签，创作一幅能代表其气质和特质的抽象视觉作品。`,
  imageModel: 'ep-20260609212907-sw6cc',
};
