import { useState } from "react";
import { Sparkles, RefreshCw, Copy, Check, ChevronRight, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { generateContentVariations, GeneratedContent, ContentGenerationRequest } from "@/lib/llm-providers";
import { cn } from "@/lib/utils";

const ContentGeneration = () => {
  const [ideaText, setIdeaText] = useState("");
  const [hook, setHook] = useState("");
  const [keyPoints, setKeyPoints] = useState<string[]>([""]);
  const [targetAudience, setTargetAudience] = useState("Business professionals");
  const [contentFormat, setContentFormat] = useState("storytelling");
  const [tone, setTone] = useState("professional");
  const [generating, setGenerating] = useState(false);
  const [variations, setVariations] = useState<GeneratedContent[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleAddKeyPoint = () => {
    setKeyPoints([...keyPoints, ""]);
  };

  const handleKeyPointChange = (index: number, value: string) => {
    const updated = [...keyPoints];
    updated[index] = value;
    setKeyPoints(updated);
  };

  const handleRemoveKeyPoint = (index: number) => {
    setKeyPoints(keyPoints.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (!ideaText) {
      toast.error("Please enter your content idea");
      return;
    }

    setGenerating(true);
    try {
      const request: ContentGenerationRequest = {
        idea: ideaText,
        hook: hook || undefined,
        keyPoints: keyPoints.filter(p => p.trim()),
        targetAudience,
        contentFormat,
        tone,
      };

      const results = await generateContentVariations(request, ['gemini', 'claude', 'gpt4'], 2);
      setVariations(results);
      setSelectedIndex(0);
      toast.success(`Generated ${results.length} content variations`);
    } catch (error) {
      toast.error("Failed to generate content");
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleApprove = (variation: GeneratedContent) => {
    // In production, this would save to database
    toast.success("Content approved and added to queue");
  };

  const handleRequestChanges = (variation: GeneratedContent) => {
    // In production, this would open a revision dialog
    toast.info("Revision request feature coming soon");
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 mb-2">Content Generation</h1>
          <p className="text-zinc-600">Transform ideas into engaging LinkedIn posts with AI assistance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Brief</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="idea">Main Idea</Label>
                  <Textarea
                    id="idea"
                    placeholder="What's the core message or story you want to share?"
                    value={ideaText}
                    onChange={(e) => setIdeaText(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="hook">Opening Hook (Optional)</Label>
                  <Input
                    id="hook"
                    placeholder="e.g., 'Here's what nobody tells you about...'"
                    value={hook}
                    onChange={(e) => setHook(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Key Points</Label>
                  <div className="space-y-2 mt-1">
                    {keyPoints.map((point, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Add a key point"
                          value={point}
                          onChange={(e) => handleKeyPointChange(index, e.target.value)}
                        />
                        {keyPoints.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveKeyPoint(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddKeyPoint}
                      className="w-full"
                    >
                      Add Key Point
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="audience">Target Audience</Label>
                    <Input
                      id="audience"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="format">Content Format</Label>
                    <Select value={contentFormat} onValueChange={setContentFormat}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="storytelling">Storytelling</SelectItem>
                        <SelectItem value="listicle">List/Tips</SelectItem>
                        <SelectItem value="howto">How-to Guide</SelectItem>
                        <SelectItem value="opinion">Opinion/Insight</SelectItem>
                        <SelectItem value="casestudy">Case Study</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="inspirational">Inspirational</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="analytical">Analytical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={generating || !ideaText}
                  className="w-full"
                  size="lg"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating Variations...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {variations.length > 0 && (
              <>
                {/* Variation Selector */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {variations.map((variation, index) => (
                    <Button
                      key={index}
                      variant={selectedIndex === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedIndex(index)}
                      className="shrink-0"
                    >
                      <Wand2 className="mr-1 h-3 w-3" />
                      {variation.provider.charAt(0).toUpperCase() + variation.provider.slice(1)} {Math.floor(index / 2) + 1}
                    </Button>
                  ))}
                </div>

                {/* Selected Variation */}
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Variation {selectedIndex + 1}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {variations[selectedIndex].provider}
                        </Badge>
                        <Badge variant="outline">
                          {variations[selectedIndex].estimatedReadTime} min read
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border">
                      <p className="whitespace-pre-wrap text-sm">
                        {variations[selectedIndex].content}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {variations[selectedIndex].hashtags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(variations[selectedIndex].content, selectedIndex)}
                        className="flex-1"
                      >
                        {copiedIndex === selectedIndex ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRequestChanges(variations[selectedIndex])}
                        className="flex-1"
                      >
                        Request Changes
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(variations[selectedIndex])}
                        className="flex-1"
                      >
                        <ChevronRight className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Other Variations Preview */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-zinc-600">Other Variations</h3>
                  {variations.map((variation, index) => {
                    if (index === selectedIndex) return null;
                    return (
                      <Card
                        key={index}
                        className={cn(
                          "cursor-pointer hover:shadow-md transition-shadow",
                          "opacity-70 hover:opacity-100"
                        )}
                        onClick={() => setSelectedIndex(index)}
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="outline" className="text-xs">
                              {variation.provider}
                            </Badge>
                            <span className="text-xs text-zinc-500">
                              {variation.estimatedReadTime} min
                            </span>
                          </div>
                          <p className="text-sm text-zinc-700 line-clamp-3">
                            {variation.content}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}

            {variations.length === 0 && !generating && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Sparkles className="h-12 w-12 text-zinc-300 mb-4" />
                  <p className="text-zinc-500">
                    Generated content will appear here
                  </p>
                  <p className="text-sm text-zinc-400 mt-1">
                    Enter your idea and click generate to see AI-powered variations
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentGeneration;