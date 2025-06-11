
import { INQUIRY_TYPE_VALUES } from '@/constants/inquiryTypes';
import { MESSAGE_SOURCE_VALUES } from '@/constants/messageSources';

// Sample data for generating realistic demo messages
export const sampleNames = [
  'Sarah Johnson', 'Michael Chen', 'Emma Williams', 'David Rodriguez', 'Lisa Anderson',
  'James Miller', 'Maria Garcia', 'Robert Taylor', 'Jennifer Brown', 'Christopher Davis',
  'Amanda Wilson', 'Daniel Martinez', 'Nicole Thompson', 'Ryan Lee', 'Katherine White',
  'Andrew Clark', 'Stephanie Lewis', 'Matthew Hall', 'Rachel Young', 'Kevin King'
];

export const emailDomains = [
  'gmail.com', 'outlook.com', 'yahoo.com', 'company.com', 'startup.io',
  'tech-corp.com', 'innovate.co', 'business.net', 'enterprise.org', 'solutions.com'
];

// Use centralized inquiry types - ONLY these values
export const inquiryTypes = INQUIRY_TYPE_VALUES;

// Use centralized message sources - ONLY these values
export const sources = MESSAGE_SOURCE_VALUES;

// Updated subject templates to match our centralized inquiry types
export const subjectTemplates = [
  'General Inquiry About Your Services',
  'Collaboration Opportunity',
  'Exciting Job Opportunity',
  'Freelance Project Proposal', 
  'Speaking Engagement Invitation',
  'Professional Inquiry',
  'Partnership Discussion',
  'Technical Consulting Request',
  'Career Opportunity',
  'Project Collaboration Request'
];

// Updated message templates to align with our centralized inquiry types
export const messageTemplates = [
  // General inquiries
  `Hi there! I came across your portfolio and wanted to reach out with a general inquiry about your services. Could we schedule a brief call to discuss potential opportunities?`,
  
  `Hello! I'm interested in learning more about your professional background and expertise. Would you be available for a conversation about potential collaboration?`,
  
  // Collaboration messages
  `Hello! I'm reaching out regarding a potential collaboration on a React/TypeScript project. Your experience with modern web technologies aligns perfectly with what we're looking for. Would you be available for a brief call?`,
  
  `Hi! I noticed your work on some impressive web applications. We're working on an innovative project and could use your expertise in React and Node.js. Interested in collaborating?`,
  
  // Job opportunity messages  
  `Hi there! I came across your portfolio and I'm really impressed with your technical skills. We have an exciting job opportunity for a Senior Full-Stack Developer position at our company. Would you be interested in discussing this further?`,
  
  `Hello! Your experience with React, TypeScript, and modern development practices is exactly what we're looking for for a full-time position. We're offering a remote role with excellent benefits. Can we schedule a call?`,
  
  // Freelance project messages
  `Hi! Your portfolio caught my attention, particularly your work with TypeScript and modern frameworks. We have a freelance project opportunity that might interest you. Would you like to discuss the details?`,
  
  `Hello there! We're building the next generation of web applications and need a talented freelance developer like yourself. The project offers competitive compensation and the chance to work with cutting-edge technologies.`,
  
  // Speaking engagement messages
  `Hi! I'm organizing a tech conference and would love to have you as a speaker. Your expertise in full-stack development would be valuable to our audience. Are you interested in speaking opportunities?`,
  
  `Hello! We're hosting a developer meetup and would be honored to have you share your knowledge with our community. Would you be interested in giving a talk about modern web development?`
];
