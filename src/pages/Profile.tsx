import { useMemo, useState } from "react";
import SEO from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { sampleProfile, type ExperienceItem, type SampleProfile } from "@/data/sampleProfile";
import { sampleOnboarding, type OnboardingQA } from "@/data/sampleOnboarding";
import { toast } from "@/hooks/use-toast";

const Pill = ({ children }: { children: string }) => (
  <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">{children}</Badge>
);

const Profile = () => {
  const [profile, setProfile] = useState<SampleProfile>(sampleProfile);
  const [story, setStory] = useState<OnboardingQA[]>(sampleOnboarding);

  const skills = useMemo(
    () =>
      (profile.topSkillsByEndorsements || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [profile.topSkillsByEndorsements]
  );

  // Dialog state
  const [aboutOpen, setAboutOpen] = useState(false);
  const [aboutDraft, setAboutDraft] = useState(profile.about || "");

  const [expOpen, setExpOpen] = useState(false);
  const [newExp, setNewExp] = useState<Partial<ExperienceItem>>({ title: "", subtitle: "", caption: "", logo: "" });

  const [skillOpen, setSkillOpen] = useState(false);
  const [skillDraft, setSkillDraft] = useState("");

  const [newStoryOpen, setNewStoryOpen] = useState(false);
  const [newStory, setNewStory] = useState<{ category: OnboardingQA["category"]; question: string; answer: string }>(
    { category: "Your Experiences", question: "", answer: "" }
  );

  const [storyOpenIdx, setStoryOpenIdx] = useState<number | null>(null);
  const [storyDraft, setStoryDraft] = useState<{ question: string; answer: string }>({ question: "", answer: "" });

  // Alias to keep JSX mostly unchanged
  const p = profile;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={`${p.fullName} – Profile`}
        description={`${p.fullName} · ${p.headline}`}
        canonicalPath="/profile"
      />

      <main className="mx-auto max-w-6xl px-4 pt-10 pb-16 animate-enter">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left: LinkedIn profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card */}
            <section className="border-gradient-brand rounded-2xl overflow-hidden">
              <div className="h-36 bg-gradient-brand-soft" aria-hidden />
              <div className="p-6 relative">
                <img
                  src={p.profilePicHighQuality || p.profilePic || ""}
                  alt={`${p.fullName} profile photo`}
                  className="h-28 w-28 rounded-full border-4 border-card object-cover -mt-16"
                  loading="lazy"
                />
                <div className="mt-4">
                  <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{p.fullName}</h1>
                  <p className="mt-1 text-sm md:text-base text-muted-foreground">{p.headline}</p>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  {p.addressWithCountry && <span>{p.addressWithCountry}</span>}
                  {p.connections ? <span>• {p.connections.toLocaleString()} connections</span> : null}
                  {p.followers ? <span>• {p.followers.toLocaleString()} followers</span> : null}
                </div>
              </div>
            </section>

            {/* About */}
            {p.about && (
              <section className="border-gradient-brand rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium tracking-tight">About</h2>
                  <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit About</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2">
                        <Label htmlFor="about">About</Label>
                        <Textarea id="about" value={aboutDraft} onChange={(e) => setAboutDraft(e.target.value)} rows={8} />
                      </div>
                      <DialogFooter>
                        <Button onClick={() => {
                          setProfile({ ...profile, about: aboutDraft });
                          setAboutOpen(false);
                          toast({ title: "Saved", description: "About updated" });
                        }}>Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{p.about}</p>
              </section>
            )}

            {/* Experience */}
            {p.experiences?.length ? (
              <section className="border-gradient-brand rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium tracking-tight">Experience</h2>
                  <Dialog open={expOpen} onOpenChange={setExpOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">Add</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add experience</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="exp-title">Title</Label>
                          <Input id="exp-title" value={newExp.title ?? ""} onChange={(e) => setNewExp({ ...newExp, title: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="exp-subtitle">Subtitle</Label>
                          <Input id="exp-subtitle" value={newExp.subtitle ?? ""} onChange={(e) => setNewExp({ ...newExp, subtitle: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="exp-caption">Caption</Label>
                          <Input id="exp-caption" value={newExp.caption ?? ""} onChange={(e) => setNewExp({ ...newExp, caption: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="exp-logo">Logo URL</Label>
                          <Input id="exp-logo" value={newExp.logo ?? ""} onChange={(e) => setNewExp({ ...newExp, logo: e.target.value })} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => {
                          if (!newExp.title) { toast({ title: "Title is required" }); return; }
                          setProfile({
                            ...profile,
                            experiences: [ ...(profile.experiences ?? []), {
                              title: newExp.title as string,
                              subtitle: newExp.subtitle ?? "",
                              caption: newExp.caption ?? "",
                              logo: newExp.logo ?? "",
                            } as ExperienceItem ],
                          });
                          setNewExp({ title: "", subtitle: "", caption: "", logo: "" });
                          setExpOpen(false);
                          toast({ title: "Added", description: "Experience added" });
                        }}>Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <ul className="mt-3 space-y-4">
                  {p.experiences.map((exp, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      {exp.logo ? (
                        <img src={exp.logo} alt={`${exp.subtitle || exp.title} logo`} className="h-10 w-10 rounded-md object-cover" loading="lazy" />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-muted" />
                      )}
                      <div>
                        <div className="font-medium text-sm md:text-base text-foreground">{exp.title}</div>
                        {exp.subtitle && <div className="text-sm text-muted-foreground">{exp.subtitle}</div>}
                        {exp.caption && <div className="text-xs text-muted-foreground">{exp.caption}</div>}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* Education */}
            {p.educations?.length ? (
              <section className="border-gradient-brand rounded-2xl p-6">
                <h2 className="text-lg font-medium tracking-tight">Education</h2>
                <ul className="mt-3 space-y-4">
                  {p.educations.map((edu, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      {edu.logo ? (
                        <img src={edu.logo} alt={`${edu.title} logo`} className="h-10 w-10 rounded-md object-cover" loading="lazy" />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-muted" />
                      )}
                      <div>
                        <div className="font-medium text-sm md:text-base text-foreground">{edu.title}</div>
                        {edu.subtitle && <div className="text-sm text-muted-foreground">{edu.subtitle}</div>}
                        {edu.caption && <div className="text-xs text-muted-foreground">{edu.caption}</div>}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* Skills */}
            {skills.length ? (
              <section className="border-gradient-brand rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium tracking-tight">Top skills</h2>
                  <Dialog open={skillOpen} onOpenChange={setSkillOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">Add</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add skill</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-1">
                        <Label htmlFor="skill">Skill</Label>
                        <Input id="skill" value={skillDraft} onChange={(e) => setSkillDraft(e.target.value)} />
                      </div>
                      <DialogFooter>
                        <Button onClick={() => {
                          if (!skillDraft.trim()) { toast({ title: "Enter a skill" }); return; }
                          const nextSkills = [...skills, skillDraft.trim()];
                          setProfile({ ...profile, topSkillsByEndorsements: nextSkills.join(", ") });
                          setSkillDraft("");
                          setSkillOpen(false);
                          toast({ title: "Added", description: "Skill added" });
                        }}>Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <Badge key={`${s}-${i}`} variant="secondary" className="rounded-full px-3 py-1 text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {/* Right: Onboarding story */}
          <aside className="lg:col-span-1 space-y-6">
            <section className="border-gradient-brand rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium tracking-tight">Your story</h2>
                <Dialog open={newStoryOpen} onOpenChange={setNewStoryOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">Add</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add story item</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="cat">Category</Label>
                        <select id="cat" className="w-full rounded-md border bg-background p-2" value={newStory.category}
                          onChange={(e) => setNewStory({ ...newStory, category: e.target.value as OnboardingQA["category"] })}>
                          <option value="Your Experiences">Your Experiences</option>
                          <option value="Your Beliefs">Your Beliefs</option>
                          <option value="Your Bounce AI Story">Your Bounce AI Story</option>
                          <option value="Your Vision">Your Vision</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="q">Question</Label>
                        <Input id="q" value={newStory.question} onChange={(e) => setNewStory({ ...newStory, question: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="a">Answer</Label>
                        <Textarea id="a" rows={6} value={newStory.answer} onChange={(e) => setNewStory({ ...newStory, answer: e.target.value })} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => {
                        if (!newStory.question.trim() || !newStory.answer.trim()) { toast({ title: "Fill all fields" }); return; }
                        const nextId = story.length ? Math.max(...story.map((i) => i.id)) + 1 : 1;
                        setStory([...story, { id: nextId, category: newStory.category, question: newStory.question, answer: newStory.answer }]);
                        setNewStory({ category: "Your Experiences", question: "", answer: "" });
                        setNewStoryOpen(false);
                        toast({ title: "Added", description: "Story item added" });
                      }}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              {["Your Experiences","Your Beliefs","Your Bounce AI Story","Your Vision"].map((cat) => {
                const items = story.filter((q) => q.category === cat);
                if (!items.length) return null;
                return (
                  <div key={cat} className="mt-4">
                    <div className="text-sm font-medium text-foreground mb-2">{cat}</div>
                    <ol className="space-y-3">
                      {items.map((item) => (
                        <li key={item.id} className="rounded-xl bg-secondary/40 p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="text-sm font-medium text-foreground">{item.id}. {item.question}</div>
                            <Dialog open={storyOpenIdx === item.id} onOpenChange={(open) => !open && setStoryOpenIdx(null)}>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => { setStoryOpenIdx(item.id); setStoryDraft({ question: item.question, answer: item.answer }); }}>Edit</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit story item</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-3">
                                  <div className="space-y-1">
                                    <Label htmlFor={`q-${item.id}`}>Question</Label>
                                    <Input id={`q-${item.id}`} value={storyDraft.question} onChange={(e) => setStoryDraft({ ...storyDraft, question: e.target.value })} />
                                  </div>
                                  <div className="space-y-1">
                                    <Label htmlFor={`a-${item.id}`}>Answer</Label>
                                    <Textarea id={`a-${item.id}`} rows={6} value={storyDraft.answer} onChange={(e) => setStoryDraft({ ...storyDraft, answer: e.target.value })} />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button onClick={() => {
                                    setStory(story.map((s) => (s.id === item.id ? { ...s, question: storyDraft.question, answer: storyDraft.answer } : s)));
                                    setStoryOpenIdx(null);
                                    toast({ title: "Saved", description: "Story item updated" });
                                  }}>Save</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">{item.answer}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Profile;
