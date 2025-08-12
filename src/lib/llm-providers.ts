// LLM Provider Integration Layer
// This module provides a unified interface for multiple LLM providers

export type LLMProvider = 'gemini' | 'claude' | 'gpt4';

export interface LLMConfig {
  provider: LLMProvider;
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ContentGenerationRequest {
  idea: string;
  hook?: string;
  keyPoints?: string[];
  targetAudience?: string;
  contentFormat?: string;
  tone?: string;
  wordCount?: number;
}

export interface GeneratedContent {
  content: string;
  hook: string;
  hashtags: string[];
  estimatedReadTime: number;
  provider: LLMProvider;
  model: string;
}

// Provider-specific configurations
const PROVIDER_CONFIGS = {
  gemini: {
    model: 'gemini-2.0-flash-exp',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    maxTokens: 2048,
  },
  claude: {
    model: 'claude-3-5-sonnet-20241022',
    endpoint: 'https://api.anthropic.com/v1/messages',
    maxTokens: 4096,
  },
  gpt4: {
    model: 'gpt-4-turbo-preview',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    maxTokens: 4096,
  },
};

// Base LLM Provider class
abstract class BaseLLMProvider {
  protected config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  abstract generateContent(request: ContentGenerationRequest): Promise<GeneratedContent>;
  
  protected buildPrompt(request: ContentGenerationRequest): string {
    const parts = [
      'Create a LinkedIn post based on the following:',
      '',
      `Main Idea: ${request.idea}`,
    ];

    if (request.hook) {
      parts.push(`Hook/Opening: ${request.hook}`);
    }

    if (request.keyPoints && request.keyPoints.length > 0) {
      parts.push(`Key Points to Cover:`);
      request.keyPoints.forEach((point, i) => {
        parts.push(`${i + 1}. ${point}`);
      });
    }

    if (request.targetAudience) {
      parts.push(`Target Audience: ${request.targetAudience}`);
    }

    if (request.contentFormat) {
      parts.push(`Format: ${request.contentFormat}`);
    }

    if (request.tone) {
      parts.push(`Tone: ${request.tone}`);
    }

    if (request.wordCount) {
      parts.push(`Approximate Word Count: ${request.wordCount}`);
    }

    parts.push('');
    parts.push('Requirements:');
    parts.push('- Start with a compelling hook that grabs attention');
    parts.push('- Use line breaks for readability');
    parts.push('- Include 3-5 relevant hashtags at the end');
    parts.push('- Make it engaging and actionable');
    parts.push('- Avoid promotional language');
    parts.push('- Focus on providing value');

    return parts.join('\n');
  }

  protected extractHashtags(content: string): string[] {
    const hashtagRegex = /#\w+/g;
    const matches = content.match(hashtagRegex) || [];
    return matches.map(tag => tag.slice(1)); // Remove the # symbol
  }

  protected estimateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}

// Gemini Provider Implementation
class GeminiProvider extends BaseLLMProvider {
  async generateContent(request: ContentGenerationRequest): Promise<GeneratedContent> {
    const prompt = this.buildPrompt(request);
    const config = PROVIDER_CONFIGS.gemini;
    
    // In production, this would make an actual API call
    // For now, return a mock response
    const mockContent = this.generateMockContent(request);
    
    return {
      content: mockContent.content,
      hook: mockContent.hook,
      hashtags: this.extractHashtags(mockContent.content),
      estimatedReadTime: this.estimateReadTime(mockContent.content),
      provider: 'gemini',
      model: config.model,
    };
  }

  private generateMockContent(request: ContentGenerationRequest) {
    return {
      hook: request.hook || "Here's what nobody tells you about building in public:",
      content: `${request.hook || "Here's what nobody tells you about building in public:"}

${request.idea}

${request.keyPoints ? request.keyPoints.join('\n\n') : 'The key is consistency and authenticity.'}

What's been your experience?

#BuildInPublic #StartupLife #Entrepreneurship #ContentStrategy #LinkedInTips`,
    };
  }
}

// Claude Provider Implementation
class ClaudeProvider extends BaseLLMProvider {
  async generateContent(request: ContentGenerationRequest): Promise<GeneratedContent> {
    const prompt = this.buildPrompt(request);
    const config = PROVIDER_CONFIGS.claude;
    
    // Mock response for development
    const mockContent = this.generateMockContent(request);
    
    return {
      content: mockContent.content,
      hook: mockContent.hook,
      hashtags: this.extractHashtags(mockContent.content),
      estimatedReadTime: this.estimateReadTime(mockContent.content),
      provider: 'claude',
      model: config.model,
    };
  }

  private generateMockContent(request: ContentGenerationRequest) {
    return {
      hook: request.hook || "I spent 100 hours researching this, so you don't have to:",
      content: `${request.hook || "I spent 100 hours researching this, so you don't have to:"}

${request.idea}

Here's what I learned:

${request.keyPoints ? request.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n') : '1. Start with the problem\n2. Validate early\n3. Iterate based on feedback'}

The bottom line?
Focus on solving real problems for real people.

#ProductDevelopment #StartupLessons #Innovation #TechLeadership #Growth`,
    };
  }
}

// GPT-4 Provider Implementation
class GPT4Provider extends BaseLLMProvider {
  async generateContent(request: ContentGenerationRequest): Promise<GeneratedContent> {
    const prompt = this.buildPrompt(request);
    const config = PROVIDER_CONFIGS.gpt4;
    
    // Mock response for development
    const mockContent = this.generateMockContent(request);
    
    return {
      content: mockContent.content,
      hook: mockContent.hook,
      hashtags: this.extractHashtags(mockContent.content),
      estimatedReadTime: this.estimateReadTime(mockContent.content),
      provider: 'gpt4',
      model: config.model,
    };
  }

  private generateMockContent(request: ContentGenerationRequest) {
    return {
      hook: request.hook || "The best advice I received this year:",
      content: `${request.hook || "The best advice I received this year:"}

${request.idea}

Why this matters:

${request.keyPoints ? request.keyPoints.map(p => `→ ${p}`).join('\n') : '→ It changes your perspective\n→ It drives action\n→ It creates results'}

Remember: Execution beats perfection every time.

What's the best advice you've received?

#Leadership #PersonalGrowth #BusinessStrategy #Success #LinkedInCommunity`,
    };
  }
}

// Factory for creating LLM providers
export class LLMProviderFactory {
  static create(config: LLMConfig): BaseLLMProvider {
    switch (config.provider) {
      case 'gemini':
        return new GeminiProvider(config);
      case 'claude':
        return new ClaudeProvider(config);
      case 'gpt4':
        return new GPT4Provider(config);
      default:
        throw new Error(`Unsupported LLM provider: ${config.provider}`);
    }
  }
}

// Main function to generate content variations
export async function generateContentVariations(
  request: ContentGenerationRequest,
  providers: LLMProvider[] = ['gemini', 'claude', 'gpt4'],
  variationsPerProvider: number = 2
): Promise<GeneratedContent[]> {
  const results: GeneratedContent[] = [];
  
  for (const provider of providers) {
    const llm = LLMProviderFactory.create({ provider });
    
    for (let i = 0; i < variationsPerProvider; i++) {
      // Add slight variations to the request for diversity
      const variedRequest = {
        ...request,
        tone: i === 0 ? request.tone : getAlternativeTone(request.tone),
      };
      
      const content = await llm.generateContent(variedRequest);
      results.push(content);
    }
  }
  
  return results;
}

// Helper function to get alternative tones
function getAlternativeTone(originalTone?: string): string {
  const tones = ['professional', 'conversational', 'inspirational', 'educational', 'analytical'];
  const currentIndex = tones.indexOf(originalTone || 'professional');
  return tones[(currentIndex + 1) % tones.length];
}

// Export convenience functions for direct use
export async function generateWithGemini(request: ContentGenerationRequest): Promise<GeneratedContent> {
  const provider = new GeminiProvider({ provider: 'gemini' });
  return provider.generateContent(request);
}

export async function generateWithClaude(request: ContentGenerationRequest): Promise<GeneratedContent> {
  const provider = new ClaudeProvider({ provider: 'claude' });
  return provider.generateContent(request);
}

export async function generateWithGPT4(request: ContentGenerationRequest): Promise<GeneratedContent> {
  const provider = new GPT4Provider({ provider: 'gpt4' });
  return provider.generateContent(request);
}